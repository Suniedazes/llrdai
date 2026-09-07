import Link from "next/link";
import {Logo} from "./ui";
import {navigation} from "@/content/navigation";
export function Header(){return <header className="header"><div className="container header-inner"><Logo/><nav aria-label="Main navigation">{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav><Link className="header-contact" href="/contact">Let’s connect <span aria-hidden="true">↗</span></Link></div></header>;}