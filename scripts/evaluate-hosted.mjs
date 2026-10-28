// Synthetic, opt-in hosted checks. Optional private-site access token is read from stdin only.
import {readFileSync,writeFileSync} from 'node:fs';
const origin='https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site';
const input=readFileSync(0,'utf8').trim();const token=input?JSON.parse(input).token:'';
const selectedCase=process.argv.find(a=>a.startsWith('--case='))?.slice(7);
const allCases=JSON.parse(readFileSync('tests/deadline-live-cases.json'));
if(selectedCase&&!allCases.some(c=>c.id===selectedCase))throw new Error('Unknown case');
const cases=selectedCase?allCases.filter(c=>c.id===selectedCase):allCases;
const reportPath='tests/evidence/deadline-live-results'+(selectedCase?'.'+selectedCase:'')+'.json';
const directory=JSON.parse(readFileSync('public/services.json'));const byId=new Map(directory.entries.map(e=>[e.id,e]));
const results=[];let cookie='';
for(const c of cases){
 const start=Date.now();let r,body;
 try{r=await fetch(origin+'/api/assistant',{method:'POST',redirect:'error',signal:AbortSignal.timeout(18000),headers:{Origin:origin,'Content-Type':'application/json',...(token?{'OAI-Sites-Authorization':'Bearer '+token}:{}),...(cookie?{Cookie:cookie}:{})},body:JSON.stringify({question:c.question,locale:c.locale,previous_question:'',previous_service_ids:[]})});
 const setCookie=r.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];
 body=await r.json();
 }catch{results.push({case:c.id,pass:false,error:'transport_or_non_json_response'});break;}
 const selected=(body.services||[]).map(s=>s.id);const canonical=(body.services||[]).every(s=>byId.has(s.id)&&s.official_url===byId.get(s.id).official_url);
 const pass=r.ok&&canonical&&c.statuses.includes(body.status)&&(!c.requiredAny||c.requiredAny.some(id=>selected.includes(id)))&&(body.status!=='match'||!c.allowedIfMatch||selected.every(id=>c.allowedIfMatch.includes(id)))&&(body.status==='match'||selected.length===0);
 const result={case:c.id,locale:c.locale,http:r.status,status:body.status,code:body.code,service_ids:selected,message:body.message,canonical,pass,elapsedMs:Date.now()-start};results.push(result);console.log(JSON.stringify(result));
 writeFileSync(reportPath,JSON.stringify({runAt:new Date().toISOString(),kind:'Synthetic hosted Gemini checks; no resident participants; single cookie session, no automatic retries',model:'gemini-3.1-flash-lite',origin,completed:results.length,total:cases.length,passed:results.filter(x=>x.pass).length,results},null,2)+'\n');
 if(!r.ok)break;
 if(c!==cases.at(-1))await new Promise(resolve=>setTimeout(resolve,Math.max(0,4500-(Date.now()-start))));
}
console.log(JSON.stringify({completed:results.length,total:cases.length,passed:results.filter(x=>x.pass).length}));if(results.length!==cases.length||results.some(x=>!x.pass))process.exitCode=1;
