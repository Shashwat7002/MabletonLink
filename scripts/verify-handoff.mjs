import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
for(const path of ['SOURCES.md','MAINTENANCE.md','DEMO-SCRIPT.md','EVALUATION-KIT.md','TWO-PAGE-BRIEF.md','QA-IMPLEMENTATION.md']){const s=readFileSync('docs/'+path,'utf8');assert.ok(s.length>1000,path);assert.ok(!s.includes('<placeholder>'),path);}
const qa=readFileSync('docs/QA-IMPLEMENTATION.md','utf8');for(const text of ['not a held-out','No real Gemini key','not conducted','pending','unverified'])assert.ok(qa.includes(text),text);
const source=readFileSync('docs/SOURCES.md','utf8');assert.ok(source.includes('conflicting'));assert.ok(source.includes('sign-in page'));
const maintenance=readFileSync('docs/MAINTENANCE.md','utf8');for(const text of ['public/guidance.json','source','reviewed_on','both languages'])assert.ok(maintenance.includes(text));
const evidence=JSON.parse(readFileSync('tests/evidence/browser-outcomes.json'));assert.equal(evidence.length,44);assert.ok(evidence.every(x=>!x.overflow&&x.focus==='page-title'&&x.violations.length===0));
console.log('Six handoff documents and 44 recorded browser outcomes checked.');console.log('handoff verification passed');
