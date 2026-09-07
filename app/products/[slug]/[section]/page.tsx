import {notFound} from "next/navigation";
import {getProduct} from "@/content/products";
import {pageMetadata} from "@/lib/seo";
import {TrustLink} from "@/components/ui";
const sections:Record<string,{name:string;text:string}>={
 privacy:{name:"Privacy",text:"Reviewed privacy information for this product is forthcoming. This is not a finalized privacy policy."},
 security:{name:"Security",text:"Documented security information for this product is forthcoming. No compliance or certification claims are made."},
 legal:{name:"Legal",text:"Reviewed terms and legal notices for this product are forthcoming."},
 support:{name:"Support",text:"Verified support channels and product-specific help are forthcoming. This page does not collect support requests."},
 "delete-account":{name:"Account deletion",text:"Product-specific account deletion instructions are forthcoming. This page does not submit or process deletion requests. Whether an account is required will be documented for this product."}
};
export async function generateMetadata({params}:{params:Promise<{slug:string;section:string}>}){const {slug,section}=await params;const p=getProduct(slug);const s=sections[section];return p&&s?pageMetadata(p.name+" "+s.name,s.text,"/products/"+slug+"/"+section):{};}
export default async function ProductTrust({params}:{params:Promise<{slug:string;section:string}>}){const {slug,section}=await params;const p=getProduct(slug);const s=sections[section];if(!p||!s)notFound();return <div className="container"><section className="page-intro"><p className="eyebrow">{p.name}</p><h1>{s.name}</h1><p className="lead">{s.text}</p></section><div className="page-body"><TrustLink href={"/products/"+slug}>Back to {p.name}</TrustLink></div></div>;}