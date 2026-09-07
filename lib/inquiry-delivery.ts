import {randomUUID} from 'node:crypto';
import {company} from '@/content/company';
import type {Inquiry} from './contact';
export interface InquiryDelivery {accept(envelope:{caseId:string;recipient:string;inquiry:Inquiry}):Promise<{accepted:true;providerId:string}>}
// Adapter injection is server-side only. No production provider has been selected.
export async function deliverInquiry(inquiry:Inquiry,adapter:InquiryDelivery|null){
 if(!adapter)throw new Error('delivery_unconfigured');
 const caseId='LLRD-'+randomUUID();
 const accepted=await adapter.accept({caseId,recipient:company.businessEmail,inquiry});
 if(accepted.accepted!==true||!accepted.providerId)throw new Error('delivery_unconfirmed');
 return {ok:true as const,caseId};
}
