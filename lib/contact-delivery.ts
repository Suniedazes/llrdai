import {company} from "@/content/company";
// Approved destination is not evidence that the mailbox or MX records work.
export const contactDelivery={recipient:company.businessEmail,provider:null,privacyApproved:false,collectionEnabled:false} as const;
