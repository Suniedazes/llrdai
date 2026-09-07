import test from 'node:test';
import assert from 'node:assert/strict';
import {legalPackage,legalRoutes} from '../content/legal';
import {contactDelivery} from '../lib/contact-delivery';
test('legal package retains all 81 numbered provisions and supplied dates',()=>{
 const sections=legalPackage.parts.flatMap(p=>p.sections);
 assert.equal(sections.length,81);
 assert.deepEqual(sections.map(s=>Number(s.title.split('.')[0])),Array.from({length:81},(_,i)=>i+1));
 assert.equal(legalPackage.effectiveDate,'October 12, 2026');
 assert.equal(legalPackage.updatedDate,'September 7, 2026');
 assert.doesNotMatch(JSON.stringify(legalPackage),/\[(?:URL|STREET|CITY|YEAR|FULL LEGAL|PRIVACY APPEAL|SECURITY)/);
});
test('legal routes reference real parts without enabling collection',()=>{
 for(const r of Object.values(legalRoutes))for(const i of r.parts)assert.ok(legalPackage.parts[i]);
 assert.equal(contactDelivery.collectionEnabled,false);
 assert.ok(legalRoutes.privacy&&legalRoutes.security&&legalRoutes.terms);
});
