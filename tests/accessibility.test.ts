import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync(new URL("../app/globals.css",import.meta.url),"utf8");
const tokens=new Map<string,string>();
for(const block of css.matchAll(/:root\{([^}]+)\}/g))for(const declaration of block[1].split(";")){const i=declaration.indexOf(":");if(i>0)tokens.set(declaration.slice(0,i).trim(),declaration.slice(i+1).trim());}
function resolve(name:string):string{const value=tokens.get(name)!;const ref=value.match(/^var\((.+)\)$/);return ref?resolve(ref[1]):value;}
function luminance(hex:string){const rgb=hex.slice(1).match(/../g)!.map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a:string,b:string){const values=[luminance(resolve(a)),luminance(resolve(b))].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);}
test("semantic text and action colors meet contrast thresholds",()=>{
 for(const bg of ["--llrd-bg-primary","--llrd-bg-elevated"]){
 for(const fg of ["--llrd-text-primary","--llrd-text-secondary","--llrd-gold","--llrd-muted"]){const ratio=contrast(fg,bg);assert(ratio>=4.5,fg+" on "+bg+" = "+ratio);}
 assert(contrast("--llrd-focus",bg)>=3);
 }
 assert(contrast("--llrd-green-deep","--llrd-sand")>=4.5);
 assert(contrast("--llrd-green-deep","--llrd-gold")>=4.5);
 assert(contrast("--llrd-green-deep","--llrd-gold-light")>=4.5);
});

