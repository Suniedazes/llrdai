import {company} from '@/content/company';
import {products} from '@/content/products';
export const facts=[
 {id:'company',text:`${company.legalName} is a Tennessee-based technology company. ${company.description}`,href:'/about'},
 ...products.filter(p=>p.discoverable).map(p=>({id:p.id,text:`${p.name}: ${p.shortDescription} Stage: ${p.stage}. Public availability: Coming Soon.`,href:'/products/'+p.slug})),
 {id:'contact',text:`Contact ${company.legalName} at ${company.businessEmail} or ${company.phone}. ${company.address}. Online form delivery is not yet connected.`,href:'/contact'},
 {id:'privacy',text:'The Legal & Privacy Center contains the supplied corporate privacy framework, effective October 12, 2026. Product-specific notices may apply. This assistant cannot interpret legal obligations or provide legal advice.',href:'/privacy'},
 {id:'legal',text:'Find corporate terms, cookies, accessibility, state privacy rights and security information in the Legal & Privacy Center.',href:'/legal'},
 {id:'products',text:'Explore the LLRD portfolio or use Find My App to identify a relevant product. Products under development are not yet publicly available.',href:'/products'},
 {id:'support',text:'Product support details are provided through the LLRD support page and individual product pages as they become available.',href:'/support'},
];
export const unknownAnswer='I don’t have that information in the approved LLRD website content. Please contact LLRD for assistance.';
export const unavailable='LLRD’s AI assistant is temporarily unavailable. You can continue exploring our products or contact LLRD for assistance.';
