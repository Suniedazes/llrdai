import {publishedPosts} from "@/lib/published-posts";
import type {MetadataRoute} from "next";
import {company} from "@/content/company";
import {orderedProducts} from "@/content/products";
import {campaigns} from "@/content/campaigns";
import {publicCampaign} from "@/lib/campaigns";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const routes=["","/products","/updates","/about","/impact","/support","/privacy","/privacy-requests","/security","/legal","/terms","/cookies","/ai-policy","/accessibility","/state-privacy-rights","/family-privacy","/contact"];
 for(const p of orderedProducts()){routes.push("/products/"+p.slug);for(const section of ["privacy","security","support","delete-account","legal"])routes.push("/products/"+p.slug+"/"+section);}
 for(const c of campaigns.filter(publicCampaign))routes.push("/campaigns/"+c.slug);
 for(const p of await publishedPosts())routes.push("/updates/"+p.slug);
 return routes.map(route=>({url:company.domain+route}));
}export const dynamic="force-dynamic";
