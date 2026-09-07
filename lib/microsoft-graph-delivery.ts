import {company} from '@/content/company';
import type {InquiryDelivery} from './inquiry-delivery';

// Server-side only. This adapter never retries an ambiguous send response.
export function microsoftGraphDelivery(env:NodeJS.ProcessEnv=process.env,request:typeof fetch=fetch):InquiryDelivery|null {
 const tenant=env.MS_GRAPH_TENANT_ID,client=env.MS_GRAPH_CLIENT_ID,secret=env.MS_GRAPH_CLIENT_SECRET;
 if(env.LLRD_CONTACT_PROVIDER!=='microsoft-graph'||!tenant||!client||!secret)return null;
 if(!/^[a-f0-9-]{36}$/i.test(tenant)||!/^[a-f0-9-]{36}$/i.test(client))return null;
 return {async accept({caseId,recipient,inquiry}){
  if(recipient!==company.businessEmail)throw new Error('recipient_not_approved');
  const signal=AbortSignal.timeout(10000);
  const auth=await request(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,{method:'POST',signal,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:client,client_secret:secret,scope:'https://graph.microsoft.com/.default',grant_type:'client_credentials'})});
  if(!auth.ok)throw new Error('graph_auth_failed');
  const token=await auth.json() as {access_token?:string};
  if(!token.access_token)throw new Error('graph_auth_failed');
  const sent=await request(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(company.businessEmail)}/sendMail`,{method:'POST',signal,headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json','client-request-id':caseId.replace(/^LLRD-/,''),'return-client-request-id':'true'},body:JSON.stringify({message:{subject:`[${caseId}] ${inquiry.service}`,body:{contentType:'Text',content:`Case: ${caseId}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nCategory: ${inquiry.service}\n\n${inquiry.message}`},toRecipients:[{emailAddress:{address:recipient}}],replyTo:[{emailAddress:{address:inquiry.email}}]},saveToSentItems:true})});
  if(sent.status!==202)throw new Error('graph_send_not_accepted');
  const providerId=sent.headers.get('request-id');
  if(!providerId)throw new Error('graph_acceptance_unconfirmed');
  return {accepted:true,providerId};
 }};
}
