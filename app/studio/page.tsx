import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {localHost,studioEnabled} from "@/lib/studio-access";
import {postStore} from "@/lib/post-store";
import {PostStudio} from "@/components/PostStudio";
export const dynamic="force-dynamic";
export const metadata={title:"Posting studio",robots:{index:false,follow:false}};
export default async function Studio(){const h=await headers();if(!studioEnabled()||!localHost(h.get("host")))notFound();return <PostStudio initialPosts={await postStore.list()} token={process.env.LLRD_STUDIO_TOKEN!}/>;}
