import {mkdir,readFile,writeFile,rename,open,unlink} from "node:fs/promises";
import path from "node:path";
import {randomUUID} from "node:crypto";
import {parsePost,type Post,type PostInput} from "./posts";
export class StoreConflict extends Error{}
export function createPostStore(directory:string){
 const filename=path.join(directory,"posts.json");
 async function list():Promise<Post[]>{
 try{return JSON.parse(await readFile(filename,"utf8")) as Post[];}
 catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return [];throw error;}
 }
 async function save(input:PostInput):Promise<Post>{
 const data=parsePost(input);await mkdir(directory,{recursive:true});
 const lockPath=path.join(directory,"posts.lock");
 let lock;try{lock=await open(lockPath,"wx");}catch{throw new StoreConflict("Another save is in progress. Please try again.");}
 const temp=path.join(directory,randomUUID()+".tmp");
 try{
 const posts=await list();const existing=data.id?posts.find(p=>p.id===data.id):undefined;
 if(data.id&&!existing)throw new StoreConflict("This post no longer exists. Reload the editor.");
 if(existing&&existing.revision!==data.revision)throw new StoreConflict("This post changed in another window. Reload it before saving.");
 if(posts.some(p=>p.slug===data.slug&&p.id!==data.id))throw new StoreConflict("That URL is already in use. Choose another.");
 const now=new Date().toISOString();
 const post:Post={...data,id:existing?.id||randomUUID(),revision:(existing?.revision||0)+1,createdAt:existing?.createdAt||now,updatedAt:now,publishedAt:data.status==="PUBLISHED"?(existing?.publishedAt||now):existing?.publishedAt};
 const next=existing?posts.map(p=>p.id===post.id?post:p):[post,...posts];
 await writeFile(temp,JSON.stringify(next,null,2),"utf8");await rename(temp,filename);return post;
 }finally{await unlink(temp).catch(()=>{});await lock.close();await unlink(lockPath);}
 }
 return {list,save};
}
export const postStore=createPostStore(path.join(process.cwd(),"data"));
export async function publishedPosts(){return (await postStore.list()).filter(p=>p.status==="PUBLISHED").sort((a,b)=>(b.publishedAt||"").localeCompare(a.publishedAt||""));}
