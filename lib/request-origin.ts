export function sameOrigin(request:Request){
 const origin=request.headers.get("origin");if(!origin)return false;
 try{const parsed=new URL(origin),url=new URL(request.url);return ["http:","https:"].includes(parsed.protocol)&&parsed.host===(request.headers.get("host")??url.host)&&parsed.origin===origin;}catch{return false;}
}
