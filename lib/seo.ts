import type {Metadata} from "next";
import {company} from "@/content/company";
import {brand} from "@/content/brand";
export function pageMetadata(title:string,description:string,path:string):Metadata {
 return {title,description,alternates:{canonical:path},openGraph:{type:"website",title,description,url:company.domain+path,siteName:company.name,images:brand.socialImage?[company.domain+brand.socialImage]:[]},twitter:{card:brand.socialImage?"summary_large_image":"summary",title,description,images:brand.socialImage?[company.domain+brand.socialImage]:[]}};
}
