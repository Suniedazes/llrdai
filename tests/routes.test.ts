import test from "node:test";
import assert from "node:assert/strict";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {products,type Product} from "../content/products";
import {campaigns,type Campaign} from "../content/campaigns";
import {product,campaign} from "./fixtures";
import ProductPage,{generateMetadata as productMetadata} from "../app/products/[slug]/page";
import CampaignPage,{generateMetadata as campaignMetadata} from "../app/campaigns/[slug]/page";
import ProductTrust from "../app/products/[slug]/[section]/page";
import sitemap from "../app/sitemap";
import {ProductPlatformCTA} from "../components/ProductPlatformCTA";
test("product, campaign and trust templates render fixture records without public inventory",async()=>{
 const productCount=products.length,campaignCount=campaigns.length;
 (products as Product[]).push(product);(campaigns as Campaign[]).push(campaign);
 try{
 const productHtml=renderToStaticMarkup(await ProductPage({params:Promise.resolve({slug:product.slug})}));
 assert.match(productHtml,/Test application/);assert.match(productHtml,/https:\/\/example.com\/app/);assert.match(productHtml,/Coming soon/);
 const campaignHtml=renderToStaticMarkup(await CampaignPage({params:Promise.resolve({slug:campaign.slug})}));assert.match(campaignHtml,/Test headline/);
 const pm=await productMetadata({params:Promise.resolve({slug:product.slug})});assert.equal(pm.title,product.name);assert.equal(pm.alternates?.canonical,"/products/fixture-one");
 const cm=await campaignMetadata({params:Promise.resolve({slug:campaign.slug})});assert.equal(cm.title,campaign.headline);
 for(const section of ["privacy","security","legal","support","delete-account"]){const html=renderToStaticMarkup(await ProductTrust({params:Promise.resolve({slug:product.slug,section})}));assert.match(html,/forthcoming/);}
 assert((await sitemap()).some(x=>x.url.endsWith("/campaigns/fixture-campaign")));
 const native=renderToStaticMarkup(createElement(ProductPlatformCTA,{product:{...product,iosStatus:"BETA",appleAppStoreUrl:"https://apps.apple.com/app/test",androidStatus:"AVAILABLE",googlePlayUrl:"https://play.google.com/store/apps/details?id=test"}}));
 assert.match(native,/Download on the App Store/);assert.match(native,/Get it on Google Play/);assert.match(native,/Open on web/);
 }finally{(products as Product[]).length=productCount;(campaigns as Campaign[]).length=campaignCount;}
});
test("unannounced products are excluded from routes, metadata and sitemap",async()=>{
 const productCount=products.length;const hidden={...product,id:"hidden",slug:"hidden",launchStatus:"UNANNOUNCED" as const};
 (products as Product[]).push(hidden);
 try{await assert.rejects(ProductPage({params:Promise.resolve({slug:"hidden"})}),/404/);assert.deepEqual(await productMetadata({params:Promise.resolve({slug:"hidden"})}),{});assert(!(await sitemap()).some(x=>x.url.includes("/hidden")));}
 finally{(products as Product[]).length=productCount;}
});
test("unknown product and inactive campaign return not-found",async()=>{await assert.rejects(ProductPage({params:Promise.resolve({slug:"missing"})}),/NEXT_HTTP_ERROR_FALLBACK;404/);await assert.rejects(CampaignPage({params:Promise.resolve({slug:"missing"})}),/NEXT_HTTP_ERROR_FALLBACK;404/);});
