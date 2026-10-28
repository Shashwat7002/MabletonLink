const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
  star:'<path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9Z"/>',
  pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  x:'<path d="m6 6 12 12M6 18 18 6"/>',
  'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'arrow-up':'<path d="M12 20V4m-6 6 6-6 6 6"/>',
  'arrow-up-right':'<path d="M5 19 19 5M5 5h14v14"/>',
  external:'<path d="M14 3h7v7m0-7L10 14"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  sprout:'<path d="M12 21v-8c0-6 3-9 9-9 0 6-3 9-9 9ZM12 16C5 16 3 13 3 7c6 0 9 3 9 9Z"/>',
  phone:'<path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3c0 3-1 4-4 4C10 21 3 14 3 7c0-3 1-4 4-4Z"/>',
  sunrise:'<path d="M2 18h20M3 22h18M6 18a6 6 0 0 1 12 0M12 2v4M3.5 8.5l3 3m14-3-3 3M1 14h3m16 0h3"/>',
  sparkles:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 1v4m-2-2h4M3 18v4m-2-2h4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  map:'<path d="m9 3 6 3 6-3v17l-6 3-6-3-6 3V6Zm0 0v17m6-14v17"/>',
  refresh:'<path d="M20 7a9 9 0 1 0 1 8M20 3v5h-5"/>',
  droplet:'<path d="M12 2s8 8 8 13a8 8 0 0 1-16 0c0-5 8-13 8-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  road:'<path d="m7 3-4 18M17 3l4 18M12 3v3m0 4v4m0 4v3"/>',
  receipt:'<path d="m5 3 3 2 4-2 4 2 3-2v18l-3-2-4 2-4-2-3 2ZM9 9h6m-6 4h6m-6 4h3"/>',
  home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',
  bus:'<rect x="4" y="3" width="16" height="17" rx="3"/><path d="M4 12h16M8 3v9m8-9v9M7 20v2m10-2v2M7 16h1m8 0h1"/>',
  school:'<path d="m2 9 10-6 10 6-10 6ZM5 11v6c5 4 9 4 14 0v-6M22 9v7"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  heart:'<path d="M20.5 4.5a5.3 5.3 0 0 0-7.5 0L12 5.6l-1.1-1.1a5.3 5.3 0 0 0-7.5 7.5L12 21l8.5-9a5.3 5.3 0 0 0 0-7.5Z"/>',
  hands:'<path d="m3 5 5-2 4 2 4-2 5 2-3 7-6 5-6-5Zm5-2 4 2-4 4 3 2 5-3m-9 5 5 6m-7-3 5 5m4-4 3 2"/>',
  tree:'<path d="M12 2 5 10h3l-5 7h7v5h4v-5h7l-5-7h3Z"/>',
  building:'<path d="m3 8 9-5 9 5ZM4 21h16M5 11v7m5-7v7m4-7v7m5-7v7"/>',
  vote:'<path d="m9 3 9 5-5 8-9-5ZM3 13l-1 8h20l-1-8h-4m-10 1h9"/>',
  scales:'<path d="M12 3v18m-5 0h10M3 7h18M6 7l-4 8h8Zm12 0-4 8h8Z"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c6 4 12 4 18 0M10 13v4h4v-4"/>',
  paw:'<ellipse cx="5" cy="8" rx="2" ry="3"/><ellipse cx="11" cy="5" rx="2" ry="3"/><ellipse cx="18" cy="8" rx="2" ry="3"/><path d="M8 14c3-5 5-5 8 0 7 7 1 9-4 5-5 4-11 2-4-5Z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
};
function icon(name, extra='') { return `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`; }
function hydrateIcons(root=document) { $$('[data-icon]',root).forEach(el=>{el.outerHTML=icon(el.dataset.icon, el.className ? `class="${escape(el.className)}"` : '');}); }
hydrateIcons();

