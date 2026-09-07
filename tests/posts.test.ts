import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {createPostStore,StoreConflict} from "../lib/post-store";
import {parsePost,type PostInput} from "../lib/posts";
import {localHost,authorizedStudio} from "../lib/studio-access";
const input:PostInput={title:"Test update",slug:"test-update",summary:"Summary",body:"Article",status:"DRAFT",social:{facebook:"FB",instagram:"IG",tiktok:"TT"}};
test("posts persist, enforce revisions and unique URLs, and can be unpublished",async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),"llrd-posts-"));
 try{const store=createPostStore(dir);const draft=await store.save(input);assert.equal((await createPostStore(dir).list())[0].id,draft.id);
 const published=await store.save({...draft,status:"PUBLISHED"});assert(published.publishedAt);assert.equal(published.revision,2);
 await assert.rejects(store.save({...draft,title:"Stale"}),StoreConflict);
 await assert.rejects(store.save(input),StoreConflict);
 const withdrawn=await store.save({...published,status:"DRAFT"});assert.equal(withdrawn.status,"DRAFT");assert.equal(withdrawn.social.instagram,"IG");
 }finally{await rm(dir,{recursive:true,force:true});}
});
test("post validation rejects path traversal, invalid states and empty publication",()=>{
 assert.throws(()=>parsePost({...input,slug:"../privacy"}));assert.throws(()=>parsePost({...input,status:"OTHER"}));assert.throws(()=>parsePost({...input,status:"PUBLISHED",body:""}));assert.throws(()=>parsePost({...input,title:"x".repeat(151)}));
});
test("studio fails closed and rejects cross-origin writes",()=>{
 const enabled=process.env.LLRD_LOCAL_STUDIO,token=process.env.LLRD_STUDIO_TOKEN;
 try{delete process.env.LLRD_LOCAL_STUDIO;assert.equal(authorizedStudio(new Request("http://127.0.0.1:3000")),false);
 process.env.LLRD_LOCAL_STUDIO="true";process.env.LLRD_STUDIO_TOKEN="test-secret";
 const make=(origin:string,host="127.0.0.1:3000")=>new Request("http://127.0.0.1:3000/api/studio/posts",{headers:{host,origin,"x-studio-token":"test-secret"}});
 assert(authorizedStudio(make("http://127.0.0.1:3000")));assert(!authorizedStudio(make("https://example.com")));assert(!authorizedStudio(make("http://127.0.0.1:3000","llrd.ai")));assert(!localHost("127.0.0.1.evil.test"));assert(!localHost("[::]"));
 }finally{if(enabled===undefined)delete process.env.LLRD_LOCAL_STUDIO;else process.env.LLRD_LOCAL_STUDIO=enabled;if(token===undefined)delete process.env.LLRD_STUDIO_TOKEN;else process.env.LLRD_STUDIO_TOKEN=token;}
});
