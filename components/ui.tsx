import Image from "next/image";
import Link from "next/link";
import type {ReactNode} from "react";
import {brand} from "@/content/brand";
export function Logo(){return <Link href="/" aria-label="LLRD Technologies home" className="logo">{brand.logo?<Image src={brand.logo} alt="LLRD Technologies" width={180} height={44}/>:<svg className="reference-logo" viewBox={brand.referenceLogo.viewBox} role="img" aria-label="LLRD Technologies — star inside the R"><image href={brand.referenceLogo.src} width={brand.referenceLogo.width} height={brand.referenceLogo.height}/></svg>}</Link>;}
export function Button({href,children,secondary=false}:{href:string;children:ReactNode;secondary?:boolean}) {return <Link className={secondary?"button secondary":"button"} href={href}>{children}<span aria-hidden="true">↗</span></Link>;}
export function Card({children,className=""}:{children:ReactNode;className?:string}){return <article className={"card "+className}>{children}</article>;}
export function SectionHeader({eyebrow,title,children}:{eyebrow:string;title:string;children?:ReactNode}){return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children}</div>;}
export function Badge({children}:{children:ReactNode}){return <span className="badge">{children}</span>;}
export function TrustLink({href,children}:{href:string;children:ReactNode}){return <Link className="text-link" href={href}>{children}<span aria-hidden="true"> ↗</span></Link>;}
export function Statement({children}:{children:ReactNode}){return <blockquote className="statement">{children}</blockquote>;}
export function MediaPanel({src,alt,placeholder}:{src?:string;alt:string;placeholder?:string}){return src?<div className="media-panel"><Image src={src} alt={alt} width={1400} height={850} unoptimized/></div>:<div className="media-placeholder"><p>{placeholder||"Product imagery forthcoming."}</p></div>;}