const categoryMeta = {
 'emergency-safety-alerts':{name:'Safety & alerts',icon:'shield'},
 'report-a-problem-animal-services':{name:'Report a problem & pets',icon:'paw'},
 'water-electricity-gas':{name:'Utilities',icon:'droplet'},
 'trash-bulky-items-recycling':{name:'Trash & recycling',icon:'trash'},
 'taxes-property-records-city-payments':{name:'Taxes & payments',icon:'receipt'},
 'building-permits-business-licenses':{name:'Permits & licenses',icon:'home'},
 'transportation-traffic-vehicles':{name:'Getting around',icon:'bus'},
 'schools-meals-childcare':{name:'Schools & childcare',icon:'school'},
 'health-services-vital-records':{name:'Health & records',icon:'heart'},
 'food-housing-benefits-senior-support':{name:'Food, housing & support',icon:'hands'},
 'parks-libraries-arts':{name:'Parks, libraries & arts',icon:'tree'},
 'city-government-records-participation':{name:'City government',icon:'building'},
 'voting-elections':{name:'Voting & elections',icon:'vote'},
 'courts-legal-resources':{name:'Courts & legal help',icon:'scales'},
 'jobs-training-contracting':{name:'Jobs & training',icon:'briefcase'}
};
const shortTitles = {
 'pay-a-water-bill':'Pay my water bill', 'find-an-approved-trash-hauler':'Trash & recycling',
 'report-a-road-or-neighborhood-problem':'Report a road problem', 'county-property-taxes':'Property taxes',
 'permit-and-licensing-portal':'Permits & licenses', 'school-bus-route-finder':'School bus routes',
 'check-city-limits-and-council-district':'Find my district', 'report-a-code-violation':'Report a code concern',
 'city-payments-and-fees':'City payments', 'find-food-housing-and-other-help':'Find community help',
 'city-news-and-notifications':'City updates', 'public-safety-special-service-district-bill':'Public Safety SSD bill',
 'start-stop-or-transfer-water-service':'Start or stop water service', 'parentvue-grades-and-attendance':'ParentVUE',
 'driver-s-license-and-state-id':'Driver’s license & ID', 'register-or-update-voter-registration':'Voter registration',
 'get-a-police-incident-or-accident-report':'Get a police report', 'public-health-services':'Public health services',
};
const shortDescriptions = {
 'pay-a-water-bill':'Pay your bill or manage your water account.',
 'find-an-approved-trash-hauler':'Find approved haulers and local disposal options.',
 'report-a-road-or-neighborhood-problem':'Let the right team know about potholes and road issues.',
 'county-property-taxes':'Look up your property tax bill and payment options.',
 'permit-and-licensing-portal':'Start an application or check on a permit.',
 'school-bus-route-finder':'Find your child’s school bus route and stop.',
};
const essentials=['pay-a-water-bill','find-an-approved-trash-hauler','report-a-road-or-neighborhood-problem','county-property-taxes','permit-and-licensing-portal','school-bus-route-finder'];
const normalize=text=>String(text).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const stopWords=new Set('a an the i my me your to for of and or in is are do does can how what where who with about need want find help please s it on at'.split(' '));
const synonymGroups=[['trash','garbage','hauler','waste','pickup','rubbish'],['bill','billing','pay','payment','payments'],['license','licence','licensing'],['tag','tags','registration','vehicle'],['school','schools','student','child','children'],['job','jobs','career','employment','work','training'],['rent','rental','housing','shelter'],['food','meal','meals','nutrition','snap'],['electric','electricity','power'],['pet','pets','animal','animals'],['bus','buses','transit','transportation'],['permit','permits','permitting'],['tax','taxes','taxation'],['vote','voter','voting','election','elections'],['pothole','potholes','road','roadway'],['benefit','benefits','assistance','support']];
function variants(term){const group=synonymGroups.find(g=>g.includes(term));return group||[term];}
function matchServices(query,pool=entries){const clean=normalize(query);if(!clean)return [...pool];const terms=clean.split(' ').filter(t=>!stopWords.has(t));if(!terms.length)return [];return pool.map(entry=>{const title=normalize(entry.title+' '+(shortTitles[entry.id]||''));const text=normalize([title,entry.description,categoryMeta[entry.category_id].name,entry.agency].join(' '));let score=title.includes(clean)?30:0;let matched=0;for(const term of terms){const options=variants(term);if(options.some(v=>text.split(' ').some(word=>word===v||(v.length>=4&&word.startsWith(v))))){matched++;score+=title.includes(term)?8:options.some(v=>title.includes(v))?4:1;}}return{entry,score,matched};}).filter(x=>x.matched===terms.length).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title)).map(x=>x.entry);}

