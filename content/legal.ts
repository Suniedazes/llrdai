import data from "./legal-package.json";
export const legalPackage = data;
export const legalRoutes:Record<string,{title:string;parts:number[]}>={
 legal:{title:"Legal & Privacy Center",parts:data.parts.map((_,i)=>i)},
 privacy:{title:"Privacy Policy",parts:[0,1,17,18,19,20,21]},
 terms:{title:"Terms of Use",parts:[3,4,8,10,12,13,14,15,16]},
 cookies:{title:"Cookie & Tracking Technologies Policy",parts:[2]},
 "ai-policy":{title:"AI & Automated Systems Policy",parts:[5]},
 security:{title:"Security & Responsible Disclosure",parts:[9]},
 accessibility:{title:"Accessibility Statement",parts:[11]},
 "state-privacy-rights":{title:"U.S. State Privacy Rights",parts:[1,20,21]},
 "family-privacy":{title:"Children’s & Family Privacy",parts:[6,7]},
};
