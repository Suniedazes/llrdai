import test from "node:test";
import assert from "node:assert/strict";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {products,isPublicProduct,type Product} from "../content/products";
import {eligibleForDiscovery,matchProducts,followUpFor,shouldPrompt,rememberDiscovery,discoveryWasSeen} from "../lib/discovery";
import {deviceChannelOrder,platformActions} from "../lib/platforms";
import {internalAttribution} from "../lib/attribution";
import {configureAnalytics,setAnalyticsConsent,track} from "../lib/analytics";
import {DiscoveryChoices} from "../components/DiscoveryChoices";
import {DiscoveryRecommendations} from "../components/DiscoveryRecommendations";
import {ProductDiscovery} from "../components/ProductDiscovery";
import {product} from "./fixtures";

const family:Product={...product,discoverable:true,launchStatus:"PUBLISHED",discoveryCategories:["family"],discoveryTopics:["history"],discoveryPriority:10};
test("initial render has a labeled closed dialog without interrupting the page",()=>{
 const html=renderToStaticMarkup(createElement(ProductDiscovery,{products:[]}));assert.match(html,/<dialog/);assert.match(html,/aria-labelledby="discovery-title"/);assert.doesNotMatch(html,/<dialog[^>]+\sopen(?:=|\s|>)/);
});
test("discovery waits for meaningful engagement and respects session frequency",()=>{
 assert.equal(shouldPrompt({enabled:true,engaged:false,elapsedMs:0,seen:false}),false);
 assert.equal(shouldPrompt({enabled:true,engaged:true,elapsedMs:11999,seen:false}),false);
 assert.equal(shouldPrompt({enabled:true,engaged:true,elapsedMs:12000,seen:false}),true);
 assert.equal(shouldPrompt({enabled:true,engaged:true,elapsedMs:12000,seen:true}),false);
 assert.equal(shouldPrompt({enabled:false,engaged:true,elapsedMs:12000,seen:false}),false);
 const values=new Map<string,string>();const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}};
 rememberDiscovery(storage);assert.equal(discoveryWasSeen(storage),true);assert.equal(values.size,1);assert.equal([...values.values()][0],"1");
 assert.doesNotThrow(()=>rememberDiscovery({setItem:()=>{throw Error("blocked");}}));assert.equal(discoveryWasSeen({getItem:()=>{throw Error("blocked");}}),true);
});
test("SONIE uses registry metadata, is coming soon, and never gains invented URLs",()=>{
 const match=matchProducts(products,"family");assert.equal(match[0].id,"sonie");assert.equal(match[0].tagline,"Family lives here.");
 assert.equal(match[0].launchStatus,"COMING_SOON");assert(platformActions(match[0]).every(a=>!a.href));
 for(const category of ["health","learning","everyday","unknown"])assert.equal(matchProducts(products,category).length,0);
 assert.equal(followUpFor(products,"family")?.topics.length,5); assert.equal(matchProducts(products,"entertainment")[0].id,"elseside");
});
test("private, internal, unannounced, disabled and opted-out products cannot be recommended",()=>{
 for(const launchStatus of ["PRIVATE","INTERNAL","UNANNOUNCED","DISABLED"] as const){const p={...family,launchStatus};assert.equal(isPublicProduct(p),false);assert.equal(eligibleForDiscovery(p),false);assert.deepEqual(matchProducts([p],"all"),[]);}
 assert.deepEqual(matchProducts([{...family,discoverable:false}],"family"),[]);
 assert.deepEqual(matchProducts([{...family,launchStatus:undefined}],"family"),[]);
});
test("ranking is deterministic and supports multiple products independent of array order",()=>{
 const second={...family,id:"second",discoveryPriority:30};
 assert.deepEqual(matchProducts([family,second],"family").map(p=>p.id),["second",family.id]);
 assert.deepEqual(matchProducts([second,family],"family").map(p=>p.id),["second",family.id]);
});
test("follow-up questions discriminate relevant products and never cross categories",()=>{
 const stories={...family,id:"stories",discoveryTopics:["stories"]};
 assert.equal(followUpFor([family,stories],"family")?.topics.length,2);
 assert.deepEqual(matchProducts([family,stories],"family","stories").map(p=>p.id),["stories"]);
 assert.equal(followUpFor([family,stories],"health"),undefined);
 assert.equal(followUpFor([family,{...family,id:"same"}],"family"),undefined);
});
test("device order prioritizes one channel while retaining all three",()=>{
 assert.deepEqual(deviceChannelOrder("iPhone"),["ios","web","android"]);
 assert.deepEqual(deviceChannelOrder("Android"),["android","web","ios"]);
 assert.deepEqual(deviceChannelOrder("desktop"),["web","ios","android"]);
 for(const ua of ["iPad","Android","desktop"])assert.equal(new Set(deviceChannelOrder(ua)).size,3);
});
test("internal handoff keeps bounded campaign attribution without unrelated visitor parameters",()=>{
 const url=new URL(internalAttribution("/products/sonie","?utm_source=facebook&campaign_id=family&email=secret&health=private"),"https://llrd.ai");
 assert.equal(url.searchParams.get("utm_source"),"facebook");assert.equal(url.searchParams.get("campaign_id"),"family");assert.equal(url.searchParams.size,2);
 assert.equal(internalAttribution("//outside.test","?utm_source=x"),"//outside.test");
 assert.equal(internalAttribution("/products","?utm_source="+"x".repeat(201)),"/products");
});
test("recommendations use existing product pages and honest availability",()=>{
 const html=renderToStaticMarkup(createElement(DiscoveryRecommendations,{products:[products[0]],interest:"Family & Memories",search:"?utm_source=facebook",onLeave:()=>{}}));
 assert.match(html,/Learn More/);assert.match(html,/\/products\/sonie\?utm_source=facebook/);assert.match(html,/COMING SOON/);assert.doesNotMatch(html,/href="#"/);
 const choices=renderToStaticMarkup(createElement(DiscoveryChoices,{choices:[{id:"family",title:"Family & Memories"}],onSelect:()=>{}}));assert.match(choices,/<button/);
});
test("discovery events reuse consent-gated analytics with product IDs only",()=>{
 const events:unknown[]=[];configureAnalytics((event,context)=>events.push({event,context}));
 setAnalyticsConsent(false);track("product_interest_selected");assert.equal(events.length,0);
 setAnalyticsConsent(true);track("product_recommendation_shown",{productId:"sonie"});assert.deepEqual(events,[{event:"product_recommendation_shown",context:{productId:"sonie"}}]);setAnalyticsConsent(false);configureAnalytics();
});
