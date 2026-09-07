import {deliverInquiry} from "@/lib/inquiry-delivery";
import {limiter,clientKey} from "@/lib/website-ai/limits";
import {contactDelivery} from "@/lib/contact-delivery";
import {localHost} from "@/lib/studio-access";
import {sameOrigin} from "@/lib/request-origin";
import {validateInquiry} from "@/lib/contact";
// Delivery adapter belongs here, on the server. Never acknowledge delivery until
// an email/CRM/database provider has durably accepted the validated inquiry.
export async function POST(request:Request){
 const reply=(message:string,status:number,extra={})=>Response.json({ok:false,message,...extra},{status,headers:{"Cache-Control":"no-store"}});
 if(!sameOrigin(request))return reply("This request could not be verified. Please reload the page.",403);
 // Public collection stays closed; local preview may exercise validation without delivery.
 if(!localHost(request.headers.get("host")??new URL(request.url).host)&&!contactDelivery.collectionEnabled)return reply("Contact collection is not available until delivery and the Privacy Notice are approved.",503);
 if(!limiter.allow("contact:"+clientKey(request),10,60000))return reply("Please wait before trying again.",429);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return reply("Unsupported request format.",415);
 if(Number(request.headers.get("content-length"))>24000)return reply("Your inquiry is too long.",413);
 let text="";const reader=request.body?.getReader();if(!reader)return reply("An inquiry is required.",400);
 const decoder=new TextDecoder();let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>24000){await reader.cancel();return reply("Your inquiry is too long.",413);}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();
 let raw:unknown;try{raw=JSON.parse(text);}catch{return reply("Please check your inquiry and try again.",400);}
 const {data,errors}=validateInquiry(raw);
 if(data.website)return reply("This request could not be accepted.",400);
 if(Object.keys(errors).length)return reply("Please check the highlighted fields.",422,{errors});
 try {const accepted=await deliverInquiry(data,null);return Response.json(accepted,{headers:{"Cache-Control":"no-store"}});} catch {return reply("Your inquiry has not been sent. Online delivery is currently unavailable. Your entries are still here so you can copy them and try again later.",503); }
}
