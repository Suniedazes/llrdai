import type {Metadata} from "next";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {company} from "@/content/company";
import {campaigns} from "@/content/campaigns";
import {publicCampaign} from "@/lib/campaigns";
import {brand} from "@/content/brand";
import {orderedProducts} from "@/content/products";
import {eligibleForDiscovery} from "@/lib/discovery";
import {ProductDiscovery} from "@/components/ProductDiscovery";
import "./globals.css";
import "./discovery.css";
export const metadata:Metadata={metadataBase:new URL(company.domain),title:{default:company.name,template:"%s | LLRD Technologies"},description:company.description,robots:{index:process.env.SITE_INDEXABLE==="true",follow:process.env.SITE_INDEXABLE==="true"},icons:brand.favicon?{icon:brand.favicon}:undefined};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><ProductDiscovery products={orderedProducts().filter(eligibleForDiscovery)} campaigns={campaigns.filter(publicCampaign).map(c=>({id:c.id,slug:c.slug}))}/></body></html>;}
