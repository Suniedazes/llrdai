import type {Product} from "@/content/products";
import {discoveryCategories,discoveryConfig} from "@/content/discovery";
export function eligibleForDiscovery(p:Product){return p.discoverable===true&&(p.launchStatus==="PUBLISHED"||p.launchStatus==="COMING_SOON");}
export function matchProducts(products:readonly Product[],category:string,topic?:string){
 if(!discoveryCategories.some(c=>c.id===category))return [];
 return products.filter(p=>eligibleForDiscovery(p)&&(category==="all"||p.discoveryCategories?.includes(category)))
 .filter(p=>!topic||p.discoveryTopics?.includes(topic))
 .sort((a,b)=>(b.discoveryPriority??0)-(a.discoveryPriority??0)||a.displayOrder-b.displayOrder||a.id.localeCompare(b.id));
}
// Topics personalize the explanation even when there is one matching product.
export function followUpFor(products:readonly Product[],category:string){
 const config=discoveryCategories.find(c=>c.id===category);
 if(!config?.topics)return;
 const topics=config.topics.filter(t=>matchProducts(products,category,t.id).length>0);
 return topics.length>1?{question:config.question!,topics}:undefined;
}
let sessionSeen=false;
export function discoveryWasSeen(storage?:Pick<Storage,"getItem">){try{return sessionSeen||storage?.getItem(discoveryConfig.sessionKey)==="1";}catch{return sessionSeen;}}
export function rememberDiscovery(storage?:Pick<Storage,"setItem">){sessionSeen=true;try{storage?.setItem(discoveryConfig.sessionKey,"1");}catch{/* Memory fallback preserves dismissal while this page is open. */}}
export function shouldPrompt({enabled,engaged,elapsedMs,seen}:{enabled:boolean;engaged:boolean;elapsedMs:number;seen:boolean}){return enabled&&engaged&&!seen&&elapsedMs>=discoveryConfig.minimumEngagementMs;}
