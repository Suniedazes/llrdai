export interface Post {
 id:string; revision:number; slug:string; title:string; summary:string; body:string;
 status:"DRAFT"|"PUBLISHED"; createdAt:string; updatedAt:string; publishedAt?:string;
 social:{facebook:string;instagram:string;tiktok:string};
}
export type PostInput=Pick<Post,"title"|"slug"|"summary"|"body"|"status"|"social"> & {id?:string;revision?:number};
export function parsePost(value:unknown):PostInput {
 if(!value||typeof value!=="object")throw Error("Post details are required.");
 const p=value as Record<string,unknown>;
 const string=(key:string,max:number,required=false)=>{const v=p[key];if(typeof v!=="string"||v.length>max||(required&&!v.trim()))throw Error("Check "+key+".");return v.trim();};
 const title=string("title",150,true),slug=string("slug",100,true),summary=string("summary",400),body=string("body",30000);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error("Use lowercase words separated by hyphens for the URL.");
 if(p.status!=="DRAFT"&&p.status!=="PUBLISHED")throw Error("Choose draft or published.");
 if(p.status==="PUBLISHED"&&(!summary||!body))throw Error("Add a summary and article before publishing.");
 const social=p.social as Record<string,unknown>|undefined;
 if(!social||["facebook","instagram","tiktok"].some(k=>typeof social[k]!=="string"||(social[k] as string).length>10000))throw Error("Check the social captions.");
 if(p.id!==undefined&&(typeof p.id!=="string"||!/^[0-9a-f-]{36}$/.test(p.id)))throw Error("Invalid post identifier.");
 if(p.id!==undefined&&(!Number.isInteger(p.revision)||Number(p.revision)<1))throw Error("Reload this post before editing.");
 return {title,slug,summary,body,status:p.status,id:p.id as string|undefined,revision:p.revision as number|undefined,social:{facebook:String(social.facebook),instagram:String(social.instagram),tiktok:String(social.tiktok)}};
}
