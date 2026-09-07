import {publishedPosts} from "@/lib/published-posts";
import {pageMetadata} from "@/lib/seo";
import {Card,TrustLink} from "@/components/ui";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("Updates","News and updates from LLRD Technologies.","/updates");
export default async function Updates(){const posts=await publishedPosts();return <div className="container"><section className="page-intro"><p className="eyebrow">FROM LLRD</p><h1>Ideas. News.<br/><em>Meaningful progress.</em></h1></section><div className="page-body">{posts.length?<div className="card-grid">{posts.map(p=><Card key={p.id}><p className="eyebrow">{new Date(p.publishedAt!).toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"})}</p><h2>{p.title}</h2><p>{p.summary}</p><TrustLink href={"/updates/"+p.slug}>Read update</TrustLink></Card>)}</div>:<p>Updates from LLRD will appear here as they are published.</p>}</div></div>;}