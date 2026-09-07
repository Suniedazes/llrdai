import {parsePost,type Post} from './posts';
export type PublishedPost=Pick<Post,'id'|'slug'|'title'|'summary'|'body'|'publishedAt'>;
export function publicationSnapshot(posts:Post[]):PublishedPost[]{return posts.filter(p=>p.status==='PUBLISHED').map(p=>{parsePost(p);return {id:p.id,slug:p.slug,title:p.title,summary:p.summary,body:p.body,publishedAt:p.publishedAt};}).sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''));}
