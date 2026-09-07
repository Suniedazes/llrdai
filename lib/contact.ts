export const services=[
 {value:"Website Development",title:"Website & Digital Experience Development",description:"Modern websites and digital experiences designed around your organization, customers, and goals."},
 {value:"Application Development",title:"Application Development",description:"From an idea to a working product—planning, requirements, design, development, testing, and implementation."},
 {value:"Project / Program Management",title:"Project & Program Management",description:"Experienced leadership for technology implementations, transformation initiatives, vendor projects, and complex programs."},
 {value:"Risk Management / Project Recovery",title:"Risk Management & Project Recovery",description:"Identify risks early, strengthen governance, resolve delivery issues, and help projects get back on track."},
 {value:"Technology / AI Strategy",title:"Technology & AI Strategy",description:"Explore practical ways to use technology, automation, data, and AI to improve your organization."},
 {value:"Partnership Opportunity",title:"Partnership Opportunities",description:"Connect with LLRD about strategic partnerships, collaboration, investment, or other business opportunities."}
];
export const privacyOptions=["Access my information","Correct my information","Delete my information","Request a copy/download of my information","Withdraw consent","Opt out of applicable targeted advertising, sale, sharing, or profiling","Parent/guardian privacy request","Privacy Appeal","Report a privacy concern","Other privacy request"];
export const contactOptions=["General","Product Support","SONIE","ElseSide","Privacy Request","Privacy Appeal","Legal / Copyright / DMCA","Security","Accessibility","Business / Partnership","Other",...services.map(s=>s.value),...privacyOptions.filter(x=>x!=="Privacy Appeal")];
export type Inquiry={name:string;email:string;service:string;message:string;website:string};
export function validateInquiry(input:unknown){
 const raw=input&&typeof input==="object"?input as Record<string,unknown>:{};
 const data={} as Inquiry;const errors:Partial<Record<keyof Inquiry,string>>={};
 const limits={name:100,email:254,service:80,message:5000,website:200};
 for(const [key,max] of Object.entries(limits)){const field=key as keyof Inquiry;data[field]=typeof raw[field]==="string"?(raw[field] as string).trim():"";if(data[field].length>max)errors[field]=`Please use ${max} characters or fewer.`;if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(data[field]))errors[field]="Please remove unsupported characters.";}
 for(const key of ["name","email","service","message"] as const)if(!data[key])errors[key]="This field is required.";
 if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))errors.email="Enter a valid email address.";
 if(data.service&&!contactOptions.includes(data.service))errors.service="Choose one of the available services.";
 return {data,errors};
}
