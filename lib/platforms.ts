import type {Channel,Product,PlatformStatus} from "@/content/products";
export function safeHttps(value?:string):string|undefined {
 if(!value) return;
 try { const u=new URL(value); if(u.protocol==="https:"&&!u.username&&!u.password)return u.href; } catch {}
}
const labels:Record<Channel,string>={web:"Open on web",ios:"Download on the App Store",android:"Get it on Google Play"};
export function platformActions(p:Product) {
 return (["web","ios","android"] as const).map(channel=>{
 const status:PlatformStatus=p[channel==="web"?"webStatus":channel==="ios"?"iosStatus":"androidStatus"];
 const raw=p[channel==="web"?"webAppUrl":channel==="ios"?"appleAppStoreUrl":"googlePlayUrl"];
 const href=(status==="AVAILABLE"||status==="BETA")?safeHttps(raw):undefined;
 return {channel,status,href,label:href?labels[channel]:status==="NOT_OFFERED"?"Not offered":status==="TESTING"?"In testing":status==="AVAILABLE"||status==="BETA"?"Link forthcoming":"Coming soon"};
 });
}
export function waitlistHref(p:Product) {return p.waitlistEnabled?safeHttps(p.waitlistUrl):undefined;}
export function deviceChannelOrder(userAgent:string):Channel[]{
 if(/Android/i.test(userAgent))return ["android","web","ios"];
 if(/iPhone|iPad|iPod/i.test(userAgent))return ["ios","web","android"];
 return ["web","ios","android"];
}
