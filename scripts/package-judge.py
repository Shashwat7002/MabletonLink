"""Package the committed source and generated standalone demo without local secrets."""
from pathlib import Path
import hashlib,io,re,subprocess,tarfile,zipfile
root=Path(__file__).resolve().parents[1]
rev=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
# Runtime source must match the committed version; post-deployment evidence may be local.
for name in ['public','server','app','scripts/export-standalone.py']:
    if subprocess.check_output(['git','diff','HEAD','--',name],cwd=root):
        raise SystemExit('Commit application changes before packaging')
subprocess.run(['python3',str(root/'scripts/export-standalone.py')],check=True,cwd=root)
files={'START-HERE.md':(root/'docs/JUDGE-START-HERE.md').read_bytes(),'mabletonlink.html':(root/'artifacts/mabletonlink-prototype.html').read_bytes(),'SOURCE-REVISION.txt':(rev+'\n').encode()}
archive=subprocess.check_output(['git','archive','--format=tar',rev],cwd=root)
with tarfile.open(fileobj=io.BytesIO(archive)) as source:
    for member in source.getmembers():
        if not member.isfile():continue
        name=member.name
        if any(x in Path(name).parts for x in ['.git','node_modules','.wrangler','.sites-runtime','.unlazy','artifacts']):raise SystemExit('Unexpected local state in source: '+name)
        if (Path(name).name.startswith(('.env','.dev.vars')) and Path(name).name!='.env.example'):raise SystemExit('Unexpected secret file: '+name)
        content=source.extractfile(member).read()
        if re.search(rb'\bAIza[0-9A-Za-z_-]{35}\b|\bAQ\.[0-9A-Za-z_-]{30,}',content):raise SystemExit('Potential credential in '+name)
        files['source/'+name]=content
for name in ['spanish-missed-pickup-plan.pdf','deadline-spanish-plan.png','deadline-no-ai.png']:
    p=root/'artifacts'/name
    if p.exists():files['demo/'+name]=p.read_bytes()
release=root/'artifacts/deadline-release.json'
if release.exists():files['RELEASE-CHECKS.json']=release.read_bytes()
manifest=''.join(f'{hashlib.sha256(content).hexdigest()}  {name}\n' for name,content in sorted(files.items()))
files['MANIFEST.sha256']=manifest.encode()
out=root/'artifacts'/'MabletonLink-judge.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for name,content in files.items():z.writestr('MabletonLink-judge/'+name,content)
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    for name,content in files.items():assert z.read('MabletonLink-judge/'+name)==content
print({'archive':str(out),'source':rev,'files':len(files),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()})
