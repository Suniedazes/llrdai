import {authorizedStudio} from "@/lib/studio-access";
import {postStore,StoreConflict} from "@/lib/post-store";
import {parsePost} from "@/lib/posts";
export const runtime="nodejs";export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
export async function GET(request:Request){
 if(!authorizedStudio(request))return Response.json({error:"Local editor access required."},{status:403,headers});
 try{return Response.json(await postStore.list(),{headers});}catch{return Response.json({error:"Could not read saved posts."},{status:500,headers});}
}
export async function POST(request:Request){
 if(!authorizedStudio(request))return Response.json({error:"Local editor access required."},{status:403,headers});
 if(!request.headers.get("content-type")?.startsWith("application/json"))return Response.json({error:"JSON required."},{status:415,headers});
 const reader=request.body?.getReader();if(!reader)return Response.json({error:"Post required."},{status:400,headers});
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>100000){await reader.cancel();return Response.json({error:"This post is too large."},{status:413,headers});}chunks.push(value);}
 let input;try{input=parsePost(JSON.parse(Buffer.concat(chunks).toString("utf8")));}catch(error){return Response.json({error:(error as Error).message},{status:400,headers});}
 try{return Response.json(await postStore.save(input),{headers});}catch(error){return Response.json({error:error instanceof StoreConflict?error.message:"Could not save the post. Please try again."},{status:error instanceof StoreConflict?409:500,headers});}
}
