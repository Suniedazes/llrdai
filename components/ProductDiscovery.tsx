"use client";
import {Component,useEffect,useRef,useState,type ReactNode,type KeyboardEvent} from "react";
import {usePathname} from "next/navigation";
import type {Product} from "@/content/products";
import {discoveryCategories,discoveryConfig} from "@/content/discovery";
import {discoveryWasSeen,rememberDiscovery,shouldPrompt,followUpFor,matchProducts} from "@/lib/discovery";
import {internalAttribution} from "@/lib/attribution";
import {track} from "@/lib/analytics";
import {AIDiscovery} from "./AIDiscovery";
import {DiscoveryChoices} from "./DiscoveryChoices";
import {DiscoveryRecommendations} from "./DiscoveryRecommendations";

class DiscoveryBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?null:this.props.children;}
}
type DiscoveryProps={products:readonly Product[];campaigns?:{id:string;slug:string}[]};
export function ProductDiscovery(props:DiscoveryProps){return <DiscoveryBoundary><DiscoveryDialog {...props}/></DiscoveryBoundary>;}
function DiscoveryDialog({products,campaigns=[]}:DiscoveryProps){
 const pathname=usePathname();
 const dialog=useRef<HTMLDialogElement>(null),titleRef=useRef<HTMLHeadingElement>(null),opener=useRef<HTMLElement|null>(null);
 const [step,setStep]=useState<"closed"|"prompt"|"category"|"topic"|"results">("closed");
 const [category,setCategory]=useState(""),[topic,setTopic]=useState<string>();
 const [search,setSearch]=useState("");
 const open=step!=="closed";
 const choice=discoveryCategories.find(c=>c.id===category);
 const followUp=followUpFor(products,category);
 const matches=matchProducts(products,category,topic);
 const campaignId=campaigns.find(c=>c.id===new URLSearchParams(search).get("campaign_id")||pathname==="/campaigns/"+c.slug)?.id;
 const remember=()=>{try{rememberDiscovery(sessionStorage);}catch{rememberDiscovery();}};
 const close=()=>{remember();track("product_discovery_dismissed");setStep("closed");};
 const trapFocus=(event:KeyboardEvent<HTMLDialogElement>)=>{
  if(event.key!=="Tab")return;
  const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===titleRef.current)){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 };

 useEffect(()=>{
  if(!discoveryConfig.enabled)return;
  const request=(event:Event)=>{
   event.preventDefault();opener.current=document.activeElement as HTMLElement;remember();
   const query=new URLSearchParams(window.location.search);if(campaignId)query.set("campaign_id",campaignId);
   setSearch(query.toString());setCategory("");setTopic(undefined);setStep("category");track("product_discovery_started",{campaignId});
  };
  window.addEventListener("llrd:discover",request);
  return()=>window.removeEventListener("llrd:discover",request);
 },[campaignId]);
 useEffect(()=>{
  if(!discoveryConfig.enabled||!discoveryConfig.autoPrompt||pathname!=="/")return;
  let seen=false;try{seen=discoveryWasSeen(sessionStorage);}catch{seen=discoveryWasSeen();}
  if(seen)return;
  const target=document.getElementById("portfolio");if(!target)return;
  const started=performance.now();let engaged=false,timer:ReturnType<typeof setTimeout>|undefined;
  const show=()=>{
   let alreadySeen=false;try{alreadySeen=discoveryWasSeen(sessionStorage);}catch{alreadySeen=discoveryWasSeen();}
   if(document.hidden||!shouldPrompt({enabled:true,engaged,elapsedMs:performance.now()-started,seen:alreadySeen}))return;
   opener.current=document.activeElement instanceof HTMLElement&&document.activeElement!==document.body?document.activeElement:target.querySelector<HTMLElement>("button");remember();setSearch(window.location.search);setStep("prompt");track("product_discovery_shown");
  };
  const observer=new IntersectionObserver(([entry])=>{
   engaged=entry.isIntersecting&&window.scrollY>100;
   if(timer)clearTimeout(timer);
   if(engaged)timer=setTimeout(show,Math.max(0,discoveryConfig.minimumEngagementMs-(performance.now()-started)));
  },{threshold:discoveryConfig.intersectionThreshold});observer.observe(target);
  return()=>{observer.disconnect();if(timer)clearTimeout(timer);};
 },[pathname]);
 useEffect(()=>{
  const element=dialog.current;if(!element)return;
  if(!open){if(element.open)element.close();return;}
  const originalOverflow=document.body.style.overflow;
  element.showModal();document.body.style.overflow="hidden";
  return()=>{element.close();document.body.style.overflow=originalOverflow;opener.current?.focus({preventScroll:true});};
 },[open]);
 useEffect(()=>{if(open){titleRef.current?.focus({preventScroll:true});dialog.current?.scrollTo(0,0);}},[step,open]);
 useEffect(()=>{
  if(step==="results")for(const p of matches)track("product_recommendation_shown",{productId:p.id,campaignId});
  // Selection values stay in component memory; only product IDs reach analytics.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[step,category,topic]);
 const selectCategory=(id:string)=>{setCategory(id);setTopic(undefined);track("product_interest_selected");setStep(followUpFor(products,id)?"topic":"results");};
 const title=step==="prompt"?"Technology should make life better.":step==="category"?"What would you like technology to help you with?":step==="topic"?followUp?.question:matches.length>1?"We found a few things you might like.":matches.length?"A starting point for what matters.":"A little more possibility, ahead.";
 return <dialog data-step={step} className="discovery-dialog" ref={dialog} aria-labelledby="discovery-title" onKeyDown={trapFocus} onCancel={event=>{event.preventDefault();close();}}>
  <div className="discovery-top"><p className="eyebrow">LLRD · FIND MY APP</p><button className="discovery-close" onClick={close} aria-label="Close product discovery">×</button></div>
  <h2 id="discovery-title" ref={titleRef} tabIndex={-1}>{title}</h2>
  {step==="prompt"&&<><p className="lead">Find the LLRD product built for what matters to you.</p><button className="button" onClick={()=>{track("product_discovery_started");setStep("category");}}>Find My App <span aria-hidden="true">→</span></button></>}
  {step==="category"&&<><p>No account needed. Start with what interests you.</p><AIDiscovery products={products}/><DiscoveryChoices choices={discoveryCategories} onSelect={selectCategory}/></>}
  {step==="topic"&&followUp&&<DiscoveryChoices choices={[...followUp.topics.map(t=>({id:t.id,title:t.label})),{id:"all",title:"A little of everything"}]} onSelect={id=>{setTopic(id==="all"?undefined:id);track("product_interest_selected");setStep("results");}}/>}
  {step==="results"&&<><p className="discovery-selection">Your interest: {choice?.title}{topic&&` · ${choice?.topics?.find(t=>t.id===topic)?.label}`}</p><DiscoveryRecommendations topic={topic} products={matches} interest={choice?.title??"the portfolio"} search={search} campaignId={campaignId} onLeave={()=>setStep("closed")}/></>}
  <div className="discovery-bottom">{step!=="prompt"&&step!=="category"&&<button className="discovery-back" onClick={()=>{setStep("category");setTopic(undefined);}}>← Change my interests</button>}<a href={internalAttribution("/products",search)} onClick={()=>setStep("closed")}>Explore All Products <span aria-hidden="true">↗</span></a><button className="discovery-back" onClick={close}>Not right now</button></div>
 </dialog>;
}
