import test from 'node:test';
import assert from 'node:assert/strict';
import {consumeQuota,type QuotaState} from '../lib/shared-quota';
test('shared quota bounds clients and global requests across reloaded state',()=>{let state:QuotaState|undefined;for(let i=0;i<3;i++){const r=consumeQuota(state,'a','ai',0);assert(r.allowed);state=JSON.parse(JSON.stringify(r.state));}assert(!consumeQuota(state,'a','ai',0).allowed);const r=consumeQuota(state,'b','ai',0);assert(r.allowed);state=r.state;assert(!consumeQuota(state,'c','ai',0).allowed);assert(consumeQuota(state,'a','ai',60000).allowed);});
test('daily quota persists across minute boundaries and resets next UTC day',()=>{let state:QuotaState|undefined;for(let i=0;i<100;i++){const r=consumeQuota(state,'a','ai',i*60000);assert(r.allowed);state=r.state;}assert(!consumeQuota(state,'b','ai',101*60000).allowed);assert(consumeQuota(state,'b','ai',86400000).allowed);});
test('contact quota has its own bounded budget',()=>{let state:QuotaState|undefined;for(let i=0;i<10;i++){const r=consumeQuota(state,String(i),'contact',0);assert(r.allowed);state=r.state;}assert(!consumeQuota(state,'other','contact',0).allowed);});

