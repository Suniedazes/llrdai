import {createHmac,randomBytes} from 'node:crypto';
let salt:Uint8Array|undefined;const buckets=new Map<string,{count:number;until:number}>();
// In-memory limits are intentionally a replaceable port, not a distributed guarantee.
export interface RateLimiter {allow(key:string,limit:number,period:number):boolean}
export const limiter:RateLimiter={allow(key,limit,period){const now=Date.now();for(const [k,v] of buckets)if(v.until<=now)buckets.delete(k);const b=buckets.get(key)??{count:0,until:now+period};if(b.count>=limit||(!buckets.has(key)&&buckets.size>=10000))return false;b.count++;buckets.set(key,b);return true;}};
export function clientKey(request:Request){
 // Header must be overwritten by the trusted hosting proxy, never trusted by default.
 const header=process.env.LLRD_AI_TRUSTED_IP_HEADER;
 const ip=header?request.headers.get(header):null;
 return createHmac('sha256',salt??=randomBytes(32)).update(ip?.slice(0,128)||'shared-unidentified').digest('hex');
}
export function rateAllowed(request:Request){return limiter.allow('client:'+clientKey(request),5,60000)&&limiter.allow('global-minute',20,60000)&&limiter.allow('global-day',100,86400000);}

