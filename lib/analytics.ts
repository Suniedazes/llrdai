export type AnalyticsEvent = "product_viewed"|"campaign_viewed"|"open_web_clicked"|"app_store_clicked"|"play_store_clicked"|"support_clicked"|"waitlist_clicked"|"product_discovery_shown"|"product_discovery_dismissed"|"product_discovery_started"|"product_interest_selected"|"product_recommendation_shown"|"product_selected"|"learn_more_selected"|"channel_selection_shown";
export type AnalyticsAdapter=(event:AnalyticsEvent,context:Readonly<{productId?:string;campaignId?:string}>)=>void;
let consent=false;
let adapter:AnalyticsAdapter|undefined;
export function configureAnalytics(provider?:AnalyticsAdapter){adapter=provider;}
export function setAnalyticsConsent(allowed:boolean){consent=allowed;}
export function track(event:AnalyticsEvent,context:{productId?:string;campaignId?:string}={}) {
 if(consent&&adapter) {try{adapter(event,context);}catch{/* Analytics never blocks navigation. */}}
}
