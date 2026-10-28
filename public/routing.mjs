// Conservative, local navigation. This is not a generative answer or a live eligibility check.
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function routeQuestion(question) {
 const q=normalize(question);
 if (/\b(can t breathe|cannot breathe|gas leak|immediate danger|house is on fire|no puedo respirar|fuga de gas|peligro inmediato|casa se esta quemando|casa en llamas)\b/.test(q)) return {status:'emergency',service_ids:[]};
 if (/\b\d{3}[ -]?\d{2}[ -]?\d{4}\b/.test(question)||/\b(password|contrasena|social security number|numero de seguro social|credit card number)\b/.test(q)) return {status:'sensitive',service_ids:[]};
 if (/\b(ignore (all|previous)|system prompt|reveal.*key|ignora.*instrucciones|write.*(code|poem)|write python|weather in paris|new york|miami|los angeles)\b/.test(q)) return {status:'out_of_scope',service_ids:[]};
 if (/\b(atlanta|marietta|savannah)\b/.test(q) && !/\b(mableton|cobblinc|bus|transit|autobus)\b/.test(q)) return {status:'out_of_scope',service_ids:[]};
 const journey=(id)=>({status:'journey',journey:id,service_ids:[]});
 if (/\b(computer|internet|wifi|wi fi|print|printing|scan|scanning|computadora|imprimir|impresion|escanear|no hablo ingles|interprete|sin internet|language help)\b/.test(q)) return journey('access');
 if (/\b(dump|dumped|dumping|illegal waste|code violation|basura abandonada|basura tirada|escombros|pothole|bache|unsafe housing|mold|moho)\b/.test(q)) return journey('dumping');
 if (/\b(trash|garbage|hauler|pickup|basura|recoleccion|sofa|furniture|muebles)\b/.test(q)) return journey('trash');
 if (/\b(rent|rental|housing|eviction|food|snap|benefits|liheap|help.*(energy|electric).*bill|alquiler|renta|vivienda|desalojo|comida|alimentos|ayuda.*(energia|luz)|pagar.*alquiler)\b/.test(q)) return journey('housing');
 if (/\b(bus|transit|transport|transportation|cobblinc|paratransit|wheelchair|autobus|transporte|paratransito|silla de ruedas)\b/.test(q) && !/\b(school|escolar)\b/.test(q)) return journey('transport');
 const matches=[
 [/\b(water|agua)\b/,'pay-a-water-bill',/\b(bill|pay|pagar|factura)\b/],
 [/\b(water|agua)\b/,'start-stop-or-transfer-water-service',/\b(start|stop|transfer|iniciar|suspender|transferir)\b/],
 [/\b(school|escolar)\b/,'school-bus-route-finder',/\b(bus|autobus)\b/],
 [/\b(library|biblioteca)\b/,'library-card-and-account-help',/\b(card|tarjeta)\b/],
 [/\b(south cobb (regional )?library|biblioteca (regional )?(de )?south cobb)\b/,'south-cobb-regional-library',/\b(open|hours|abierta|abierto|horario|horarios)\b/],
 [/\b(property tax(?:es)?|impuestos.*propiedad)\b/,'county-property-taxes'],
 [/\b(city limits|district|limites.*ciudad|distrito)\b/,'check-city-limits-and-council-district'],
 [/\b(voter|voting|votar|votacion)\b/,'cobb-voting-information'],
 [/\b(building permit|permiso.*construccion)\b/,'building-permits-and-requirements'],
 [/\b(senior|personas mayores)\b/,'senior-services'],
 ];
 for(const [pattern,id,extra] of matches) if(pattern.test(q)&&(!extra||extra.test(q)))return {status:'match',service_ids:[id]};
 if (/\b(bill|pay|payment|factura|pagar|court|tribunal|electric|electricidad|gas|help|ayuda)\b/.test(q))return {status:'clarify',clarification_id:'service_type',service_ids:[]};
 return {status:'not_found',service_ids:[]};
}
const groups=[['trash','garbage','basura','recoleccion','hauler'],['water','agua'],['bill','factura','payment','pay','pagar','pago'],['school','escolar','escuela'],['bus','autobus'],['housing','rental','rent','vivienda','alquiler','renta'],['computer','computadora','internet','wifi'],['print','printing','imprimir','impresion'],['scan','scanning','escanear','escaneo'],['job','jobs','empleo','trabajo'],['license','licencia'],['tax','taxes','impuesto','impuestos'],['senior','mayores'],['food','comida','alimentos'],['vote','voting','votar','votacion'],['permit','permiso'],['library','biblioteca']];
const stop=new Set('i my me the a an to for of and need want how can do is with help please find mi mis el la los las un una de del para por y necesito quiero como puedo ayuda donde con'.split(' '));
export function searchServices(question,entries,translations={}) {
 const terms=normalize(question).split(' ').filter(t=>t&&!stop.has(t));if(!terms.length)return question.trim()?[]:entries;
 return entries.map(e=>{const es=translations[e.id]||{};const title=normalize(e.title+' '+(es.title||''));const extra=e.id==='south-cobb-regional-library'?'computer computadora internet wifi printing imprimir scanning escanear':'';const text=normalize([title,e.description,es.description,e.agency,extra].join(' '));let score=0,matched=0;
 for(const term of terms){const vs=groups.find(g=>g.includes(term))||[term];if(vs.some(v=>text.split(' ').some(w=>w===v||(v.length>4&&w.startsWith(v))))){matched++;score+=vs.some(v=>title.includes(v))?6:1;}}
 return {e,score,matched};}).filter(r=>r.matched===terms.length).sort((a,b)=>b.score-a.score||a.e.title.localeCompare(b.e.title)).map(r=>r.e);
}
