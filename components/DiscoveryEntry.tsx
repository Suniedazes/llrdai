"use client";
import {useRouter} from "next/navigation";
export function DiscoveryButton({compact=false}:{compact?:boolean}){
 const router=useRouter();
 function open(){
  const request=new CustomEvent("llrd:discover",{cancelable:true});
  window.dispatchEvent(request);
  // The ordinary Products link remains usable if the discovery client fails.
  if(!request.defaultPrevented)router.push("/products");
 }
 return <button type="button" className={compact?"discovery-text-link":"button"} onClick={open}>Find My App <span aria-hidden="true">↗</span></button>;
}
export function DiscoveryEntry(){return <aside className="discovery-entry"><div><p className="eyebrow">BUILT AROUND YOU</p><h3>What matters to you?</h3><p>Find a starting point in the LLRD portfolio.</p></div><DiscoveryButton/></aside>;}
