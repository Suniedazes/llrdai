import {sameOrigin} from '@/lib/request-origin';
import {configuredProvider} from '@/lib/website-ai/provider';
import {answerQuestion} from '@/lib/website-ai/service';
import {rateAllowed} from '@/lib/website-ai/limits';
import {unavailable} from '@/lib/website-ai/content';
export const runtime='nodejs';
export async function GET(){return Response.json({available:!!configuredProvider(),provider:'Groq'},{headers:{'Cache-Control':'no-store'}});}
export async function POST(request:Request){
 const fail=(message:string,status:number)=>Response.json({message},{status,headers:{'Cache-Control':'no-store'}});
 if(!sameOrigin(request))return fail('Please reload the page and try again.',403);
 const provider=configuredProvider();if(!provider)return fail(unavailable,503);
 if(!rateAllowed(request))return fail(unavailable,429);
 if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json')return fail('JSON text requests only. Uploads are not supported.',415);
 const reader=request.body?.getReader();if(!reader)return fail('Enter a question.',400);let bytes=0,text='';const decoder=new TextDecoder();
 try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>4096){await reader.cancel();return fail('Please use 600 characters or fewer.',413);}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}catch{return fail('Unable to read request.',400);}
 let input;try{input=JSON.parse(text);}catch{return fail('Invalid request.',400);}
 if(!input||typeof input.query!=='string'||Object.keys(input).some(k=>k!=='query')||input.query.trim().length<5||input.query.length>600)return fail('Enter a question in 5–600 characters. No attachments.',422);
 const start=Date.now();try{const result=await answerQuestion(input.query.trim(),provider);console.info('website_ai',{status:'ok',durationMs:Date.now()-start});return Response.json(result,{headers:{'Cache-Control':'no-store'}});}catch{console.warn('website_ai',{status:'unavailable',durationMs:Date.now()-start});return fail(unavailable,503);}
}
