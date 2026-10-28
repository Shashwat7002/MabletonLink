"""Export the static prototype as one offline HTML file."""
from pathlib import Path
import base64
import json
root=Path(__file__).resolve().parents[1]
assets=root/'dist'
html=(assets/'index.html').read_text()
css=(assets/'styles.css').read_text()
js=(assets/'app.js').read_text()
data=json.dumps(json.loads((assets/'services.json').read_text()),ensure_ascii=False).replace('</','<\\/')
js=js.replace("const response=await fetch('./services.json');if(!response.ok)throw new Error('Directory could not be loaded');catalog=await response.json();", "catalog=JSON.parse(document.getElementById('embedded-directory').textContent);")
html=html.replace('<link rel="stylesheet" href="./styles.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="./app.js"></script>',f'<script id="embedded-directory" type="application/json">{data}</script><script defer>{js}</script>')
# Inline app script must run after the body exists, just as the deferred external script does.
start=html.index('<script id="embedded-directory"')
end=html.index('</script>',html.index('<script defer>',start))+len('</script>')
scripts=html[start:end].replace('<script defer>','<script>')
html=html[:start]+html[end:]
html=html.replace('</body>',scripts+'\n</body>')
favicon=base64.b64encode((assets/'favicon.svg').read_bytes()).decode()
html=html.replace('href="./favicon.svg"',f'href="data:image/svg+xml;base64,{favicon}"')
assert './app.js' not in html and './styles.css' not in html
out=root.parent/'mabletonlink-prototype.html'
out.write_text(html)
print(out)
