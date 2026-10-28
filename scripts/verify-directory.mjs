import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {strings,categoryNames} from '../public/i18n.mjs';
const read=p=>JSON.parse(readFileSync(p));const d=read('public/services.json'),es=read('public/services.es.json'),g=read('public/guidance.json');
export function validateDirectory(d,es,g){
 const ids=new Set(d.entries.map(e=>e.id));assert.equal(ids.size,d.entries.length);assert.equal(Object.keys(es).length,ids.size);assert.equal(Object.keys(g.services).length,ids.size);
 for(const e of d.entries){assert.match(e.official_url,/^https:\/\//);assert.match(e.source_url,/^https:\/\//);assert.match(e.reviewed_on,/^\d{4}-\d{2}-\d{2}$/);assert.ok(categoryNames[e.category_id]);for(const key of ['title','description','applicability'])assert.ok(es[e.id][key]?.length>8,`${e.id} Spanish ${key}`);for(const key of ['operator','authority','next','prepare'])for(const lang of ['en','es'])assert.ok(g.services[e.id][key][lang]?.length>5,`${e.id} ${key} ${lang}`);if(g.services[e.id].phone)assert.ok(g.phones[g.services[e.id].phone]);}
 for(const c of d.categories)assert.equal(c.count,d.entries.filter(e=>e.category_id===c.id).length);
 assert.deepEqual(g.journeys.map(j=>j.id).sort(),['access','dumping','housing','transport','trash']);
 let paths=0;for(const j of g.journeys){const visited=new Set();function walk(key,parents=[]){assert.ok(!parents.includes(key),'cycle');const s=j.steps[key];assert.ok(s,`missing step ${key}`);for(const lang of ['en','es'])assert.ok(s.question[lang]);for(const c of s.choices){for(const lang of ['en','es'])assert.ok(c.label[lang]);assert.ok(Boolean(c.next)!==Boolean(c.outcome));if(c.next)walk(c.next,[...parents,key]);else{const o=j.outcomes[c.outcome];assert.ok(o);visited.add(c.outcome);paths++;assert.ok(o.service_ids.length||c.outcome==='emergency');o.service_ids.forEach(id=>assert.ok(ids.has(id),'unapproved service'));for(const lang of ['en','es'])assert.ok(o.instruction[lang]&&o.title[lang]);}}}walk(j.start);assert.equal(visited.size,Object.keys(j.outcomes).length,'unreachable outcome');}
 for(const phone of Object.values(g.phones)){assert.match(phone.number,/^\d{3}-\d{3}-\d{4}$/);assert.match(phone.source,/^https:\/\//);assert.ok(phone.label.en&&phone.label.es);}
 return {services:ids.size,journeys:g.journeys.length,terminalPaths:paths};
}
const measurements=validateDirectory(d,es,g);
// Negative controls: the same validator must reject a missing translation and an injected destination.
const badES=structuredClone(es);delete badES[d.entries[0].id];assert.throws(()=>validateDirectory(d,badES,g));const bad=structuredClone(g);bad.journeys[0].outcomes.missed.service_ids=['invented'];assert.throws(()=>validateDirectory(d,es,bad));
for(const [key,pair] of Object.entries(strings))assert.ok(pair.length===2&&pair.every(x=>typeof x==='string'&&x.length),key);
const app=readFileSync('public/app.js','utf8'),html=readFileSync('public/index.html','utf8');for(const m of app.matchAll(/\bt\('([^']+)'\)/g))assert.ok(strings[m[1]],m[1]);for(const m of html.matchAll(/data-(?:t|label)="([^"]+)"/g))assert.ok(strings[m[1]],m[1]);
console.log(JSON.stringify({...measurements,uiStrings:Object.keys(strings).length,negativeControls:2}));console.log('bilingual directory verification passed');
