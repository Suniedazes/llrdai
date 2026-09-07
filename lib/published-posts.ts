import snapshot from '@/content/published-posts.json';
import {publicationSnapshot} from './publication';
export async function publishedPosts(){
 if(process.env.LLRD_LOCAL_STUDIO==='true'){const {postStore}=await import('./post-store');return publicationSnapshot(await postStore.list());}
 return snapshot as import('./publication').PublishedPost[];
}
