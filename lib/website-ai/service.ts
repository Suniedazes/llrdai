import {facts,unknownAnswer} from './content';
import type {WebsiteAIProvider} from './provider';
export function sensitiveOrAdvice(query:string){return /\b(password|passcode|ssn|social security|credit card|bank account|routing number|passport|genetic|raw dna|diagnos\w*|symptom\w*|medication|medical advice|legal advice|financial advice|my health|my medical)\b|\b\d{3}[- ]\d{2}[- ]\d{4}\b|(?:\d[ -]?){13,19}|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(query);}
export async function answerQuestion(query:string,provider:WebsiteAIProvider){
 if(sensitiveOrAdvice(query))return {ids:[],answer:'Please do not share sensitive personal information. I can only help with public LLRD company and product information, not medical, legal or financial advice.',links:[{href:'/contact',label:'Contact LLRD'}]};
 const result=await provider.selectFacts(query,facts) as {ids?:unknown};
 if(!result||!Array.isArray(result.ids)||result.ids.length>2||result.ids.some(id=>typeof id!=='string'||!facts.some(f=>f.id===id)))throw new Error('invalid_output');
 const ids=result.ids as string[];const selected=facts.filter(f=>ids.includes(f.id));
 return {ids:selected.filter(f=>['sonie','elseside'].includes(f.id)).map(f=>f.id),answer:selected.length?selected.map(f=>f.text).join('\n\n').slice(0,1600):unknownAnswer,links:selected.length?selected.map(f=>({href:f.href,label:'Learn more'})):[{href:'/contact',label:'Contact LLRD'}]};
}
