"use client";
import {useEffect,useSyncExternalStore} from "react";
import type {Product} from "@/content/products";
import {platformActions,waitlistHref,deviceChannelOrder} from "@/lib/platforms";
import {track} from "@/lib/analytics";
import {TrackedLink} from "./TrackedLink";
import {Badge} from "./ui";
const names={web:"Web app",ios:"iOS",android:"Android"};
const events={web:"open_web_clicked",ios:"app_store_clicked",android:"play_store_clicked"} as const;
const subscribe=()=>()=>{};
const device=()=>/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1?"iPad":navigator.userAgent;
export function ProductPlatformCTA({product,campaignId,headingLevel=2}:{product:Product;campaignId?:string;headingLevel?:2|4}){
 const userAgent=useSyncExternalStore(subscribe,device,()=>"");
 const order=deviceChannelOrder(userAgent);
 useEffect(()=>{track("channel_selection_shown",{productId:product.id,campaignId});},[product.id,campaignId]);
 const Heading=headingLevel===4?"h4":"h2";
 const waitlist=waitlistHref(product);
 return <div className="channel-selector"><Heading>Choose How You Connect</Heading><div className="platform-grid">{platformActions(product).sort((a,b)=>order.indexOf(a.channel)-order.indexOf(b.channel)).map(a=><div className="platform" key={a.channel}><div className="platform-title"><h3>{names[a.channel]}</h3><Badge>{a.status.replaceAll("_"," ").toLowerCase()}</Badge></div>{a.href?<TrackedLink href={a.href} event={events[a.channel]} productId={product.id} campaignId={campaignId} origins={product.attributionOrigins}>{a.label}</TrackedLink>:<p className="channel-state">{a.label}</p>}{product.platformNotes?.[a.channel]&&<p>{product.platformNotes[a.channel]}</p>}</div>)}</div>{waitlist&&<div className="waitlist"><TrackedLink href={waitlist} event="waitlist_clicked" productId={product.id} campaignId={campaignId} origins={product.attributionOrigins}>Join waitlist</TrackedLink></div>}</div>;
}
