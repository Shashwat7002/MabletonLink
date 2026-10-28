// Opt-in real API check. Uses only synthetic questions and prints decisions, never credentials.
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createAssistant} from '../server/assistant.mjs';
if (!process.env.GEMINI_API_KEY) { console.error('Set GEMINI_API_KEY in the ignored .dev.vars file first.'); process.exit(1); }
const directory=JSON.parse(readFileSync(new URL('../public/services.json',import.meta.url)));
const cases=JSON.parse(readFileSync(new URL('../tests/gemini-evaluation.json',import.meta.url)));
const sql=new DatabaseSync(':memory:');
sql.exec('CREATE TABLE assistant_usage (bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
const DB={prepare(query){return {bind(...args){return {async first(){return sql.prepare(query).get(...args);},async all(){return {success:true,results:sql.prepare(query).all(...args)};}};}};},async batch(statements){return Promise.all(statements.map(s=>s.all()));}};
const handle=createAssistant({directory,getEnv:()=>({...process.env,DB})});
let failures=0;
for (const [i,item] of cases.entries()) {
 const response=await handle(new Request('https://evaluation.local/api/assistant',{method:'POST',headers:{Origin:'https://evaluation.local','Content-Type':'application/json'},body:JSON.stringify({question:item.question,previous_question:item.previous_question||'',previous_service_ids:item.previous_service_ids||[]})}));
 const answer=await response.json();
 const selected=answer.services.map(s=>s.id);
 const pass=response.ok && (!item.expected_status||item.expected_status===answer.status) && (!item.expected_any_id||item.expected_any_id.some(id=>selected.includes(id)));
 console.log(JSON.stringify({case:i+1,result:pass?(item.note?'REVIEW':'PASS'):'FAIL',status:answer.status,service_ids:selected,...(item.note?{review:item.note}:{})}));
 if(!pass)failures++;
}
console.log(`Completed ${cases.length} synthetic cases; ${failures} failures. REVIEW cases require human assessment of relevance.`);
process.exitCode=failures?1:0;
