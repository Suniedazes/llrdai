import test from 'node:test';
import assert from 'node:assert/strict';
import {POST,GET} from '../app/api/discovery/ai/route';
import {answerQuestion} from '../lib/website-ai/service';
import {limiter} from '../lib/website-ai/limits';
import {configuredProvider} from '../lib/website-ai/provider';
test('AI disabled and foreign-origin requests fail closed',async()=>{assert.equal((await (await GET()).json()).available,false);assert.equal((await POST(new Request('http://localhost/api/discovery/ai',{method:'POST',headers:{origin:'https://foreign.example'}}))).status,403);});
test('approved fact selection cannot introduce invented content or destinations',async()=>{await assert.rejects(answerQuestion('Tell me about SONIE',{selectFacts:async()=>({ids:['invented']})}));const result=await answerQuestion('Tell me about SONIE',{selectFacts:async()=>({ids:['sonie']})});assert.deepEqual(result.ids,['sonie']);assert.match(result.answer,/Coming Soon/);assert.equal(result.links[0].href,'/products/sonie');});
test('sensitive content is rejected before provider call and unknown questions route to contact',async()=>{let calls=0;const p={selectFacts:async()=>{calls++;return {ids:[]};}};await answerQuestion('my password is something',p);assert.equal(calls,0);const result=await answerQuestion('What is your revenue?',p);assert.match(result.answer,/don’t have/);assert.equal(result.links[0].href,'/contact');});
test('limiter enforces quotas and separates keys',()=>{assert.equal(limiter.allow('test-user-one',1,60000),true);assert.equal(limiter.allow('test-user-one',1,60000),false);assert.equal(limiter.allow('test-user-two',1,60000),true);});
test('Groq quota failure does not call another provider',async()=>{const saved={...process.env};const original=globalThis.fetch;let calls=0;try{process.env.LLRD_AI_ENABLED='true';process.env.LLRD_AI_PROVIDER='groq';process.env.LLRD_AI_FREE_PLAN_CONFIRMED='true';process.env.GROQ_API_KEY='test-only';globalThis.fetch=async()=>{calls++;return new Response('',{status:429});};await assert.rejects(configuredProvider()!.selectFacts('Tell me about LLRD',[]));assert.equal(calls,1);process.env.LLRD_AI_PROVIDER='unknown';assert.equal(configuredProvider(),null);}finally{globalThis.fetch=original;for(const key of ['LLRD_AI_ENABLED','LLRD_AI_PROVIDER','LLRD_AI_FREE_PLAN_CONFIRMED','GROQ_API_KEY']){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}}});

test('enabled AI validates malformed, extra and oversized input before provider calls',async()=>{
 const saved={...process.env};const original=globalThis.fetch;let calls=0;
 try{Object.assign(process.env,{LLRD_AI_ENABLED:'true',LLRD_AI_PROVIDER:'groq',LLRD_AI_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'test-only',LLRD_AI_TRUSTED_IP_HEADER:'CF-Connecting-IP'});globalThis.fetch=async()=>{calls++;return new Response('',{status:500});};
 const cases=[['{',400],['x'.repeat(5000),413],[JSON.stringify({query:'a'}),422],[JSON.stringify({query:'Tell me about SONIE',file:'no'}),422]] as const;
 for(const [i,[body,status]] of cases.entries()){const r=await POST(new Request('https://llrd.ai/api/discovery/ai',{method:'POST',headers:{origin:'https://llrd.ai','content-type':'application/json','CF-Connecting-IP':'test-'+i},body}));assert.equal(r.status,status);}assert.equal(calls,0);
 }finally{globalThis.fetch=original;for(const key of ['LLRD_AI_ENABLED','LLRD_AI_PROVIDER','LLRD_AI_FREE_PLAN_CONFIRMED','GROQ_API_KEY','LLRD_AI_TRUSTED_IP_HEADER']){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}}
});