const storageKey='mabletonlink.favorites.v1';
let catalog, entries=[], entryMap=new Map(), favorites=new Set(), storageAvailable=true;
let state={view:'home',query:'',category:'',limit:18};
let toastTimer, resultsTimer, replyNumber=0;
function focusHeading(selector="#page-title"){updateFocusClearance();const el=$(selector);if(el){el.focus({preventScroll:true});el.scrollIntoView({block:"start",behavior:"instant"});}}
// Keep focused controls clear of headers and mobile navigation, including enlarged text.
function updateFocusClearance(){
 const header=$('.site-header'),nav=$('.main-nav'),sheet=$('#assistant-dialog');
 document.documentElement.style.setProperty('--focus-top',`${getComputedStyle(header).position==='sticky'?header.getBoundingClientRect().height+16:16}px`);
 document.documentElement.style.setProperty('--focus-bottom',`${getComputedStyle(nav).position==='fixed'?nav.getBoundingClientRect().height+16:16}px`);
 sheet.style.setProperty('--dialog-focus-top',`${$('.sheet-header').getBoundingClientRect().height+20}px`);
 $('#detail-dialog').style.setProperty('--dialog-focus-top',`${$('#detail-dialog .dialog-close').getBoundingClientRect().height+24}px`);
}
const focusClearanceObserver=new ResizeObserver(updateFocusClearance);
$$('.site-header, .main-nav, .sheet-header, #detail-dialog .dialog-close').forEach(el=>focusClearanceObserver.observe(el));
window.addEventListener('resize',updateFocusClearance);
function announceResults(message){clearTimeout(resultsTimer);resultsTimer=setTimeout(()=>{$("#results-announcement").textContent=message;},450);}
const dialogOpeners=new WeakMap();
const titleFor=e=>shortTitles[e.id]||e.title;
function notify(message){
 const status=$('dialog[open] [role="status"]')||$('#action-announcement');
 status.textContent='';requestAnimationFrame(()=>status.textContent=message);
 $('#toast').textContent=message;$('#toast').classList.add('visible');
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),5000);
}
function getFavorites(){try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return new Set(Array.isArray(value)?value.filter(id=>entryMap.has(id)):[]);}catch{storageAvailable=false;return new Set();}}
function saveFavorites(){try{localStorage.setItem(storageKey,JSON.stringify([...favorites]));storageAvailable=true;}catch{storageAvailable=false;}}
function favoriteButton(e){const saved=favorites.has(e.id);return `<button type="button" class="save-button${saved?' is-saved':''}" data-favorite="${escape(e.id)}" aria-label="${saved?'Remove':'Save'} ${escape(titleFor(e))} ${saved?'from':'to'} favorites">${icon(saved?'check':'star')}<span>${saved?'Remove':'Save'}</span></button>`;}
function infoButton(e){return `<button type="button" class="info-button" data-details="${escape(e.id)}" aria-label="More information about ${escape(titleFor(e))}">More information</button>`;}
function serviceCard(e){return `<article class="service-card"><div class="service-main"><span class="service-icon">${icon(e.id==='report-a-road-or-neighborhood-problem'?'road':categoryMeta[e.category_id].icon)}</span><div><h3 class="service-title">${escape(titleFor(e))}</h3><span class="agency-label">${escape(e.agency)}</span></div><p class="service-description">${escape(shortDescriptions[e.id]||e.description)}</p><a class="open-label" href="${escape(e.official_url)}" target="_blank" rel="noopener noreferrer">Open website<span class="sr-only"> for ${escape(titleFor(e))}</span> ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></div><div class="card-actions">${infoButton(e)}${favoriteButton(e)}</div></article>`;}
function serviceRow(e){return `<article class="service-row"><div class="row-main"><span class="service-icon">${icon(categoryMeta[e.category_id].icon)}</span><div><h3>${escape(titleFor(e))}</h3><span class="agency-label">${escape(e.agency)}</span><p class="row-description">${escape(shortDescriptions[e.id]||e.description)}</p></div><a class="open-label" href="${escape(e.official_url)}" target="_blank" rel="noopener noreferrer">Open website<span class="sr-only"> for ${escape(titleFor(e))}</span> ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></div><div class="row-actions">${favoriteButton(e)}${infoButton(e)}</div></article>`;}
function categoryTiles(){return catalog.categories.map(c=>{const m=categoryMeta[c.id];return `<a class="category-tile" href="#all?category=${c.id}" data-category="${c.id}" aria-label="${escape(m.name)}, ${c.count} services"><span class="category-icon">${icon(m.icon)}</span><strong>${escape(m.name)}</strong><small>${c.count} services</small></a>`;}).join('');}
function heading(title,subtitle='',action=''){return `<div class="section-heading"><div><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div>${action}</div>`;}
function homeFavorites(){const saved=entries.filter(e=>favorites.has(e.id));return saved.length?`${heading('Your favorites','Saved on this browser.','<a class="text-link" href="#favorites">View favorites '+icon('arrow-right')+'</a>')}<div class="service-grid">${saved.slice(0,3).map(serviceCard).join('')}</div>`:'';}
function homeView(){return `<section aria-label="Everyday essentials">${heading('Everyday essentials','','<a class="text-link" href="#categories">Browse categories '+icon('arrow-right')+'</a>')}<div class="service-grid">${essentials.map(id=>entryMap.get(id)).filter(Boolean).map(serviceCard).join('')}</div></section><section id="home-favorites" class="favorites-section" ${favorites.size?'':'hidden'}>${homeFavorites()}</section><section class="categories-section" aria-label="Browse by category">${heading('Browse by category','Choose a place to start.')}<div class="category-grid">${categoryTiles()}</div></section>`;}
function resultsView(){const isFav=state.view==='favorites';const pool=entries.filter(e=>(!isFav||favorites.has(e.id))&&(!state.category||e.category_id===state.category));const matches=matchServices(state.query,pool);announceResults(`${matches.length} ${matches.length===1?'service':'services'}${state.query?' for '+state.query:''}${state.category?' in '+categoryMeta[state.category].name:''}${isFav?' in your favorites':''}.`);let html=`<div class="filter-bar"><label for="category-filter">Category<select id="category-filter"><option value="">All categories</option>${catalog.categories.map(c=>`<option value="${c.id}" ${state.category===c.id?'selected':''}>${escape(categoryMeta[c.id].name)}</option>`).join('')}</select></label><div class="filter-actions">${state.query||state.category?'<button class="text-link" type="button" data-clear-filters>Clear filters '+icon('x')+'</button>':'<a class="browse-link" href="#categories">Browse categories '+icon('grid')+'</a>'}</div></div><div class="results-summary"><h2 id="results-title" class="results-count" tabindex="-1">${matches.length} ${matches.length===1?'service':'services'}${state.query?' for “'+escape(state.query)+'”':''}</h2>${isFav&&favorites.size?'<p class="favorites-note">'+icon('star')+' Saved on this browser</p>':''}</div>`;
 if(!matches.length){const emptyFavorites=isFav&&!favorites.size;html+=`<div class="empty-state"><div class="empty-symbol">${icon(emptyFavorites?'star':'search')}</div><h3 id="empty-title" tabindex="-1">${emptyFavorites?'Keep your go-to services here.':'No services found.'}</h3><p>${emptyFavorites?'Choose Save on a service to add it to your favorites. No account is needed.':'Try a different word, such as “water,” “trash,” or “school,” or clear your filters.'}</p><button class="primary-button" type="button" ${emptyFavorites?'data-browse':'data-clear-filters'}>${emptyFavorites?'Browse services':'Clear filters'} ${icon('arrow-right')}</button></div>`;if(emptyFavorites)html+=`<section class="favorites-suggestions">${heading('A few useful places to start')}<div class="service-grid">${essentials.slice(0,3).map(id=>entryMap.get(id)).map(serviceCard).join('')}</div></section>`;}
 else{html+=`<div class="service-list">${matches.slice(0,state.limit).map(serviceRow).join('')}</div>`;if(matches.length>state.limit)html+=`<div class="load-more"><button class="secondary-button" id="load-more" type="button">Show ${Math.min(18,matches.length-state.limit)} more services ${icon('arrow-right')}</button><p class="results-count">Showing ${state.limit} of ${matches.length} services</p></div>`;}
 return html;
}
function readHash(){const [view,search='']=location.hash.slice(1).split('?');const params=new URLSearchParams(search);return{view:['home','all','favorites','categories'].includes(view)?view:'home',query:(params.get('q')||'').slice(0,200),category:catalog.categories.some(c=>c.id===params.get('category'))?params.get('category'):'',limit:18};}
function routeHash(){const params=new URLSearchParams();if(state.category)params.set('category',state.category);if(state.query)params.set('q',state.query);return '#'+state.view+(params.size?'?'+params:'');}
function navigate(next,{replace=false,scroll=false}={}){state={...state,...next,limit:next.limit||18};if(state.view==='home'||state.view==='categories'){state.category='';state.query='';}const hash=routeHash();if(location.hash!==hash)history[replace?'replaceState':'pushState'](null,'',hash);$('#service-search').value=state.query;render();if(scroll)window.scrollTo({top:0,behavior:'instant'});}
function render(){if(state.view==='home'||state.view==='categories'){clearTimeout(resultsTimer);$('#results-announcement').textContent='';}const copy={home:['What do you need today?','Local services for your home, family, and community.'],all:[state.category?categoryMeta[state.category].name:'All services','Find the right service from the city, county, and local providers.'],favorites:['Your favorites','A familiar place for the services you use most.'],categories:['Browse by category','Choose a place to start, then find the service you need.']}[state.view];$('#page-title').textContent=copy[0];$('#page-description').textContent=copy[1];$('#directory-content').innerHTML=state.view==='home'?homeView():state.view==='categories'?`<div class="category-grid">${categoryTiles()}</div>`:resultsView();$('#favorites-count').textContent=favorites.size;$('#favorites-count').hidden=!favorites.size;$('#clear-search').hidden=!state.query;$('#search-help').hidden=state.view==='favorites';$('#service-search').placeholder=state.view==='favorites'?'Search your favorites':'e.g. water bill';$$('.nav-link').forEach(a=>{const active=a.dataset.view===(state.view==='categories'?'all':state.view);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.title=(state.view==='home'?'Your local services':copy[0])+' — MabletonLink';}
function toggleFavorite(id){
 if(!entryMap.has(id))return;
 const saved=!favorites.has(id),active=document.activeElement;
 const onFavorite=active?.dataset.favorite===id;
 const buttons=$$('#directory-content [data-favorite]'),previousIndex=buttons.indexOf(active);
 saved?favorites.add(id):favorites.delete(id);saveFavorites();
 if(state.view==='favorites')render();
 else if(state.view==='home'){
  const section=$('#home-favorites');section.innerHTML=homeFavorites();section.hidden=!favorites.size;
 }
 $('#favorites-count').textContent=favorites.size;$('#favorites-count').hidden=!favorites.size;
 $$(`[data-favorite="${id}"]`).forEach(btn=>{
  btn.classList.toggle('is-saved',saved);
  btn.setAttribute('aria-label',`${saved?'Remove':'Save'} ${titleFor(entryMap.get(id))} ${saved?'from':'to'} favorites`);
  btn.innerHTML=icon(saved?'check':'star')+`<span>${saved?'Remove':'Save'}</span>`;
 });
 if(onFavorite&&!active.isConnected){
  const remaining=$$('#directory-content [data-favorite]');
  const target=state.view==='favorites'&&!favorites.size?$('#empty-title'):
   $(`#directory-content [data-favorite="${id}"]`)||remaining[Math.min(Math.max(previousIndex,0),remaining.length-1)]||$('#page-title');
  target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest',behavior:'instant'});
 }
 notify(storageAvailable?`${titleFor(entryMap.get(id))} ${saved?'saved to':'removed from'} your favorites.`:
  `${saved?'Saved':'Removed'} for this visit only. This browser cannot save favorites after you leave.`);
}
function showDialog(dialog){dialogOpeners.set(dialog,{element:document.activeElement,details:document.activeElement?.dataset.details});const status=$('[role="status"]',dialog);if(status)status.textContent='';dialog.showModal();updateFocusClearance();dialog.scrollTop=0;}
function openDetails(id){const e=entryMap.get(id);if(!e)return;const m=categoryMeta[e.category_id];$('#detail-content').innerHTML=`<div class="service-icon detail-icon">${icon(m.icon)}</div><p class="detail-category">${escape(m.name)}</p><h2 id="detail-title">${escape(e.title)}</h2><p class="detail-provider">${escape(e.agency)}</p><p class="detail-body">${escape(e.description)}</p><div class="detail-applicability"><strong>Good to know</strong>${escape(e.applicability)}</div><p class="detail-url">Official website<br><a href="${escape(e.official_url)}" target="_blank" rel="noopener noreferrer">${escape(new URL(e.official_url).hostname)} ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></p><div class="detail-actions"><a class="primary-button" href="${escape(e.official_url)}" target="_blank" rel="noopener noreferrer">Open website ${icon('external')}<span class="sr-only"> (new tab)</span></a>${favoriteButton(e)}</div><p class="detail-source">Reviewed October 28, 2026. ${e.verification_status==='official_link_verified'?'Destination confirmed through an official agency link; the full service was not tested.':'Public information reviewed; account and payment steps were not tested.'}<br><a href="${escape(e.source_url)}" target="_blank" rel="noopener noreferrer">View source ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></p>`;showDialog($('#detail-dialog'));}
function about(){$('#detail-content').innerHTML=`<div class="service-icon detail-icon">${icon('grid')}</div><p class="detail-category">A local starting point</p><h2 id="detail-title">Made for life in Mableton.</h2><p class="detail-body">MabletonLink brings together 89 researched service links from the city, Cobb County, schools, the state, and utility providers. It’s an independent prototype, not an official City of Mableton website.</p><div class="detail-applicability"><strong>Your favorites, your browser</strong>Favorites are saved on this device in this browser. There’s no MabletonLink account or single sign-on. Official services may have their own sign-in.</div><p class="detail-body">The assistant uses Google Gemini to suggest records from our approved Mableton service directory. It cannot act on your behalf or access accounts. When you send a question, your question and limited follow-up context go to Google for processing. MabletonLink does not store your questions; this conversation stays in page memory. Favorites stay in your browser. Do not send personal or sensitive details. The assistant is for adults age 18 and older.</p><p class="detail-source">Sources reviewed October 28, 2026: 79 public pages reviewed and 10 destinations confirmed through official agency links. Service details and availability can change.</p>`;showDialog($('#detail-dialog'));}
let assistantRequest = null;
let assistantTurn = 0;
let assistantContext = {previous_question: '', previous_service_ids: []};
function assistantBusy(busy) {
 $('#assistant-form button').disabled=busy;
 $$('.prompt-list button').forEach(button=>button.disabled=busy);
 $('#assistant-input').readOnly=busy;
 $('#assistant-form').setAttribute('aria-busy',String(busy));
}
function renderAssistantAnswer(answer, number) {
 const titles={match:'Suggested services',clarify:'One more detail',out_of_scope:'Help with Mableton services',not_found:'No clear match',emergency:'Emergency help',unavailable:'Use the service directory'};
 const services=answer.services.map(service=>entryMap.get(service.id)).filter(Boolean);
 $('#conversation').insertAdjacentHTML('beforeend',`<section class="chat-message assistant" aria-labelledby="reply-title-${number}"><h3 id="reply-title-${number}" tabindex="-1" aria-describedby="reply-text-${number}">${escape(titles[answer.status]||titles.unavailable)}</h3><p id="reply-text-${number}">${escape(answer.message)}</p>${services.map(e=>`<div class="assistant-service"><a class="chat-link" href="${escape(e.official_url)}" target="_blank" rel="noopener noreferrer">${icon(categoryMeta[e.category_id].icon)}<span>${escape(shortTitles[e.id]||e.title)}<small>${escape(e.agency)}</small><span class="sr-only"> (opens in a new tab)</span></span>${icon('arrow-up-right')}</a><p>${escape(e.description)}</p><p>${escape(e.applicability)}</p></div>`).join('')}${services.length?'<p class="chat-source-note">From the approved service directory · reviewed Oct 28, 2026</p>':''}${['unavailable','not_found','out_of_scope'].includes(answer.status)?'<button type="button" class="secondary-button" data-assistant-browse>Browse all services</button>':''}</section>`);
 const conversation=$('#conversation');
 while(conversation.children.length>12){conversation.firstElementChild.remove();conversation.firstElementChild.remove();}
 if($('#assistant-dialog').open)focusHeading(`#reply-title-${number}`);
}
async function askAssistant(question){
 if(assistantRequest)return;
 question=question.trim();
 const input=$('#assistant-input');
 if(!question||question.length>500){input.setAttribute('aria-invalid','true');$('#assistant-error').textContent='Please write a question of up to 500 characters, such as “How do I pay my water bill?”';input.focus();return;}
 input.removeAttribute('aria-invalid');$('#assistant-error').textContent='';
 $('#assistant-welcome').hidden=true;const conversation=$('#conversation');conversation.hidden=false;$('#reset-chat').hidden=false;
 const number=++replyNumber,turn=++assistantTurn;
 conversation.insertAdjacentHTML('beforeend',`<p class="chat-message user"><span class="sr-only">You asked: </span>${escape(question)}</p>`);
 input.value=question;
 const controller=new AbortController();assistantRequest=controller;assistantBusy(true);
 $('#assistant-status').textContent='Finding local services…';input.focus();
 const timer=setTimeout(()=>controller.abort(),16000);
 let answer;
 try {
  if(!['http:','https:'].includes(location.protocol))throw new Error('offline');
  const response=await fetch('/api/assistant',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({question,...assistantContext})});
  answer=await response.json();
  const statuses=['match','clarify','out_of_scope','not_found','emergency','unavailable'];
  if(!statuses.includes(answer.status)||typeof answer.message!=='string'||answer.message.length>1000||!Array.isArray(answer.services)||answer.services.length>3||answer.services.some(e=>!entryMap.has(e.id)))throw new Error('invalid_response');
  if(!response.ok&&answer.status!=='unavailable')throw new Error('failed_request');
 } catch {
  answer={status:'unavailable',message:'The assistant is unavailable right now. You can still use Search services or browse All services.',services:[]};
 } finally {clearTimeout(timer);}
 if(turn!==assistantTurn)return;
 assistantRequest=null;assistantBusy(false);$('#assistant-status').textContent='';
 if(answer.status!=='unavailable'){
  assistantContext=['match','clarify'].includes(answer.status)?{previous_question:question,previous_service_ids:answer.services.map(e=>e.id)}:{previous_question:'',previous_service_ids:[]};
  input.value='';
 }
 renderAssistantAnswer(answer,number);
}



$('#detail-dialog .dialog-close').addEventListener('click',()=>$('#detail-dialog').close());
$('#about-button').addEventListener('click',about);
$('.skip-link').addEventListener('click',event=>{event.preventDefault();$('#main').focus();$('#main').scrollIntoView();});
$$('[data-open-assistant]').forEach(button=>button.addEventListener('click',()=>showDialog($('#assistant-dialog'))));
$('#close-assistant').addEventListener('click',()=>$('#assistant-dialog').close());
$$('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{const opener=dialogOpeners.get(dialog);const original=opener?.element?.isConnected?opener.element:opener?.details?$(`[data-details="${opener.details}"]`):null;const target=original||$('#results-title')||$('#page-title')||$('#main');target?.focus({preventScroll:true});if(!original)target?.scrollIntoView({block:'start',behavior:'instant'});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
});
$('#reset-chat').addEventListener('click',()=>{assistantTurn++;assistantRequest?.abort();assistantRequest=null;assistantContext={previous_question:'',previous_service_ids:[]};assistantBusy(false);$('#assistant-input').value='';$('#conversation').innerHTML='';$('#conversation').hidden=true;$('#assistant-welcome').hidden=false;$('#reset-chat').hidden=true;$('#assistant-input').removeAttribute('aria-invalid');$('#assistant-error').textContent='';$('#assistant-status').textContent='Previous questions cleared. Write a new question below.';$('#assistant-input').focus();});
$('#assistant-form').addEventListener('submit',event=>{event.preventDefault();if(catalog)askAssistant($('#assistant-input').value);});
$('#assistant-input').addEventListener('input',()=>{$('#assistant-input').removeAttribute('aria-invalid');$('#assistant-error').textContent='';});
$('#search-form').addEventListener('submit',event=>{event.preventDefault();if(!catalog)return;navigate({view:state.view==='favorites'?'favorites':'all',query:$('#service-search').value.trim()},{replace:true});clearTimeout(resultsTimer);$('#results-announcement').textContent='';focusHeading('#results-title');});
$('#service-search').addEventListener('input',event=>{if(catalog)navigate({view:state.view==='favorites'?'favorites':'all',query:event.target.value.slice(0,200)},{replace:true});});
$('#clear-search').addEventListener('click',()=>{navigate({query:''},{replace:true});$('#service-search').focus();});
document.addEventListener('click',event=>{
 const button=event.target.closest('button,a');if(!button)return;
 if(button.id==='retry-directory'){init();return;}
 if(!catalog)return;
 if(button.dataset.favorite){toggleFavorite(button.dataset.favorite);return;}
 if(button.dataset.details){openDetails(button.dataset.details);return;}
 if(button.dataset.category){event.preventDefault();navigate({view:'all',category:button.dataset.category,query:''},{scroll:true});focusHeading();return;}
 if(button.hasAttribute('data-assistant-browse')){$('#assistant-dialog').close();navigate({view:'all',query:'',category:''},{scroll:true});setTimeout(()=>focusHeading(),0);return;}
 if(button.dataset.prompt){askAssistant(button.dataset.prompt);return;}
 if(button.dataset.search){navigate({view:'all',query:button.dataset.search,category:''});$('#service-search').focus();return;}
 if(button.hasAttribute('data-clear-filters')){navigate({query:'',category:''});$('#service-search').focus();return;}
 if(button.hasAttribute('data-browse')){navigate({view:'all',query:'',category:''},{scroll:true});$('#service-search').focus({preventScroll:true});return;}
 if(button.id==='load-more'){const previous=state.limit;navigate({limit:state.limit+18},{replace:true});const next=$$('.service-row .row-main a')[previous];next?.focus({preventScroll:true});next?.scrollIntoView({block:'start',behavior:'instant'});return;}
 if(button.tagName==='A'&&['#home','#all','#favorites','#categories'].includes(button.getAttribute('href'))){event.preventDefault();navigate({view:button.getAttribute('href').slice(1),query:'',category:''},{scroll:true});focusHeading();}
});
document.addEventListener('change',event=>{if(event.target.id==='category-filter'){navigate({category:event.target.value});$('#category-filter').focus({preventScroll:true});}});
window.addEventListener('hashchange',()=>{if(catalog){state=readHash();$('#service-search').value=state.query;render();focusHeading();}});
window.addEventListener('storage',event=>{if(event.key===storageKey&&catalog){const active=document.activeElement;const id=active?.dataset.favorite;favorites=getFavorites();render();if(id&&!active.isConnected){($(`[data-favorite="${id}"]`)||$('#results-title')||$('#page-title'))?.focus({preventScroll:true});}notify('Your favorites were updated in another tab.');}});
async function init(){
 const retry=document.activeElement?.id==='retry-directory';
 $$('#search-form input, #search-form button, [data-open-assistant]').forEach(el=>el.disabled=true);
 $('#directory-content').setAttribute('aria-busy','true');
 $('#directory-content').innerHTML='<div class="loading-state" role="status">Loading local services…</div>';$('#results-announcement').textContent='Loading local services…';
 try{const response=await fetch('./services.json');if(!response.ok)throw new Error('Directory could not be loaded');catalog=await response.json();entries=catalog.entries.filter(e=>/^https:\/\//.test(e.official_url));entryMap=new Map(entries.map(e=>[e.id,e]));favorites=getFavorites();state=readHash();if(state.query||state.category)state.view=state.view==='favorites'?'favorites':'all';$('#service-search').value=state.query;$('#assistant-input').disabled=false;$('#assistant-form button').disabled=false;$$('#search-form input, #search-form button, [data-open-assistant]').forEach(el=>el.disabled=false);$('#directory-content').removeAttribute('aria-busy');render();if(retry){focusHeading();notify('The service directory is ready.');}}
 catch(error){console.error(error);catalog=undefined;$('#directory-content').removeAttribute('aria-busy');$('#results-announcement').textContent='The directory could not load. Try again or open the official resident guide below.';$('#directory-content').innerHTML=`<div class="empty-state"><div class="empty-symbol">${icon('info')}</div><h2 id="directory-error" tabindex="-1">The directory couldn’t load.</h2><p>Try again, or visit the city’s official resident guide.</p><div class="error-actions"><button id="retry-directory" class="primary-button" type="button">Try again ${icon('refresh')}</button><a class="secondary-button" href="https://www.mableton.gov/1212/Resident-Resource-Guide" target="_blank" rel="noopener noreferrer">Open resident guide ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></div></div>`;$('#assistant-input').disabled=true;$('#assistant-form button').disabled=true;$$('[data-open-assistant]').forEach(button=>button.disabled=true);if(retry)focusHeading('#directory-error');}
}
init();
