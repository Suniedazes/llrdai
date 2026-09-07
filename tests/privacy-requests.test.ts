import test from 'node:test';
import assert from 'node:assert/strict';
import {privacyOptions,validateInquiry} from '../lib/contact';
import {deliverInquiry} from '../lib/inquiry-delivery';
test('all privacy categories validate and acceptance gets a case ID at the single mailbox',async()=>{
 for(const service of privacyOptions){const inquiry={name:'Example',email:'test@example.com',service,message:'Request details',website:''};assert.deepEqual(validateInquiry(inquiry).errors,{});await assert.rejects(deliverInquiry(inquiry,null));const result=await deliverInquiry(inquiry,{accept:async e=>{assert.equal(e.recipient,'contactus@llrd.ai');assert.match(e.caseId,/^LLRD-/);return {accepted:true,providerId:'test-acceptance'};}});assert.equal(result.ok,true);}
});
