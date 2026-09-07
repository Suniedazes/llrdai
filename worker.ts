import {configuredProvider} from './lib/website-ai/provider';
import {answerQuestion} from './lib/website-ai/service';
import {DurableObject} from 'cloudflare:workers';
import {contactDelivery} from './lib/contact-delivery';
import handler from 'vinext/server/fetch-handler';
import {consumeQuota,type QuotaState} from './lib/shared-quota';
// One coordinator per site/function: only 4 AI admissions/minute, no external I/O in storage transactions.
export class SiteQuota extends DurableObject<Record<string,string>> {
 async acceptance(){
  const run=this.env.LLRD_AI_ACCEPTANCE_RUN;
  if(run!=='2026-09-finishing-v2')return {status:'disabled'};
  const key='acceptance:'+run;
  const claimed=await this.ctx.storage.transaction(async txn=>{if(await txn.get(key))return false;await txn.put(key,{status:'running'});return true;});
  if(!claimed)return this.ctx.storage.get(key);
  const provider=configuredProvider({...this.env,LLRD_AI_ENABLED:'true'});
  if(!provider){await this.ctx.storage.put(key,{status:'blocked',reason:'configuration'});return this.ctx.storage.get(key);}
  const fixtures=[['sonie','I want to preserve family history and memories']];
  const results=[];
  for(const [name,query] of fixtures){
   if(!await this.allow((name==='injection'?'b':'a').repeat(64),'ai')){results.push({name,pass:false,reason:'quota'});continue;}
   try{const r=await answerQuestion(query,provider);const expected=name==='sonie'||name==='elseside';results.push({name,pass:expected?r.ids.includes(name):r.ids.length===0,ids:r.ids});}catch(error){const code=error instanceof Error?error.message:'';results.push({name,pass:false,reason:/^(provider_http_[0-9]{3}|quota|invalid_output)$/.test(code)?code:'provider_or_output'});}
  }
  const report={status:results.every(r=>r.pass)?'pass':'blocked',results};await this.ctx.storage.put(key,report);return report;
 }
 async acceptanceStatus(){return this.ctx.storage.get('acceptance:2026-09-finishing-v2');}
 async allow(client:string,kind:'ai'|'contact'){
  if(!/^[a-f0-9]{64}$/.test(client)||!['ai','contact'].includes(kind))return false;
  return this.ctx.storage.transaction(async txn=>{
   const result=consumeQuota(await txn.get<QuotaState>('quota'),client,kind);
   if(result.allowed){await txn.put('quota',result.state);await txn.setAlarm((result.state.day+1)*86400000);}
   return result.allowed;
  });
 }
 async alarm(){await this.ctx.storage.transaction(async txn=>{const q=await txn.get<QuotaState>('quota');if(q&&q.day<Math.floor(Date.now()/86400000))await txn.delete('quota');});}
}
const worker = {
 async fetch(request:Request,env:{ASSETS:Fetcher;SITE_QUOTA:DurableObjectNamespace<SiteQuota>;LLRD_AI_ENABLED:string;LLRD_AI_TRUSTED_IP_HEADER:string;LLRD_AI_ACCEPTANCE_RUN?:string;SITE_INDEXABLE?:string},ctx:ExecutionContext){
  const url=new URL(request.url);
  // Bounded owner-authorized acceptance suite: fixed public prompts, once only, no visitor input or secret output.
  if(url.pathname==='/api/health/ai-acceptance'&&request.method==='GET'&&env.LLRD_AI_ACCEPTANCE_RUN==='2026-09-finishing-v2'){
   const test=env.SITE_QUOTA.getByName('llrd.ai:ai');ctx.waitUntil(test.acceptance());
   return Response.json((await test.acceptanceStatus())||{status:'queued'},{headers:{'Cache-Control':'no-store'}});
  }
  if(request.method==='POST'&&['/api/discovery/ai','/api/contact'].includes(url.pathname)){
   const kind=url.pathname.endsWith('/ai')?'ai':'contact';
   // Disabled capabilities never consume a shared quota or send data to a provider.
   if(kind==='ai'&&env.LLRD_AI_ENABLED!=='true')return Response.json({message:'LLRD’s AI assistant is temporarily unavailable. You can continue exploring our products or contact LLRD for assistance.'},{status:503,headers:{'Cache-Control':'no-store'}});
   if(kind==='contact'&&!contactDelivery.collectionEnabled)return handler.fetch(request,env,ctx);
   if(request.headers.get('origin')!==url.origin)return new Response(null,{status:403});
   const ip=request.headers.get('CF-Connecting-IP');
   if(!env.SITE_QUOTA||!ip||env.LLRD_AI_TRUSTED_IP_HEADER!=='CF-Connecting-IP')return new Response(null,{status:503});
   try{
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${Math.floor(Date.now()/86400000)}:${ip}`));
    const key=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
    const allowed=await env.SITE_QUOTA.getByName(`llrd.ai:${kind}`).allow(key,kind);
    if(!allowed)return Response.json({message:'Please wait before trying again.'},{status:429,headers:{'Cache-Control':'no-store','Retry-After':'60'}});
   }catch{return Response.json({message:'LLRD’s AI assistant is temporarily unavailable. You can continue exploring our products or contact LLRD for assistance.'},{status:503});}
  }
  const response=await handler.fetch(request,env,ctx);
  if(env.SITE_INDEXABLE!=='true'){const headers=new Headers(response.headers);headers.set('X-Robots-Tag','noindex, nofollow');return new Response(response.body,{status:response.status,statusText:response.statusText,headers});}
  return response;
 }
};
export default worker;



