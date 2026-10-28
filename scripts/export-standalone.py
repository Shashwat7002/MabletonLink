"""Export all directory and guidance data as one offline-capable prototype."""
from pathlib import Path
import base64,json,re
root=Path(__file__).resolve().parents[1];assets=root/'public'
html=(assets/'index.html').read_text();js=(assets/'app.js').read_text()
js=re.sub(r'^import .*?;\n','',js,flags=re.M)
modules='\n'.join((assets/name).read_text().replace('export ','') for name in ['icons.mjs','i18n.mjs','routing.mjs'])
data={name:json.loads((assets/name).read_text()) for name in ['services.json','services.es.json','guidance.json']}
start=js.index("await Promise.all(['services.json'");end=js.index(';[directory,spanish,guidance]=loaded',start)
js=js[:start]+"['services.json','services.es.json','guidance.json'].map(name=>JSON.parse(document.getElementById('embedded-directory').textContent)[name])"+js[end:]
html=html.replace('<link rel="stylesheet" href="./styles.css">','<style>'+(assets/'styles.css').read_text()+'</style>').replace('<script type="module" src="./app.js"></script>','')
payload=json.dumps(data,ensure_ascii=False).replace('</','<\\/')
html=html.replace('</body>',f'<script id="embedded-directory" type="application/json">{payload}</script><script type="module">{modules}\n{js}</script></body>')
html=html.replace('href="./favicon.svg"','href="data:image/svg+xml;base64,'+base64.b64encode((assets/'favicon.svg').read_bytes()).decode()+'"')
out=root/'artifacts'/'mabletonlink-prototype.html';out.parent.mkdir(exist_ok=True);out.write_text(html)
print(out)
