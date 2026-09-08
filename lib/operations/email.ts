import {operations} from '../../config/operations-monitoring';
import {boundedText} from './core';
// Separate notification adapter: never invokes the public contact route.
// Exactly one retry only for an explicit 429 refusal. Ambiguous sends are never retried.
export async function sendReport(subject:string,body:string,env:Record<string,string|undefined>,request:typeof fetch=fetch){
 const {MS_GRAPH_TENANT_ID:tenant,MS_GRAPH_CLIENT_ID:client,MS_GRAPH_CLIENT_SECRET:secret}=env;
 if(!tenant||!client||!secret)return {accepted:false,state:'missing_configuration'};
 try{
  const auth=await request(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,{method:'POST',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:client,client_secret:secret,scope:'https://graph.microsoft.com/.default',grant_type:'client_credentials'})});
  if(!auth.ok)return {accepted:false,state:'graph_auth_failed'};
  const token=JSON.parse(await boundedText(auth,32000)) as {access_token?:string};
  if(!token.access_token)return {accepted:false,state:'graph_auth_failed'};
  for(let attempt=0;attempt<2;attempt++){
   const r=await request(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(operations.recipient)}/sendMail`,{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({message:{subject:subject.slice(0,150),body:{contentType:'Text',content:body.slice(0,60000)},toRecipients:[{emailAddress:{address:operations.recipient}}]},saveToSentItems:true})});
   if(r.status===202)return {accepted:!!r.headers.get('request-id'),state:r.headers.get('request-id')?'accepted':'acceptance_unconfirmed'};
   const delay=Number(r.headers.get('retry-after'));await r.body?.cancel();
   if(attempt===0&&r.status===429&&Number.isFinite(delay)&&delay>=1&&delay<=5){await new Promise(resolve=>setTimeout(resolve,delay*1000));continue;}
   return {accepted:false,state:`graph_http_${r.status}`};
  }
 }catch{return {accepted:false,state:'network_or_timeout_acceptance_unknown'};}
 return {accepted:false,state:'not_accepted'};
}

