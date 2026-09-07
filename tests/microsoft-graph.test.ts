import test from 'node:test';
import assert from 'node:assert/strict';
import {microsoftGraphDelivery} from '../lib/microsoft-graph-delivery';
const env={LLRD_CONTACT_PROVIDER:'microsoft-graph',MS_GRAPH_TENANT_ID:'00000000-0000-4000-8000-000000000001',MS_GRAPH_CLIENT_ID:'00000000-0000-4000-8000-000000000002',MS_GRAPH_CLIENT_SECRET:'test-only'};
const envelope={caseId:'LLRD-00000000-0000-4000-8000-000000000003',recipient:'contactus@llrd.ai',inquiry:{name:'Test',email:'visitor@example.com',service:'General',message:'Test inquiry',website:''}};
test('Graph stays unconfigured without server credentials',()=>assert.equal(microsoftGraphDelivery({}),null));
test('Graph routes only to approved mailbox and requires provider acceptance',async()=>{
 const calls:Array<{url:string;body:string}>=[];
 const request=(async(url,init)=>{calls.push({url:String(url),body:String(init?.body)});return calls.length===1?Response.json({access_token:'test-only'}):new Response(null,{status:202,headers:{'request-id':'provider-test'}});}) as typeof fetch;
 const adapter=microsoftGraphDelivery(env,request)!;
 assert.deepEqual(await adapter.accept(envelope),{accepted:true,providerId:'provider-test'});
 const message=JSON.parse(calls[1].body).message;assert.equal(message.toRecipients[0].emailAddress.address,'contactus@llrd.ai');assert.equal(message.replyTo[0].emailAddress.address,'visitor@example.com');assert.equal(message.body.contentType,'Text');
 await assert.rejects(adapter.accept({...envelope,recipient:'unapproved@example.com'}));assert.equal(calls.length,2);
});
test('Graph failure and ambiguous acceptance do not retry or claim success',async()=>{
 for(const status of [202,429,500]){let calls=0;const request=(async()=>++calls===1?Response.json({access_token:'test-only'}):new Response(null,{status})) as typeof fetch;await assert.rejects(microsoftGraphDelivery(env,request)!.accept(envelope));assert.equal(calls,2);}
});
