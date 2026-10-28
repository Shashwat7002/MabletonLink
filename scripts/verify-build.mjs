import assert from 'node:assert/strict';import {readFileSync,readdirSync,statSync} from 'node:fs';import {spawnSync,spawn} from 'node:child_process';
const build=spawnSync('npm',['run','build'],{encoding:'utf8'});if(build.status!==0){console.error(build.stdout,build.stderr);process.exit(1);}
function files(dir){return readdirSync(dir).flatMap(n=>{const p=dir+'/'+n;return statSync(p).isDirectory()?files(p):[p];});}
const hasSecret=text=>/AIza[0-9A-Za-z_-]{35}/.test(text)||/\bAQ\.[0-9A-Za-z_-]{30,}/.test(text)||/generativelanguage\.googleapis\.com/.test(text)||/GEMINI_API_KEY/.test(text);
assert.equal(hasSecret('AIza'+'X'.repeat(35)),true,'positive control');assert.equal(hasSecret('GEMINI_API_KEY'),true);assert.equal(hasSecret('AQ.'+'X'.repeat(40)),true);
for(const path of files('dist/client').filter(p=>/\.(js|mjs|json|html)$/.test(p)))assert.equal(hasSecret(readFileSync(path,'utf8')),false,`credential boundary: ${path}`);
const server=spawn(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','4181','--inspector-port','0'],{stdio:'ignore'});
try{let ready=false;for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:4181');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}assert.ok(ready,'local server starts');
 const root=await fetch('http://127.0.0.1:4181');assert.ok(root.headers.get('content-security-policy').includes("connect-src 'self'"));assert.ok((await root.text()).includes('Language / Idioma'));
 for(const path of ['app.js','i18n.mjs','routing.mjs','services.json','services.es.json','guidance.json']){const r=await fetch('http://127.0.0.1:4181/'+path);assert.equal(r.status,200);assert.ok((await r.text()).length>100,path);}
 const request=question=>fetch('http://127.0.0.1:4181/api/assistant',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://127.0.0.1:4181'},body:JSON.stringify({question,previous_question:'',previous_service_ids:[],locale:'es'})});
 const unavailable=await request('Pagar la factura del agua');assert.equal(unavailable.status,503);assert.equal((await unavailable.json()).code,'not_configured');const emergency=await request('No puedo respirar');assert.equal(emergency.status,200);assert.equal((await emergency.json()).status,'emergency');
 console.log('Build, six static modules/data files, CSP, no-key API fallback and Spanish emergency verified; secret-detection controls passed.');console.log('production build verification passed');
}finally{server.kill('SIGTERM');}
