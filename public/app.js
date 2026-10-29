import {icon} from './icons.mjs';
import {translate,categoryNames} from './i18n.mjs';
import {searchServices,routeQuestion} from './routing.mjs';
import {savedKeys,savedItemKey,loadSavedItems,toggleSavedItem,persistSavedItems} from './saved-items.mjs';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const keys={language:'mabletonlink.language.v1'};
const savedStorage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
let locale=read(keys.language,'en')==='es'?'es':'en';
const t=k=>translate(k,locale), countText=n=>`${n} ${t(n===1?'resultSingle':'results')}`, local=value=>value?.[locale]??value?.en??'';
let directory,spanish,guidance,entries=[],byId=new Map(),savedItems=[],limit=18,dialogContext=null,opener=null;
let controller,requestNumber=0,previous={question:'',ids:[]},announceTimer;
const essentials=['pay-a-water-bill','find-an-approved-trash-hauler','report-a-road-or-neighborhood-problem','school-bus-route-finder'];
const starter=['check-city-limits-and-council-district','start-stop-or-transfer-water-service','find-an-approved-trash-hauler','enroll-a-student','south-cobb-regional-library'];
function record(id){const e=byId.get(id);return e&&{...e,...(locale==='es'?spanish[id]:{})};}
function route(){const [view='home',query='']=location.hash.slice(1).split('?');return{view:view||'home',params:new URLSearchParams(query)};}
function go(hash){if(location.hash===hash){render();focusPage();}else location.hash=hash;}
function focusPage(){focus($('#question-title')?'#question-title':'#page-title');}
function focus(selector){const el=$(selector);if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});}}
function notice(text,inside=false){const el=inside&&$('#detail-dialog').open?$('#detail-status'):$('#action-announcement');el.textContent='';setTimeout(()=>{el.textContent=text;},30);}
function external(url,label,attrs=''){return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${attrs}>${esc(label)} ${icon('external')}<span class="sr-only"> (${t('newTab')})</span></a>`;}
function serviceTitle(id){return record(id)?.title||'';}
function favoriteButton(item){const p=typeof item==='string'?{kind:'service',id:item}:item;const saved=savedItems.some(x=>planKey(x)===planKey(p));return `<button type="button" class="save-button${saved?' is-saved':''}" data-favorite-item="${esc(JSON.stringify(p))}" aria-pressed="${saved}" aria-label="${esc(t(saved?'remove':'save')+': '+planTitle(p))}">${icon(saved?'check':'star')}<span>${t(saved?'remove':'save')}</span></button>`;}
function serviceCard(id){const e=record(id);if(!e)return'';return `<article class="service-card"><div class="service-main"><div><h3 class="service-title">${esc(e.title)}</h3><p class="agency-label">${esc(e.agency)}</p></div><p class="service-description">${esc(e.description)}</p></div><div class="card-actions"><button type="button" class="info-button" data-service="${esc(id)}" aria-label="${esc(t('next')+': '+e.title)}">${t('next')} ${icon('arrow-right')}</button>${favoriteButton(id)}</div></article>`;}
function serviceCards(ids){return `<div class="service-grid">${ids.map(serviceCard).join('')}</div>`;}
function savedCard(p){if(p.kind==='service')return serviceCard(p.id);const j=guidance.journeys.find(j=>j.id===p.id),outcome=j.outcomes[p.outcome];return `<article class="service-card"><div class="service-main"><h3 class="service-title">${esc(planTitle(p))}</h3><p class="agency-label">${t('savedSteps')}</p><p class="service-description">${esc(local(outcome.instruction))}</p></div><div class="card-actions"><a class="info-button" href="#guide?journey=${p.id}&result=${p.outcome}" aria-label="${esc(t('next')+': '+planTitle(p))}">${t('next')} ${icon('arrow-right')}</a>${favoriteButton(p)}</div></article>`;}
function journeyTiles(){return `<div class="journey-grid">${guidance.journeys.map(j=>`<a class="journey-tile" href="#guide?journey=${j.id}">${icon(j.icon)}<span><strong>${esc(local(j.title))}</strong><span>${esc(local(j.description))}</span></span>${icon('arrow-right')}</a>`).join('')}</div>`;}
function categorySelect(id,selected=''){return `<label for="${id}">${t('category')}<select id="${id}" name="category"><option value="">${t('allCategories')}</option>${directory.categories.map(c=>`<option value="${c.id}" ${selected===c.id?'selected':''}>${esc(categoryNames[c.id][locale==='es'?1:0])}</option>`).join('')}</select></label>`;}
function categoryGrid(){return `<section class="categories-section"><h2>${t('categories')}</h2><form id="home-category-form" class="filter-bar home-category-form">${categorySelect('home-category')}<button class="primary-button" type="submit">${t('viewCategory')}</button></form></section>`;}
function localize(){document.documentElement.lang=locale;document.title=locale==='es'?'MabletonLink — Servicios locales':'MabletonLink — Local services';$$('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));$$('[data-label]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.label)));$('#language').value=locale;$('#service-search').placeholder=t('searchHint');$('#assistant-input').placeholder=t('questionHint');$('#conversation').setAttribute('aria-label',t('ai'));}
function title(name,description=''){ $('#page-title').textContent=name;$('#page-description').textContent=description;$('#page-description').hidden=!description;}
function validPlan(p){return p&&((p.kind==='service'&&byId.has(p.id))||(p.kind==='journey'&&guidance.journeys.find(j=>j.id===p.id)?.outcomes[p.outcome]));}
const planKey=savedItemKey;
function planTitle(p){return p.kind==='service'?serviceTitle(p.id):local(guidance.journeys.find(j=>j.id===p.id).outcomes[p.outcome].title);}
function planForRoute(params){const key=params.get('key');return savedItems.find(p=>planKey(p)===key);}
function announceResults(text){clearTimeout(announceTimer);announceTimer=setTimeout(()=>{$('#results-announcement').textContent=text;},350);}
function renderFavorites(query,category){
 const matchingIds=new Set(searchServices(query,entries,spanish).map(e=>e.id));
 const results=savedItems.filter(p=>{const ids=p.kind==='service'?[p.id]:guidance.journeys.find(j=>j.id===p.id).outcomes[p.outcome].service_ids;
  return (!category||ids.some(id=>byId.get(id)?.category_id===category))&&(!query||ids.some(id=>matchingIds.has(id))||planTitle(p).toLocaleLowerCase().includes(query.toLocaleLowerCase()));});
 const summary=`${results.length} ${t(results.length===1?'savedItem':'savedItems')}`;
 $('#directory-content').innerHTML=`<div class="filter-bar">${categorySelect('category-select',category)}</div><h2 id="results-title" tabindex="-1" class="results-count">${summary}</h2>${results.length?`<div class="service-grid">${results.map(savedCard).join('')}</div>`:`<div class="empty-state"><h3>${t(savedItems.length?'noResults':'emptyFavorites')}</h3><p>${t(savedItems.length?'noResultsText':'emptyFavoritesText')}</p><a href="#home" class="text-link">${t('guided')}</a></div>`}`;
 announceResults(summary);
}
function render(){if(!directory)return;clearTimeout(announceTimer);$('#results-announcement').textContent='';localize();const {view,params}=route();const query=params.get('q')||'';const category=params.get('category')||'';$('#service-search').value=query;$('#clear-search').hidden=!query;$('#search-area').hidden=['guide','plan','start'].includes(view);
 $$('.nav-link').forEach(el=>{const active=el.dataset.view===view;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 const content=$('#directory-content');
 if(view==='guide'){renderJourney(params);return;}
 if(view==='plan'){title(t('savedSteps'));const p=planForRoute(params);content.innerHTML=p?planMarkup(p,true):`<p>${t('invalidPlan')}</p><a class="text-link" href="#all">${t('all')}</a>`;return;}
 if(view==='start'){title(t('newResident'),t('newResidentText'));content.innerHTML=serviceCards(starter);return;}
 if(view==='home'&&!query&&!category){title(t('title'),t('subtitle'));content.innerHTML=`<section aria-labelledby="guided-title"><div class="section-heading"><div><h2 id="guided-title">${t('guided')}</h2><p>${t('guidedHint')}</p></div></div>${journeyTiles()}</section><section class="common-section"><div class="section-heading"><h2>${t('popular')}</h2><a href="#all" class="text-link">${t('viewAll')}</a></div>${serviceCards(essentials)}</section><section class="new-resident"><h2>${t('newResident')}</h2><p>${t('newResidentText')}</p><a href="#start" class="text-link">${t('newResidentAction')}</a></section>${categoryGrid()}`;return;}
 title(t(view==='favorites'?'favorites':'all'),view==='favorites'?t('savedNote'):'');
 if(view==='favorites'){renderFavorites(query,category);return;}
 let pool=entries;if(category)pool=pool.filter(e=>e.category_id===category);const results=searchServices(query,pool,spanish);
 content.innerHTML=`<div class="filter-bar">${categorySelect('category-select',category)}</div><h2 id="results-title" tabindex="-1" class="results-count">${countText(results.length)}</h2>${results.length?serviceCards(results.slice(0,limit).map(e=>e.id)):`<div class="empty-state"><h3>${t('noResults')}</h3><p>${t('noResultsText')}</p><a href="#home" class="text-link">${t('guided')}</a></div>`}${results.length>limit?`<div class="load-more"><button class="secondary-button" type="button" id="load-more">${t('more')}</button></div>`:''}`;
 announceResults(countText(results.length));
}
function renderJourney(params){const j=guidance.journeys.find(j=>j.id===params.get('journey'));if(!j){go('#home');return;}const outcome=params.get('result');
 if(outcome&&j.outcomes[outcome]){title(local(j.outcomes[outcome].title));$('#directory-content').innerHTML=planMarkup({kind:'journey',id:j.id,outcome},true)+`<a href="#guide?journey=${j.id}" class="text-link">${t('restart')}</a>`;return;}
 const key=params.get('step')||j.start,s=j.steps[key]||j.steps[j.start];title(local(j.title),t('step'));
 $('#directory-content').innerHTML=`<section class="guided-question" aria-labelledby="question-title"><h2 id="question-title" tabindex="-1">${esc(local(s.question))}</h2><div class="choice-list">${s.choices.map(c=>`<a class="choice" href="#guide?journey=${j.id}&${c.next?'step='+c.next:'result='+c.outcome}">${esc(local(c.label))}${icon('arrow-right')}</a>`).join('')}</div><a class="text-link" href="${key===j.start?'#home':'#guide?journey='+j.id}">${t(key===j.start?'home':'restart')}</a></section>`;
}
function actionCard(id,headingLevel=3){const e=record(id),g=guidance.services[id],phone=guidance.phones[g.phone];const source=e.source_url||e.official_url;return `<article class="action-card"><h${headingLevel}>${esc(e.title)}</h${headingLevel}><dl><dt>${t('provider')}</dt><dd>${esc(local(g.operator))}</dd><dt>${t('authority')}</dt><dd>${esc(local(g.authority))}</dd><dt>${t('why')}</dt><dd>${esc(e.applicability)}</dd><dt>${t('nextStep')}</dt><dd>${esc(local(g.next))}</dd><dt>${t('prepare')}</dt><dd>${esc(local(g.prepare))}</dd></dl><div class="official-action">${external(e.official_url,t('official'),`class="primary-button" data-official="${esc(id)}"`)}<span class="print-url">${esc(e.official_url)}</span></div><h${headingLevel+1}>${t('phone')}</h${headingLevel+1}>${phone?`<p>${esc(local(phone.label))}<br><a class="phone-link" href="tel:${phone.number.replace(/-/g,'')}">${phone.number}</a></p>`:`<p>${t('noPhone')}</p>`}<a class="text-link access-link" href="#guide?journey=access" data-leave-dialog>${t('access')}</a><details class="source-details"><summary>${t('sources')}</summary><p>${t('reviewed')}: <time datetime="${esc(e.reviewed_on)}">${esc(e.reviewed_on)}</time></p>${external(source,t('sourcePage'), 'class="text-link"')}<span class="print-url">${esc(source)}</span>${phone?`<p>${t('reviewed')}: ${phone.reviewed_on}</p>${external(phone.source,t('phoneSource'),'class="text-link"')}<span class="print-url">${esc(phone.source)}</span>`:''}</details></article>`;}
function planMarkup(p,actions=false,headingLevel=2){let ids,head='';if(p.kind==='service')ids=[p.id];else{const j=guidance.journeys.find(j=>j.id===p.id),o=j.outcomes[p.outcome];ids=o.service_ids;head=`<p class="plan-instruction">${esc(local(o.instruction))}</p>`;if(p.outcome==='emergency')return `${head}<p>${t('emergencyAnswer')}</p><a class="primary-button" href="tel:911">${t('call911')}</a>`;}
 return `${head}<p class="action-state" role="status">${t('found')}</p>${ids.map(id=>actionCard(id,headingLevel)).join('')}<p class="plan-note">${t('planNote')}</p>${actions?`<div class="plan-actions">${favoriteButton(p)}<button class="secondary-button" type="button" data-print-plan="${esc(JSON.stringify(p))}">${t('print')}</button></div>`:''}`;}
function showDialog(context){opener=document.activeElement;dialogContext=context;$('#detail-status').textContent='';renderDialog();$('#detail-dialog').showModal();$('#detail-dialog').scrollTop=0;$('#detail-title').focus();}
function renderDialog(){const c=dialogContext;if(!c)return;$('#detail-content').innerHTML=c.kind==='about'?`<h2 id="detail-title" tabindex="-1">${t('about')}</h2><p>${t('aboutText')}</p><p>${t('translationNote')}</p>`:`<h2 id="detail-title" tabindex="-1">${esc(serviceTitle(c.id))}</h2>${planMarkup(c,true,3)}`;}
function toggleFavorite(p,button){if(!validPlan(p))return;const dialog=button.closest('dialog'),key=planKey(p);savedItems=toggleSavedItem(savedItems,p);const ok=persistSavedItems(savedStorage,savedItems);render();if(dialog)renderDialog();const replacement=$$('[data-favorite-item]',dialog||document).find(el=>planKey(JSON.parse(el.dataset.favoriteItem))===key);if(replacement)replacement.focus({preventScroll:true});else focus($('#results-title')?'#results-title':'#page-title');notice(t(ok?(savedItems.some(x=>planKey(x)===key)?'saved':'removed'):'tabOnly'),Boolean(dialog));}
function printPlan(p){if(!validPlan(p))return;$('#print-area').innerHTML=`<h1>MabletonLink</h1><h2>${esc(planTitle(p))}</h2>${planMarkup(p)}<p>${t('independent')}</p>`;$$('details',$('#print-area')).forEach(el=>el.open=true);window.print();}
function cancelQuestion(){requestNumber++;controller?.abort();controller=null;$('#assistant-input').readOnly=false;$('#assistant-form button').disabled=false;$('#assistant-status').textContent='';}
function resetQuestion(){cancelQuestion();previous={question:'',ids:[]};$('#assistant-input').value='';$('#conversation').innerHTML='';$('#conversation').hidden=true;$('#assistant-error').textContent='';$('#assistant-input').removeAttribute('aria-invalid');}
function responseMarkup(result,mode){const status=result.status;return `<h3 id="answer-title" tabindex="-1">${t(mode==='ai'?'ai':mode==='fixed'?'safety':'local')}</h3><p>${t(status==='emergency'?'emergencyAnswer':status==='journey'?'journeyAnswer':status==='clarify'&&['service_type','provider','city_limits'].includes(result.clarification_id)?'clarify_'+result.clarification_id:['match','clarify','out_of_scope','sensitive'].includes(status)?status:'not_found')}</p>${mode==='local'?`<p class="input-help">${t('localNotice')}</p>`:''}${status==='emergency'?`<a href="tel:911" class="primary-button">${t('call911')}</a>`:status==='journey'?`<a class="primary-button" data-leave-assistant href="#guide?journey=${esc(result.journey)}">${esc(local(guidance.journeys.find(j=>j.id===result.journey).title))}</a>`:(result.service_ids||[]).map(id=>`<button type="button" class="chat-link" data-assistant-service="${esc(id)}">${esc(serviceTitle(id))} ${icon('arrow-right')}</button>`).join('')}${status!=='emergency'?`<a class="text-link" data-leave-assistant href="#home">${t('guided')}</a>`:''}`;}
async function ask(){const input=$('#assistant-input'),question=input.value.trim();if(!question||question.length>500){$('#assistant-error').textContent=t('emptyQuestion');input.setAttribute('aria-invalid','true');input.focus();return;}
 $('#assistant-error').textContent='';input.removeAttribute('aria-invalid');cancelQuestion();const run=requestNumber;controller=new AbortController();const activeController=controller;const timer=setTimeout(()=>activeController.abort(),15000);input.readOnly=true;$('#assistant-form button').disabled=true;$('#assistant-status').textContent=t('sending');input.focus();let result=routeQuestion(question),mode=['emergency','sensitive'].includes(result.status)?'fixed':'local';
 try{if(!['emergency','sensitive'].includes(result.status)){const r=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,previous_question:previous.question,previous_service_ids:previous.ids,locale}),signal:controller.signal});if(r.ok){const body=await r.json();if(['match','clarify','out_of_scope','not_found','emergency','sensitive'].includes(body.status)&&Array.isArray(body.services)&&body.services.every(e=>byId.has(e.id))){result={status:body.status,service_ids:body.services.map(e=>e.id),clarification_id:['service_type','provider','city_limits'].includes(body.clarification_id)?body.clarification_id:undefined};mode='ai';// Use guided clarification for high-ambiguity topics, even if AI selects a generic record.
 const localResult=routeQuestion(question);if(localResult.status==='journey')result=localResult;
 }}}}catch{}finally{clearTimeout(timer);}
 if(run!==requestNumber)return;input.readOnly=false;$('#assistant-form button').disabled=false;$('#assistant-status').textContent='';previous=['sensitive','emergency','out_of_scope'].includes(result.status)?{question:'',ids:[]}:{question,ids:result.service_ids||[]};$('#conversation').innerHTML=responseMarkup(result,mode);$('#conversation').hidden=false;if($('#assistant-dialog').open)focus('#answer-title');
}
function closeDialogs(){for(const d of $$('dialog[open]'))d.close();}
document.addEventListener('click',event=>{
 const b=event.target.closest('button,a');if(!b)return;
 if(b.matches('[data-service]'))showDialog({kind:'service',id:b.dataset.service});
 if(b.matches('[data-about]'))showDialog({kind:'about'});
 if(b.matches('[data-open-help]')){opener=b;$('#help-dialog').showModal();$('#help-dialog').scrollTop=0;$('#help-dialog-title').focus();}
 if(b.matches('[data-close]'))$('#'+b.dataset.close).close();
 if(b.matches('[data-leave-dialog],[data-leave-assistant]'))closeDialogs();
 if(b.matches('[data-open-assistant]')){const source=b.closest('dialog')?opener:b;closeDialogs();opener=source;$('#assistant-dialog').showModal();focus('#assistant-input');}
 if(b.matches('[data-assistant-service]')){$('#assistant-dialog').close();showDialog({kind:'service',id:b.dataset.assistantService});}
 if(b.matches('[data-favorite-item]'))toggleFavorite(JSON.parse(b.dataset.favoriteItem),b);
 if(b.matches('[data-print-plan]'))printPlan(JSON.parse(b.dataset.printPlan));
 if(b.matches('[data-official]')){const container=b.closest('#detail-content,#directory-content');const status=$('.action-state',container);if(status)status.textContent=t('opened');}
 if(b.id==='load-more'){const before=limit;limit+=18;render();$$('[data-service]')[before]?.focus();}
 if(b.id==='clear-search'){$('#service-search').value='';updateSearch('');$('#service-search').focus();}
 if(b.id==='reset-chat'){resetQuestion();focus('#assistant-input');$('#assistant-status').textContent=t('resetDone');}
 if(b.id==='retry-directory')init(true);
});
for(const d of $$('dialog'))d.addEventListener('close',()=>{if(!$$('dialog[open]').length){if(opener?.isConnected&&!opener.closest('dialog'))opener.focus({preventScroll:true});else $('#page-title').focus({preventScroll:true});}});
function updateSearch(query){const {view,params}=route();params.set('q',query);if(!query)params.delete('q');limit=18;history.replaceState(null,'',`#${view==='favorites'?'favorites':'all'}${params.size?'?'+params:''}`);render();}
document.addEventListener('submit',event=>{if(event.target.id==='home-category-form'){event.preventDefault();const category=$('#home-category').value;go('#all'+(category?'?category='+encodeURIComponent(category):''));}});
$('#service-search').addEventListener('input',e=>updateSearch(e.target.value));
$('#search-form').addEventListener('submit',e=>{e.preventDefault();updateSearch($('#service-search').value);focus('#results-title');});
document.addEventListener('change',e=>{if(e.target.id==='category-select'){const {view,params}=route();params.set('category',e.target.value);if(!e.target.value)params.delete('category');limit=18;go(`#${view==='favorites'?'favorites':'all'}${params.size?'?'+params:''}`);}});
$('#language').addEventListener('change',e=>{locale=e.target.value==='es'?'es':'en';write(keys.language,locale);resetQuestion();localize();if(directory){render();renderDialog();}else renderError();notice(t('languageChanged'));});
$('#assistant-form').addEventListener('submit',e=>{e.preventDefault();ask();});
window.addEventListener('hashchange',()=>{if(location.hash==='#main'){focus('#main');return;}limit=18;render();focusPage();});
window.addEventListener('storage',e=>{if(!directory)return;if(Object.values(savedKeys).includes(e.key)||e.key===null){loadSaved();render();if($('#detail-dialog').open)renderDialog();}});
function loadSaved(){savedItems=loadSavedItems(savedStorage,validPlan);}
function renderError(){$('#results-announcement').textContent=t('loadError');$('#directory-content').innerHTML=`<div class="empty-state"><h2 id="directory-error" tabindex="-1">${t('loadError')}</h2><button type="button" id="retry-directory" class="primary-button">${t('retry')}</button>${external('https://www.mableton.gov/1212/Resident-Resource-Guide',t('residentGuide'),'class="text-link"')}</div>`;title(t('title'),t('subtitle'));}
async function init(retry=false){localize();$('#directory-content').setAttribute('aria-busy','true');$('#directory-content').innerHTML=`<p role="status">${t('loading')}</p>`;$$('[data-open-assistant],#search-form button,#service-search').forEach(e=>e.disabled=true);
 try{const loaded=await Promise.all(['services.json','services.es.json','guidance.json'].map(async url=>{const r=await fetch('./'+url);if(!r.ok)throw Error('directory');return r.json();}));[directory,spanish,guidance]=loaded;entries=directory.entries;byId=new Map(entries.map(e=>[e.id,e]));if(entries.some(e=>!/^https:\/\//.test(e.official_url)||!spanish[e.id]||!guidance.services[e.id]))throw Error('data');loadSaved();$$('[data-open-assistant],#search-form button,#service-search').forEach(e=>e.disabled=false);render();if(retry)focus('#page-title');}
 catch{directory=null;renderError();if(retry)focus('#directory-error');}finally{$('#directory-content').removeAttribute('aria-busy');}}
const resize=new ResizeObserver(()=>{const h=$('.site-header');document.documentElement.style.setProperty('--focus-top',getComputedStyle(h).position==='sticky'?`${h.offsetHeight+18}px`:'18px');});resize.observe($('.site-header'));
const assistantResize=new ResizeObserver(()=>{$('#assistant-dialog').style.setProperty('--dialog-focus-top',`${$('.sheet-header').offsetHeight+16}px`);});assistantResize.observe($('.sheet-header'));
init();
