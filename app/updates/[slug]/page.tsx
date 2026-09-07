import {notFound} from "next/navigation";
import {publishedPosts} from "@/lib/published-posts";
import {pageMetadata} from "@/lib/seo";
import {TrustLink} from "@/components/ui";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=(await publishedPosts()).find(p=>p.slug===slug);return p?pageMetadata(p.title,p.summary,"/updates/"+slug):{};}
export default async function Update({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=(await publishedPosts()).find(p=>p.slug===slug);if(!p)notFound();return <article className="container"><section className="page-intro"><TrustLink href="/updates">All updates</TrustLink><p className="eyebrow">LLRD TECHNOLOGIES · {new Date(p.publishedAt!).toLocaleDateString("en-CA",{timeZone:"UTC"})}</p><h1>{p.title}</h1><p className="lead">{p.summary}</p></section><div className="page-body prose post-body">{p.body}</div></article>;}