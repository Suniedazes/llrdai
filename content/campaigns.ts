export interface Campaign {
 id:string; slug:string; name:string; productId:string; headline:string; subheadline:string;
 heroMedia?:string; campaignTheme:"earth"|"sunrise"; source?:string; medium?:string; campaignCode?:string;
 ctaType:"PLATFORMS"|"WAITLIST"; destination?:string; activeFrom?:string; activeUntil?:string;
 status:"DRAFT"|"ACTIVE"|"PAUSED"|"ENDED";
}
export const campaigns:readonly Campaign[]=[];
