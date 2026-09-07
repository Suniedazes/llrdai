export const statuses = ["AVAILABLE","BETA","TESTING","COMING_SOON","NOT_OFFERED"] as const;
export type PlatformStatus = typeof statuses[number];
export type Channel = "web" | "ios" | "android";
export interface Product {
 cardImage?:string; cardSummary?:string; stage?:string; audience?:string; problem?:string; ctaLabel?:string;
 id:string; name:string; slug:string; logo?:string; tagline:string; shortDescription:string;
 longDescription:string; category:string; heroImage?:string; brandColors?:{background:string;foreground:string};
 websiteUrl?:string; webAppUrl?:string; webStatus:PlatformStatus;
 appleAppStoreUrl?:string; iosStatus:PlatformStatus; googlePlayUrl?:string; androidStatus:PlatformStatus;
 featured:boolean; displayOrder:number; supportUrl?:string; privacyUrl?:string; legalUrl?:string;
 securityUrl?:string; campaignLinks:string[]; comingSoonMessage?:string; waitlistEnabled:boolean;
 waitlistUrl?:string; platformNotes?:Partial<Record<Channel,string>>;
 features:{title:string;description:string}[]; media:{src:string;alt:string}[];
 attributionOrigins?:string[];
 discoverable?:boolean;
 launchStatus?:"PUBLISHED"|"COMING_SOON"|"PRIVATE"|"INTERNAL"|"UNANNOUNCED"|"DISABLED";
 discoveryCategories?:string[]; discoveryTopics?:string[]; discoveryPriority?:number;
}
export const products: readonly Product[] = [{discoverable:true,launchStatus:"COMING_SOON",discoveryCategories:["family"],discoveryTopics:["history","genealogy","stories","relatives","tree","memories"],discoveryPriority:10,stage:"Active Development / Pilot Preparation",audience:"Families, genealogists, family historians and multigenerational family communities.",problem:"Family history, memories, evidence and relationships are fragmented across people, documents and services.",ctaLabel:"Explore SONIE",cardImage:"/brand/sonie/logo-tagline.png",cardSummary:"A private place to preserve family history, share memories and connect generations.",logo:"/brand/sonie/wordmark.svg",id:"sonie",name:"SONIE",slug:"sonie",tagline:"Family lives here.",shortDescription:"A private family platform for genealogy, relationships, profiles, evidence, memories, stories, collaboration and preservation across generations.",longDescription:"SONIE brings family history, relationships, profiles, evidence, memories and stories into a private platform designed for collaboration and preservation across generations.",category:"Family connection",webStatus:"COMING_SOON",iosStatus:"COMING_SOON",androidStatus:"COMING_SOON",featured:true,displayOrder:1,campaignLinks:[],comingSoonMessage:"SONIE is coming soon. More details and access options will be published here as they are ready.",waitlistEnabled:false,features:[{title:"Family stories",description:"A future home for the memories and stories families want to keep close."},{title:"Shared connection",description:"Thoughtful ways to bring people and generations together."}],media:[]},{
 stage:"In Development",audience:"Players who enjoy discovery, exploration, mystery and story-driven interactive worlds.",ctaLabel:"Discover ElseSide",cardSummary:"Discover the world beside our own through exploration, mystery and interactive storytelling.",logo:"/brand/elseside/wordmark.png",heroImage:"/brand/elseside/brand-artwork.png",brandColors:{background:"#020405",foreground:"#F4F3EE"},id:"elseside",name:"ElseSide™",slug:"elseside",
 tagline:"There’s another world right beside yours.",
 shortDescription:"An original interactive game/world experience built around discovering the world that exists beside our own.",
 longDescription:"ElseSide™ is an original interactive game/world experience built around discovering the world that exists beside our own. It is in development, with more details to come as the experience takes shape.",
 category:"Interactive worlds",featured:true,displayOrder:2,
 discoverable:true,launchStatus:"COMING_SOON",discoveryCategories:["entertainment"],discoveryTopics:[],discoveryPriority:0,
 webStatus:"COMING_SOON",iosStatus:"COMING_SOON",androidStatus:"COMING_SOON",
 campaignLinks:[],comingSoonMessage:"ElseSide™ is coming soon. More details and access options will be published here as they are ready.",
 waitlistEnabled:false,features:[],media:[]
}];
// Discovery is opt-in; legacy public product records remain valid.
export const isPublicProduct = (p:Product) => !p.launchStatus || p.launchStatus==="PUBLISHED" || p.launchStatus==="COMING_SOON";
export const orderedProducts = () => products.filter(isPublicProduct).sort((a,b)=>a.displayOrder-b.displayOrder);
export const getProduct = (slug:string) => products.find(p=>p.slug===slug&&isPublicProduct(p));
