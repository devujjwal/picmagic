"""Validate planning documents only; does not run or mutate the application."""
import json, hashlib
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
load=lambda p:json.loads(p.read_text())
ps=sum([load(ROOT/f) for f in ['content/prompts.json','content/expansion/prompts.json','content/additions/creative-prompts.json','content/additions/friends-trip-prompts.json']],[])
by_slug={p['slug']:p for p in ps}
proposals=load(OUT/'proposals.json'); manifest=load(OUT/'generation-manifest.json'); research=load(OUT/'research-reused.json')
checks=[]
def check(name,value):
 assert value,name
 checks.append(name)
check('10 unique proposal keys, IDs, slugs and canonical paths',len(proposals)==10 and all(len({p[k] for p in proposals})==10 for k in ['key','id','slug','canonical']))
check('5 posts and 5 profiles',Counter(p['kind'] for p in proposals)=={'Instagram Post':5,'Profile Picture':5})
check('3 existing reuses, 1 draft rework, 6 new proposals',Counter(p['action'] for p in proposals)=={'reuse-existing-approved':3,'rework-existing-draft':1,'new-proposal':6})
check('7 future assets, 3 retained assets',sum(not p['reuse_asset'] for p in proposals)==7)
check('12 historical image/full-prompt evidence records',len(research)==12 and all(r['image_result_inspected'] and r['full_prompt_inspected'] and r['inspected_on']=='2026-09-11' for r in research))
evidence={r['id'] for r in research}
for p,m in zip(proposals,manifest):
 key=p['key']
 check(key+' complete brief and evidence',all(p[k] for k in ['user_prompt','preview_prompt','why_ai','why_user','risk','originality','collections','related']) and set(p['source_evidence'])<=evidence)
 check(key+' score and authorization',p['score'] in (4,5) and p['generation_authorized'] is False and m['generation_authorized'] is False)
 check(key+' exact manifest and prompt checksum',p['preview_prompt']==m['exact_generation_prompt'] and p['id']==m['id'] and p['prompt_sha256']==hashlib.sha256(p['user_prompt'].encode()).hexdigest())
 check(key+' ratio and dimensions',p['dimensions'][0]/p['dimensions'][1]==(1 if p['kind']=='Profile Picture' else .8))
 check(key+' reference and default separated','REFERENCE' in p['user_prompt'] and 'NO REFERENCE PRESENT:' in p['user_prompt'] and 'fictional' in p['user_prompt'])
 check(key+' related records exist',all(s in by_slug and s!=p['slug'] for s in p['related']))
 check(key+' fixtures exist',all((ROOT/f).is_file() for f in p['required_reference_assets']))
 if p['action']=='new-proposal':check(key+' no existing slug/ID collision',p['slug'] not in by_slug and p['id'] not in {r['id'] for r in ps})
 else:
  src=by_slug[p['slug']]
  check(key+' preserves canonical owner',src['id']==p['id'] and p['canonical']=='/ai-prompts/'+src['category_id']+'/'+src['slug'])
  if p['action']=='reuse-existing-approved':
   check(key+' existing prompt and brief unchanged',src['prompt_text']==p['user_prompt'] and src['image_brief']==p['preview_prompt'])
   check(key+' retained asset exists',p['reuse_asset']==src['preview_image_url'] and (ROOT/'public'/p['reuse_asset'].lstrip('/')).is_file())
  else:check(key+' rework is an existing draft',src['is_published'] is False)
 if p['kind']=='Profile Picture':check(key+' circle targets and correct collection',all(t in p['user_prompt'] for t in ['40, 64 and 128','circular','1024 × 1024']) and p['collections']==['instagram-profile-picture'])
check('No generated assets pretended complete',all('not-generated' in p['qa_status'] for p in proposals if not p['reuse_asset']))
report={'checked_on':'2026-09-15','scope':'planning integrity only; not application or actual media QA','result':'PASS','check_count':len(checks),'checks':checks,'scores':dict(Counter(str(p['score']) for p in proposals)),'new_previews_pending':7,'application_tests':'not run: approval checkpoint, no application changes','media_qa':'new assets not generated; circle/feed previews pending'}
(OUT/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
