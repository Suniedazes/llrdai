import {notFound} from "next/navigation";
import {campaigns} from "@/content/campaigns";
import {products} from "@/content/products";
import {publicCampaign} from "@/lib/campaigns";
import {pageMetadata} from "@/lib/seo";
import {safeHttps,waitlistHref} from "@/lib/platforms";
import {CampaignHero} from "@/components/CampaignHero";
import {ProductPlatformCTA} from "@/components/ProductPlatformCTA";
import {ViewEvent,TrackedLink} from "@/components/TrackedLink";

export const dynamic="force-dynamic";
const lookup=(slug:string)=>campaigns.find(c=>c.slug===slug&&publicCampaign(c));
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=lookup(slug);return c?pageMetadata(c.headline,c.subheadline,"/campaigns/"+slug):{};}
export default async function CampaignPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=lookup(slug);if(!c)notFound();const p=products.find(p=>p.id===c.productId);if(!p)notFound();const waitlist=c.ctaType==="WAITLIST"?(safeHttps(c.destination)||waitlistHref(p)):undefined;return <div className="container"><ViewEvent event="campaign_viewed" productId={p.id} campaignId={c.id}/><CampaignHero campaign={c}/><div className="page-body">{waitlist&&<TrackedLink href={waitlist} event="waitlist_clicked" productId={p.id} campaignId={c.id} origins={p.attributionOrigins}>Join waitlist</TrackedLink>}<section className="product-section"><h2>Choose your way to {p.name}.</h2><ProductPlatformCTA product={p} campaignId={c.id}/></section><TrackedLink href={"/products/"+p.slug} event="product_selected" productId={p.id} campaignId={c.id}>Explore {p.name}</TrackedLink></div></div>;}
