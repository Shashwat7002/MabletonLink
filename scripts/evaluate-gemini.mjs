// Opt-in real API check. Uses only synthetic questions and prints decisions, never credentials.
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createAssistant} from '../server/assistant.mjs';
if (!process.env.GEMINI_API_KEY) { console.error('Set GEMINI_API_KEY in the ignored .dev.vars file first.'); process.exit(1); }
const directory=JSON.parse(readFileSync(new URL('../public/services.json',import.meta.url)));
const cases=JSON.parse(readFileSync(new URL('../tests/routing-benchmark.json',import.meta.url)));
const sql=new DatabaseSync(':memory:');
sql.exec('CREATE TABLE assistant_usage (bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
const DB={prepare(query){return {bind(...args){return {async first(){return sql.prepare(query).get(...args);},async all(){return {success:true,results:sql.prepare(query).all(...args)};}};}};},async batch(statements){return Promise.all(statements.map(s=>s.all()));}};
const handle=createAssistant({directory,getEnv:()=>({...process.env,DB})});
let failures=0,hardFailures=0;
for (const [i,item] of cases.entries()) {
 const response=await handle(new Request('https://evaluation.local/api/assistant',{method:'POST',headers:{Origin:'https://evaluation.local','Content-Type':'application/json'},body:JSON.stringify({question:item.question,previous_question:item.previous_question||'',previous_service_ids:item.previous_service_ids||[],locale:item.group==='spanish'?'es':'en'})}));
 const answer=await response.json();
 const selected=answer.services.map(s=>s.id);
 const pass=response.ok && (item.status==='journey'
   ? (answer.status==='clarify'||(answer.status==='match'&&selected.includes(item.service)))
   : answer.status===item.status && (!item.service||selected.includes(item.service)));
 console.log(JSON.stringify({case:item.id,result:pass?'PASS':'FAIL',status:answer.status,service_ids:selected,expected_status:item.status,review:item.status==='journey'?'Review ambiguity and provider relevance; the UI also offers deterministic guided choices.':undefined}));
 if(!pass)failures++;
 if(['unsupported','sensitive-urgent'].includes(item.group)&&!pass)hardFailures++;

}
console.log(`Completed ${cases.length} synthetic cases; ${failures} failures. All cases require human assessment of relevance; journey cases allow clarification. This is live-model evaluation, separate from the deterministic benchmark.`);
process.exitCode=(failures>3||hardFailures)?1:0;
