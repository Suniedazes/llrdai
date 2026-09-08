import {integrations} from './lib/operations/integrations';
import {DurableObject} from 'cloudflare:workers';
import {operations} from './config/operations-monitoring';
import {collect} from './lib/operations/collectors';
import {addMetric,localDate,severity,renderReport,type Counts,type Metric,type Report,type Check} from './lib/operations/core';
import {sendReport} from './lib/operations/email';
import {contactDelivery} from './lib/contact-delivery';
export class OperationsMonitor extends DurableObject<Record<string,string>> {
 async record(metric:Metric){
  const key='metric:'+Math.floor(Date.now()/1800000)*1800000;
  await this.ctx.storage.transaction(async tx=>{await tx.put(key,addMetric(await tx.get<Counts>(key)||{},metric));});
 }
 async healthy(){
  const last=await this.ctx.storage.get<{at:number;critical:boolean}>('last');
  const report=await this.ctx.storage.get<Report>('latest-report');
  return !!last&&Date.now()-last.at<75*60000&&!last.critical&&(!report?false:report.emailAccepted&&report.level!=='RED'&&Date.now()-Date.parse(report.at)<27*3600000);
 }
 async tick(now=Date.now()){
  if(this.env.OPS_ENABLED!=='true')return;
  const slot=Math.floor(now/1800000);
  const claimed=await this.ctx.storage.transaction(async tx=>{if(await tx.get('slot')===slot)return false;await tx.put('slot',slot);return true;});
  if(!claimed)return;
  const local=localDate(now,this.env.OPS_TIMEZONE||operations.timezone);
  let reportKey='report:'+local.date;
  const initial=this.env.OPS_INITIAL_REPORT_ID;
  const bootstrap=!!initial&&!await this.ctx.storage.get('bootstrap:'+initial);
  const due=(local.hour>=operations.reportHour&&!await this.ctx.storage.get(reportKey))||bootstrap;
  const previous=await this.ctx.storage.get<Record<string,number>>('failures')||{};
  const current=await collect(this.env,previous,due);
  await this.ctx.storage.put('failures',current.failures);
  await this.ctx.storage.put('last',{at:now,critical:current.checks.some(c=>c.level==='RED')});
  await this.ctx.storage.put('sample:'+now,{at:now,checks:current.checks});
  if(!due)return;
  if(bootstrap&&local.hour<operations.reportHour)reportKey='bootstrap-report:'+initial;
  // Persist the claim BEFORE external delivery. A crash never causes an automatic duplicate email.
  if(bootstrap)await this.ctx.storage.put('bootstrap:'+initial,true);
  const at=new Date(now).toISOString();
  const report:Report={at,date:local.date,level:'YELLOW',checks:[],counts:{},trends:{},generated:false,emailAccepted:false,deliveryVerified:'NOT AVAILABLE',sendState:'generating'};
  await this.ctx.storage.put(reportKey,report);await this.ctx.storage.put('latest-report',report);
  const buckets=await this.ctx.storage.list<Counts>({prefix:'metric:'});
  for(const [key,count] of buckets){const t=Number(key.slice(7));if(t>=now-86400000&&t<=now){for(const [k,v] of Object.entries(count))report.counts[k]=(report.counts[k]||0)+v;}if(t<now-2*86400000)await this.ctx.storage.delete(key);}
  const history=await this.ctx.storage.list<Report>({prefix:'report:'});
  for(const days of [7,30,90]){const rows=[...history.values()].filter(r=>r.generated&&Date.parse(r.at)>=now-days*86400000);report.trends[days+'d']={observedDays:rows.length,redDays:rows.filter(r=>r.level==='RED').length,contactAccepted:rows.reduce((n,r)=>n+(r.counts['contact.accepted']||0),0),aiResponses:rows.reduce((n,r)=>n+(r.counts['ai.accepted']||0),0),emailFailures:rows.filter(r=>!r.emailAccepted).length};}
  const observations=await this.ctx.storage.list<{at:number;checks:Check[]}>({prefix:'sample:'});
  const websiteSamples=[...observations.values()].filter(s=>s.at>=now-86400000).flatMap(s=>s.checks.filter(c=>c.name===operations.site+'/'));
  const observedFailures=websiteSamples.filter(c=>!c.evidence.startsWith('HTTP 200')).length;
  const c=report.counts;const gaps:Check[]=[
   {name:'WEBSITE 24h samples',level:observedFailures?'YELLOW':'GREEN',evidence:`${websiteSamples.length} samples available; ${observedFailures} failed. Sampled availability ${websiteSamples.length?((websiteSamples.length-observedFailures)/websiteSamples.length*100).toFixed(1):'unknown'}%. Not continuous uptime.`},
   {name:'CONTACT',level:(c['contact.failures']||0)>=3?'RED':'GREEN',evidence:`Public collection ${contactDelivery.collectionEnabled?'enabled':'disabled'}. Aggregated responses: ${JSON.stringify(c)}. Graph acceptance is not inbox-delivery verification. Separate auth/timeout classification unavailable.`},
   {name:'AI / GROQ',level:(c['ai.failures']||0)>0||(c['ai.attempts']||0)>=80?'YELLOW':'GREEN',evidence:`Enabled=${this.env.LLRD_AI_ENABLED}; model=${this.env.LLRD_AI_MODEL}. Shared limits: 3/client/min, 4/site/min, 100/day. API attempts are not provider token usage. Account free-tier remainder/deprecation deadline unavailable; no inference probes or paid fallback.`},
   ...['Search sitemap submissions / index coverage','Cloudflare geography / bandwidth','Core Web Vitals / Lighthouse','Microsoft permission drift / service principal metadata','Certificate expiration / registrar expiry'].map(name=>({name,level:'YELLOW' as const,evidence:'NOT CONNECTED / NOT AVAILABLE. Owner configuration required; no fabricated success.'})),
   {name:'SECURITY',level:'YELLOW',evidence:'Independent GitHub dependency/health workflow prepared. Notification subscription and GitHub security-alert access require owner verification.'},
  ];
  const oldDns=[...history.values()].filter(r=>r.generated).sort((a,b)=>b.at.localeCompare(a.at))[0];
  for(const check of current.checks.filter(c=>c.name.startsWith('DNS '))){const old=oldDns?.checks.find(c=>c.name===check.name);if(old&&old.evidence!==check.evidence)current.checks.push({name:'DNS change '+check.name,level:'YELLOW',evidence:'Record changed since previous report; review DNS configuration. No changes made by monitor.'});}
  report.checks=[...current.checks,...gaps,...await integrations(this.env)];report.level=severity(report.checks);report.generated=true;report.sendState='sending';
  await this.ctx.storage.put(reportKey,report);await this.ctx.storage.put('latest-report',report);
  const sent=await sendReport(`LLRD Daily Operations Report — ${local.date} — ${report.level}`,renderReport(report),this.env);
  report.emailAccepted=sent.accepted;report.sendState=sent.state;
  await this.ctx.storage.put(reportKey,report);await this.ctx.storage.put('latest-report',report);
  for(const [key,r] of history)if(Date.parse(r.at)<now-operations.retentionDays*86400000)await this.ctx.storage.delete(key);
  const samples=await this.ctx.storage.list({prefix:'sample:'});for(const key of samples.keys())if(Number(key.slice(7))<now-2*86400000)await this.ctx.storage.delete(key);
  console.info('operations_report',{generated:true,emailAccepted:sent.accepted,state:sent.state});
 }
}
