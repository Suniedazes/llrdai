import type {Campaign} from "@/content/campaigns";
import {products,isPublicProduct} from "@/content/products";
export function isActive(c:Campaign,now=new Date()):boolean {
 const start=c.activeFrom?Date.parse(c.activeFrom):-Infinity;
 const end=c.activeUntil?Date.parse(c.activeUntil):Infinity;
 return c.status==="ACTIVE" && start<=now.getTime() && now.getTime()<end;
}
export function publicCampaign(c:Campaign) {return isActive(c)&&products.some(p=>p.id===c.productId&&isPublicProduct(p));}
