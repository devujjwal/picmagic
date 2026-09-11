from pathlib import Path
import json,hashlib
from PIL import Image
root=Path(__file__).parent
m=json.loads((root/'manifest.json').read_text());c=json.loads((root/'copyable-prompts.json').read_text());s=json.loads((root.parent/'creative-upgrade-2026-09-11/shortlist.json').read_text())
checks=[]
def check(name,ok):
 checks.append({'check':name,'passed':bool(ok)})
check('Exactly the approved twelve selections; no reserve concepts generated',len(m)==12 and {x['id'] for x in m}=={x['id'] for x in s})
check('Ten generated final outputs, two retained assets',sum(x['status']=='generated-reviewed-staged' for x in m)==10 and sum(x['status']=='retained-reviewed' for x in m)==2)
check('All copyable prompt records present exactly once',len(c)==12 and {x['id'] for x in c}=={x['id'] for x in m})
check('Unique proposed canonical paths',len({x['canonical_path'] for x in c})==12)
for x in m:
 im=Image.open(root/x['optimized_path']);a,b=map(int,x['ratio'].split(':'))
 check(x['id']+' optimized WebP dimensions/aspect',im.format=='WEBP' and list(im.size)==x['actual_dimensions'] and abs(im.width/im.height-a/b)<.001)
 check(x['id']+' QA and alt text recorded',bool(x['qa'] and x['image_alt']))
 if x['id'].startswith('P'):
  src=root/x['downloaded_source'];orig=Image.open(src)
  check(x['id']+' saved original verified',hashlib.sha256(src.read_bytes()).hexdigest()==x['source_sha256'] and list(orig.size)==x['source_dimensions'])
  check(x['id']+' exact prompt and references captured',bool(x['submitted_prompts']) and all((root/p).exists() for p in x['source_reference']))
  check(x['id']+' no upscaling',im.width<=orig.width and im.height<=orig.height)
  check(x['id']+' thumbnail exists and stays under 120 KiB',(root/x['thumbnail_path']).exists() and x['thumbnail_bytes']<120*1024)
  text=next(p for p in c if p['id']==x['id'])['prompt_text']
  check(x['id']+' preview and user instructions stored separately',text!=x['image_prompt'])
  if x['id']!='P17':check(x['id']+' reference authority and India-first no-reference mode','REFERENCE PRESENT:' in text and 'NO REFERENCE PRESENT:' in text and 'Indian/South Asian' in text)
 else:
  check(x['id']+' retained original unchanged',hashlib.sha256(Path('public'+x['existing_path']).read_bytes()).hexdigest()==x['source_sha256'])
check('Fifteen submitted briefs = ten final outputs plus four fixtures and one trial',len(json.loads((root/'submitted-prompts.json').read_text()))==15)
# The current batch only produced staged media/planning files, not content activation.
check('No production activation claimed',all(not x['production_activated'] for x in m))
old=json.loads((root.parent/'creative-upgrade-2026-09-11/inventory.json').read_text())
existing={p['slug']:p for f in ['content/prompts.json','content/expansion/prompts.json','content/additions/friends-trip-prompts.json'] for p in json.loads(Path(f).read_text())}
check('Eight new slugs do not collide',all(p['slug'] not in existing for p in c if p['action']=='new-record'))
check('Two replacements preserve existing canonical owners',all(p['slug'] in existing for p in c if p['action']=='update-existing-id'))
check('Correct retained copy not rewritten',all(p['prompt_text']==existing[p['slug']]['prompt_text'] for p in c if p['action']=='retain-copy-unchanged'))
result={'scope':'Approved twelve-preview media batch only; not application/release acceptance','checks':checks,'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']], 'application_tests':'Not run in this media-only batch. Prior application checks remain historical.','production_deployment':'None'}
(root/'validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(result['passed'],'/',len(checks),'checks passed')
if result['failed']:print(result['failed']);raise SystemExit(1)
