import test from "node:test";
import assert from "node:assert/strict";
import {validateInquiry} from "../lib/contact";
import {POST} from "../app/api/contact/route";
const valid={name:"Test Person",organization:"Example Organization",email:"test@example.com",service:"Website Development",message:"A website inquiry for validation testing.",phone:"",preferred:"Email",website:""};
const req=(data:unknown,origin="http://localhost")=>new Request("http://localhost/api/contact",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(data)});
test("contact validates required fields, formats, enums and lengths",()=>{assert.deepEqual(validateInquiry(valid).errors,{});assert.equal(Object.keys(validateInquiry({}).errors).length,4);assert(validateInquiry({...valid,email:"bad",service:"bad",message:"x".repeat(5001)}).errors.email);assert(validateInquiry({...valid,message:"x".repeat(5001)}).errors.message);});
test("contact rejects cross-origin and bot submissions without delivery",async()=>{assert.equal((await POST(req(valid,"https://other.example"))).status,403);assert.equal((await POST(req({...valid,website:"spam"}))).status,400);assert.equal((await POST(req({...valid,email:"bad"}))).status,422);});
test("unconfigured contact never acknowledges successful delivery",async()=>{const r=await POST(req(valid));assert.equal(r.status,503);assert.equal((await r.json()).ok,false);assert.equal((await POST(req({...valid,message:"x".repeat(25000)}))).status,413);});
