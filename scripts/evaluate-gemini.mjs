// Opt-in real API check. Uses only synthetic questions and prints decisions, never credentials.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createAssistant} from '../server/assistant.mjs';
const directory=JSON.parse(readFileSync(new URL('../public/services.json',import.meta.url)));
const cases=JSON.parse(readFileSync(new URL('../tests/routing-benchmark.json',import.meta.url)));
const reportUrl=new URL('../tests/evidence/live-gemini-results.json',import.meta.url);
const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
const suiteFingerprint=createHash('sha256').update(['../public/services.json','../tests/routing-benchmark.json','../server/assistant.mjs','../server/policy.mjs'].map(path=>readFileSync(new URL(path,import.meta.url),'utf8')).join('\n')).digest('hex');
const resume=process.argv.includes('--resume')||process.argv.includes('--check-resume');
const previous=resume?JSON.parse(readFileSync(reportUrl)):null;
if(previous && (previous.model!==model||previous.suiteFingerprint!==suiteFingerprint||previous.total!==cases.length||!Array.isArray(previous.results)||new Set(previous.results.map(r=>r.case)).size!==previous.results.length||previous.results.some(r=>!cases.some(c=>c.id===r.case&&c.status===r.expected_status))))throw new Error('Cannot resume: evaluation source, model or recorded cases do not match. Preserve this evidence and start a new run.');
// Preserve routing failures. Only unavailable requests are retried after quota recovery.
const results=previous?previous.results.filter(r=>r.http>=200&&r.http<300):[];
const unavailableAttempts=previous?[...(previous.unavailableAttempts||[]),...previous.results.filter(r=>r.http<200||r.http>=300).map(r=>({...r,runAt:previous.runAt}))]:[];
if(process.argv.includes('--check-resume')){console.log(JSON.stringify({retained:results.length,remaining:cases.length-results.length,unavailableAttempts:unavailableAttempts.length,model}));process.exit(0);}
if (!process.env.GEMINI_API_KEY) { console.error('Set GEMINI_API_KEY in the environment or ignored .dev.vars file first.'); process.exit(1); }
const sql=new DatabaseSync(':memory:');
sql.exec('CREATE TABLE assistant_usage (bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
const DB={prepare(query){return {bind(...args){return {async first(){return sql.prepare(query).get(...args);},async all(){return {success:true,results:sql.prepare(query).all(...args)};}};}};},async batch(statements){return Promise.all(statements.map(s=>s.all()));}};
const delayMs=Number(process.env.GEMINI_EVAL_DELAY_MS||13500);
if(!Number.isInteger(delayMs)||delayMs<0||delayMs>60000)throw new Error('Invalid evaluation delay');
let providerCalls=0,lastCallAt=0;
const handle=createAssistant({directory,getEnv:()=>({...process.env,DB}),fetchImpl:async(...args)=>{providerCalls++;lastCallAt=Date.now();return fetch(...args);}});
function saveResults(){
 const hardFailures=results.filter(r=>r.result!=='PASS'&&r.http>=200&&r.http<300&&['unsupported','sensitive-urgent'].includes(cases.find(c=>c.id===r.case).group)).length;
 const report={runAt:new Date().toISOString(),startedAt:previous?.startedAt||previous?.runAt,model,suiteFingerprint,kind:'Live Gemini with synthetic prompts; urgent/sensitive cases handled before provider',total:cases.length,completed:results.length,passed:results.filter(r=>r.result==='PASS').length,hardFailures,providerCalls:(previous?.providerCalls||0)+providerCalls,delayMs,unavailableAttempts,results};
 writeFileSync(reportUrl,JSON.stringify(report,null,2)+'\n');
 return report;
}
for (const [i,item] of cases.entries()) {
 if(results.some(r=>r.case===item.id))continue;
 if(lastCallAt){const waitMs=delayMs-(Date.now()-lastCallAt);if(waitMs>0)await new Promise(resolve=>setTimeout(resolve,waitMs));}
 const response=await handle(new Request('https://evaluation.local/api/assistant',{method:'POST',headers:{Origin:'https://evaluation.local','Content-Type':'application/json'},body:JSON.stringify({question:item.question,previous_question:item.previous_question||'',previous_service_ids:item.previous_service_ids||[],locale:item.group==='spanish'?'es':'en'})}));
 const answer=await response.json();
 const selected=answer.services.map(s=>s.id);
 const pass=response.ok && (item.status==='journey'
   ? (answer.status==='clarify'||(answer.status==='match'&&selected.includes(item.service)))
   : answer.status===item.status && (!item.service||selected.includes(item.service)));
 const result={case:item.id,result:pass?'PASS':'FAIL',http:response.status,status:answer.status,code:answer.code,service_ids:selected,expected_status:item.status,review:item.status==='journey'?'Review ambiguity and provider relevance; the UI also offers deterministic guided choices.':undefined};
 results.push(result);console.log(JSON.stringify(result));
 saveResults();
 if(!response.ok){console.error('Evaluation stopped on unavailable response; unrun cases are not passes. Check provider quota or availability before rerunning.');break;}

}
const report=saveResults();
const failures=results.filter(r=>r.result!=='PASS').length;
console.log(`Completed ${results.length}/${cases.length} synthetic cases; ${failures} failures. All cases require human assessment of relevance; journey cases allow clarification. This is live-model evaluation, separate from the deterministic benchmark.`);
process.exitCode=(results.length!==cases.length||results.some(r=>r.http<200||r.http>=300)||failures>3||report.hardFailures)?1:0;
