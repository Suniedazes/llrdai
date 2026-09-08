import {operations} from '../../config/operations-monitoring';
import {health,seo,sitemapUrls,robotsAllows,expiry,boundedText,type Check} from './core';
export async function collect(env:Record<string,string|undefined>,previous:Record<string,number>,daily:boolean,request:typeof fetch=fetch){
 const checks:Check[]=[];const failures:Record<string,number>={};const pages=new Map<string,string>();
 for(const path of [...operations.endpoints,...operations.products.map(p=>p.url)]){
  const url=path.startsWith('https:')?path:operations.site+path;const r=await health(url,request);const bad=r.status!==200||!r.text.trim();failures[url]=bad?(previous[url]||0)+1:0;
  checks.push({name:url,level:bad?(failures[url]>=2&&path==='/'?'RED':'YELLOW'):r.ms>operations.slowMs?'YELLOW':'GREEN',evidence:`HTTP ${r.status||'unavailable'}; ${r.ms} ms; ${bad?'consecutive failed checks '+failures[url]:'HTTPS response received'}`+(r.location?'; redirect requires review':''),ms:r.ms});
  if(r.status===200)pages.set(url,r.text);
  if(path==='/'&&r.status===200){const s=seo(r.text);checks.push({name:'Search indexing',level:env.SITE_INDEXABLE==='true'&&!s.noindex&&!r.noindex?'GREEN':'YELLOW',evidence:`SITE_INDEXABLE=${env.SITE_INDEXABLE}; noindex=${s.noindex||r.noindex}`});}
 }
 const robots=pages.get(operations.site+'/robots.txt')||'';checks.push({name:'Robots',level:robotsAllows(robots)?'GREEN':'YELLOW',evidence:robotsAllows(robots)?'General search crawling allowed':'Missing, malformed or blocking general crawlers'});
 let urls:string[]=[];try{urls=sitemapUrls(pages.get(operations.site+'/sitemap.xml')||'');checks.push({name:'Sitemap',level:urls.length?'GREEN':'YELLOW',evidence:`${urls.length} same-site URLs sampled (cap ${operations.crawlLimit})`});}catch{checks.push({name:'Sitemap',level:'YELLOW',evidence:'Invalid or unavailable sitemap'});}
 if(daily){
  checks.push(expiry(env.MS_GRAPH_SECRET_EXPIRES_AT));
  const dnsQueries=[['llrd.ai','MX'],['llrd.ai','TXT'],['_dmarc.llrd.ai','TXT'],['selector1._domainkey.llrd.ai','CNAME'],['selector2._domainkey.llrd.ai','CNAME'],['llrd.ai','NS']];
  for(const [name,type] of dnsQueries){try{const r=await request(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(8000)});const d=JSON.parse(await boundedText(r,40000)) as {Status:number;Answer?:{data:string}[]};const values=(d.Answer||[]).map(a=>a.data);const ok=r.ok&&d.Status===0&&values.length>0&&(type!=='MX'||values.some(v=>v.includes('mail.protection.outlook.com')))&&(name!=='llrd.ai'||type!=='TXT'||values.some(v=>v.includes('v=spf1')&&v.includes('spf.protection.outlook.com')))&&(name!=='_dmarc.llrd.ai'||values.some(v=>v.includes('v=DMARC1')));checks.push({name:`DNS ${name} ${type}`,level:ok?'GREEN':'YELLOW',evidence:ok?values.join('; ').slice(0,1000):'Expected DNS record missing or lookup failed'});}catch{checks.push({name:`DNS ${name} ${type}`,level:'YELLOW',evidence:'DNS lookup unavailable'});}}
  if(env.GROQ_API_KEY){try{const r=await request('https://api.groq.com/openai/v1/models',{headers:{Authorization:`Bearer ${env.GROQ_API_KEY}`},signal:AbortSignal.timeout(8000)});const d=JSON.parse(await boundedText(r,100000)) as {data?:{id:string}[]};checks.push({name:'Groq model access',level:r.ok&&d.data?.some(m=>m.id===env.LLRD_AI_MODEL)?'GREEN':'YELLOW',evidence:r.ok?`Configured model ${env.LLRD_AI_MODEL}; model list checked without inference`:`Model lookup HTTP ${r.status}`});}catch{checks.push({name:'Groq model access',level:'YELLOW',evidence:'Model lookup unavailable'});}}
  for(const url of urls.slice(0,10)){if(!pages.has(url)){const r=await health(url,request);if(r.status===200)pages.set(url,r.text);else checks.push({name:'Broken link '+url,level:'YELLOW',evidence:`HTTP ${r.status}; one sample, verify before changes`});}}
 }
 const titles=new Set<string>();for(const [url,html] of pages){if(!html.includes('<html'))continue;const s=seo(html);const issues=[!s.title?'missing title':'',!s.description?'missing description':'',!s.canonical?'missing canonical':'',s.noindex?'noindex':'',!s.openGraph?'missing Open Graph':'',titles.has(s.title)?'duplicate title':''].filter(Boolean);titles.add(s.title);if(issues.length)checks.push({name:'SEO '+url,level:'YELLOW',evidence:issues.join(', ')});}
 return {checks,failures};
}
