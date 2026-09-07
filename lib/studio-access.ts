import {timingSafeEqual} from "node:crypto";
export function localHost(host:string|null){return !!host&&/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host);}
export function studioEnabled(){return process.env.LLRD_LOCAL_STUDIO==="true"&&Boolean(process.env.LLRD_STUDIO_TOKEN);}
export function authorizedStudio(request:Request){
 if(!studioEnabled()||!localHost(request.headers.get("host")))return false;
 const origin=request.headers.get("origin");if(origin&&origin!=="http://"+request.headers.get("host"))return false;
 if(request.headers.get("sec-fetch-site")==="cross-site")return false;
 const supplied=Buffer.from(request.headers.get("x-studio-token")||"");const expected=Buffer.from(process.env.LLRD_STUDIO_TOKEN||"");
 return supplied.length===expected.length&&timingSafeEqual(supplied,expected);
}
