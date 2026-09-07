import {DiscoveryEntry} from "@/components/DiscoveryEntry";
import {orderedProducts} from "@/content/products";
import {ProductCard} from "@/components/ProductCard";
import {TrustLink} from "@/components/ui";
import {pageMetadata} from "@/lib/seo";
export const metadata=pageMetadata("Our products","Explore LLRD applications and choose web, iOS or Android where available.","/products");
export default function Products(){const products=orderedProducts();return <div className="container"><section className="page-intro"><p className="eyebrow">THE LLRD PORTFOLIO</p><h1>More ways to connect<br/><em>what matters.</em></h1><p className="lead">Explore our applications. Choose the experience that works for you, on the web or through available native apps.</p><DiscoveryEntry/></section><section className="page-body" aria-label="LLRD products">{products.length?<div className="card-grid">{products.map(p=><ProductCard product={p} key={p.id}/>)}</div>:<div className="notice"><h2>Our portfolio is taking shape.</h2><p>Product details and availability will be published here as they are announced.</p><p>Each product will show its own web, iOS and Android options. Web access remains part of the experience when native apps arrive.</p><TrustLink href="/about">Discover LLRD</TrustLink></div>}</section></div>;}
