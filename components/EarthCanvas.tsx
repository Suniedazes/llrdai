"use client";
import {useEffect,useRef,useState} from "react";

// A software-rendered sphere avoids dependence on WebGL drivers.
export function RotatingEarth(){
 const ref=useRef<HTMLCanvasElement>(null); const paused=useRef(false); const syncRef=useRef<()=>void>(()=>{}); const [isPaused,setPaused]=useState(false);
 useEffect(()=>{
  const canvas=ref.current, ctx=canvas?.getContext("2d",{alpha:false});
  if(!canvas||!ctx)return;
  let disposed=false,ready=false,visible=true,frame=0,elapsed=0,last=0,lastDraw=0;
  let day:Uint8ClampedArray,night:Uint8ClampedArray,pixels:ImageData;
  let surface:{offset:number;longitude:number;row:number;light:number;night:number;rim:number;glow:number}[]=[];
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  const tw=1536,th=768;
  const load=(file:string)=>new Promise<Uint8ClampedArray>((resolve,reject)=>{
   const img=new Image();img.onload=()=>{
    if(disposed)return;
    const c=document.createElement("canvas");c.width=tw;c.height=th;
    const t=c.getContext("2d",{willReadFrequently:true});if(!t){reject();return;}
    t.drawImage(img,0,0,tw,th);resolve(t.getImageData(0,0,tw,th).data);
   };img.onerror=reject;img.src=`/brand/earth-sunrise/${file}`;
  });
  const draw=()=>{
   if(!ready||disposed||!pixels)return;
   // Subtracting the increasing longitude produces eastward surface rotation.
   const turn=.7/(Math.PI*2)+(elapsed%180000)/180000,out=pixels.data;
   for(const s of surface){
    const u=((s.longitude-turn)%1+1)%1,i=(s.row+Math.floor(u*tw))*4;
    const light=Math.max(night[i],night[i+1],night[i+2])*s.night*1.25;
    out[s.offset]=day[i]*.86*s.light+light+255*(s.rim*.8+s.glow);
    out[s.offset+1]=day[i+1]*s.light+light*.63+255*(s.rim*.60+s.glow*.74);
    out[s.offset+2]=day[i+2]*.91*s.light+light*.2+255*(s.rim*.28+s.glow*.36);
   }
   ctx.putImageData(pixels,0,0);if(canvas.dataset.ready!=="true")canvas.dataset.ready="true";
  };
  const resize=()=>{
   const ratio=Math.min(1,900/canvas.clientWidth);
   canvas.width=Math.max(1,Math.round(canvas.clientWidth*ratio));canvas.height=Math.max(1,Math.round(canvas.clientHeight*ratio));
   pixels=ctx.createImageData(canvas.width,canvas.height);surface=[];
   const aspect=canvas.width/canvas.height,r=Math.min(2.6,aspect*2.5),cx=aspect*.5,cy=.42+r,sx=aspect*.9,sy=cy-Math.sqrt(r*r-(sx-cx)**2);
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    const px=x/canvas.height,py=y/canvas.height,qx=(px-cx)/r,qy=(py-cy)/r,d=Math.hypot(qx,qy),sun=Math.hypot(px-sx,py-sy),offset=(y*canvas.width+x)*4;
    const flare=Math.exp(-Math.abs(py-sy)*180)*Math.exp(-Math.abs(px-sx)*6)*.18;
    const glow=Math.exp(-sun*14)*.1+Math.exp(-sun*34)*.5+Math.exp(-sun*110)*1.6+flare;
    const horizon=Math.exp(-Math.abs(d-1)*r*85)*(.22+.64*Math.exp(-Math.abs(px-sx)*1.6));pixels.data[offset+3]=255;
    if(d<1){const z=Math.sqrt(1-d*d),light=Math.max(0,(qx*.85-qy*.9+z*.2)/1.254);
     const latitude=Math.max(-1,Math.min(1,(-qy-z)*Math.SQRT1_2)),depth=(-qy+z)*Math.SQRT1_2;
     surface.push({offset,longitude:Math.atan2(qx,depth)/(Math.PI*2)+.5,row:Math.min(th-1,Math.floor(Math.acos(latitude)/Math.PI*th))*tw,light:.13+light*.72,night:1-Math.min(1,light/.5),rim:horizon,glow});
    }else{const haze=Math.exp(-(d-1)*r*24)*(.05+.10*Math.exp(-Math.abs(px-sx)*2)),h=Math.exp(-sun*10)*.14;
     pixels.data[offset]=255*(.012+.58*h+.8*horizon+haze+glow);pixels.data[offset+1]=255*(.038+.30*h+.60*horizon+haze*.65+glow*.74);pixels.data[offset+2]=255*(.028+.075*h+.28*horizon+haze*.28+glow*.36);
    }
   }draw();
  };
  const tick=(time:number)=>{if(last)elapsed+=Math.min(time-last,100);last=time;if(time-lastDraw>=50){draw();lastDraw=time;}frame=requestAnimationFrame(tick);};
  const sync=()=>{cancelAnimationFrame(frame);last=0;draw();if(!paused.current&&ready&&visible&&!document.hidden&&!motion.matches&&!disposed)frame=requestAnimationFrame(tick);};
  syncRef.current=sync;
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(canvas);
  motion.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
  Promise.all([load("earth-day.jpg"),load("earth-night.png")]).then(maps=>{if(disposed)return;[day,night]=maps;ready=true;resize();sync();}).catch(()=>{/* Keep the original sunrise if textures fail. */});
  return()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();motion.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);};
 },[]);
 return <><canvas ref={ref} className="rotating-earth" aria-hidden="true"/><button type="button" className="globe-control" aria-pressed={isPaused} onClick={()=>{paused.current=!paused.current;setPaused(paused.current);syncRef.current();}}>{isPaused?"Resume globe":"Pause globe"}</button></>;
}
