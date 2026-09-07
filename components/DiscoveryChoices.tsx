"use client";
export function DiscoveryChoices({choices,onSelect}:{choices:readonly {id:string;title:string;description?:string;symbol?:string}[];onSelect:(id:string)=>void}){
 return <div className="discovery-choices">{choices.map(c=><button className="discovery-choice" key={c.id} onClick={()=>onSelect(c.id)}>{c.symbol&&<span className="choice-symbol" aria-hidden="true">{c.symbol}</span>}<strong>{c.title}</strong>{c.description&&<span>{c.description}</span>}<span className="choice-arrow" aria-hidden="true">→</span></button>)}</div>;
}
