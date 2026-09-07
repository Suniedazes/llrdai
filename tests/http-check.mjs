import assert from "node:assert/strict";
const base=process.env.TEST_BASE_URL||"http://127.0.0.1:3000";
const routes=["/","/products","/about","/impact","/support","/privacy","/security","/legal","/contact"];
for(const route of routes){
 const response=await fetch(base+route);assert.equal(response.status,200,route);
 const html=await response.text();assert.match(html,/<main[^>]*id="main"/);assert.match(html,/<h1/);assert.match(html,/rel="canonical"/);assert.match(html,/property="og:title"/);assert.match(html,/name="twitter:title"/);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];assert.equal(canonical,"https://llrd.ai"+(route==="/"?"":route),route);
 for(const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)"/g)){const href=match[1];if(href.startsWith("/_next/"))continue;const link=await fetch(base+href);assert.equal(link.status,200,route+" -> "+href);}
 console.log("PASS",route,"status, landmarks, metadata, internal links");
}
for(const route of ["/missing","/products/not-a-product","/campaigns/not-a-campaign","/products/not-a-product/privacy"]){const response=await fetch(base+route);assert.equal(response.status,404,route);console.log("PASS",route,"404");}
const robot=await(await fetch(base+"/robots.txt")).text();assert.match(robot,/Disallow: \//);
const sitemap=await(await fetch(base+"/sitemap.xml")).text();assert(!sitemap.includes("fixture"));assert(sitemap.includes("https://llrd.ai/products"));
console.log("PASS robots and sitemap");
