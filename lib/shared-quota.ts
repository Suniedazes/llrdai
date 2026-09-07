export type QuotaState={minute:number;minuteCount:number;day:number;dayCount:number;clients:Record<string,{minute:number;count:number}>};
export function consumeQuota(state:QuotaState|undefined,client:string,kind:'ai'|'contact',now=Date.now()){
 const minute=Math.floor(now/60000),day=Math.floor(now/86400000);
 const next:QuotaState=state&&state.day===day?structuredClone(state):{minute,minuteCount:0,day,dayCount:0,clients:{}};
 if(next.minute!==minute){next.minute=minute;next.minuteCount=0;next.clients={};}
 const limit=kind==='ai'?{client:3,minute:4,day:100}:{client:3,minute:10,day:100};
 const c=next.clients[client]?.count||0;
 if(c>=limit.client||next.minuteCount>=limit.minute||next.dayCount>=limit.day)return {allowed:false,state:next};
 next.clients[client]={minute,count:c+1};next.minuteCount++;next.dayCount++;
 return {allowed:true,state:next};
}
