import {LegalCenter} from "@/components/LegalCenter";
import {legalRoutes} from "@/content/legal";
import {notFound} from "next/navigation";
import {pages} from "@/content/pages";
import {company} from "@/content/company";
import {pageMetadata} from "@/lib/seo";
import {Card,TrustLink} from "@/components/ui";
export function generateStaticParams(){return Array.from(new Set([...Object.keys(pages),...Object.keys(legalRoutes)])).filter(page=>page!=="contact").map(page=>({page}));}
export async function generateMetadata({params}:{params:Promise<{page:string}>}){const {page}=await params;if(legalRoutes[page])return pageMetadata(legalRoutes[page].title,"LLRD corporate legal and privacy information.","/"+page);const content=pages[page];if(!content)return {};return pageMetadata(content.title,content.intro,"/"+page);}
export default async function Info({params}:{params:Promise<{page:string}>}){const {page}=await params;if(legalRoutes[page])return <LegalCenter page={page}/>;const c=pages[page];if(!c)notFound();return <div className="container"><section className="page-intro"><p className="eyebrow">{c.eyebrow}</p><h1>{c.title}</h1><p className="lead">{c.intro}</p></section><div className="page-body">{c.notice&&<aside className="notice"><p>{c.notice}</p></aside>}{page==="impact"?<div className="impact-grid">{company.pillars.map((p,i)=><Card key={p.name}><span className="index">0{i+1}</span><h2>{p.name}</h2><p>{p.description}</p></Card>)}</div>:<div className="prose">{c.sections.map(s=><section key={s.title}><h2>{s.title}</h2><p>{s.text}</p></section>)}</div>}<div className="link-row"><TrustLink href="/products">Explore products</TrustLink>{page==="contact"?<TrustLink href="/support">Product support</TrustLink>:<TrustLink href="/contact">Contact LLRD</TrustLink>}</div></div></div>;}