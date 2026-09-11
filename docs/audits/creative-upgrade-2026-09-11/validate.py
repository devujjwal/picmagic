"""Validate Phase A planning data only. Does not run or modify the application."""
from pathlib import Path
import json,hashlib,collections,subprocess
D=Path(__file__).resolve().parent;R=D.parents[2]
read=lambda n:json.loads((D/n).read_text())
a=read('prompt-audit.json');c=read('collection-audit.json');p=read('proposals.json');s=read('shortlist.json');r=read('research.json');inv=read('inventory.json');assets=read('asset-review.json')
checks=[]
def check(name,ok):
 checks.append({'check':name,'passed':bool(ok)})
content=sum((json.loads((R/x).read_text()) for x in inv['input_sha256']),[])
ids={x['id'] for x in content};slugs={x['slug'] for x in content};auditids=[x['id'] for x in a];researchids={x['id'] for x in r}
check('162 source records, exactly one audit per unique ID',len(content)==len(a)==len(set(auditids))==162 and ids==set(auditids))
check('All 50 production IDs reconciled to audit', {x['id'] for x in read('production-public-snapshot.json')['prompts']} <= set(auditids))
check('Classification and score totals reconcile',sum(collections.Counter(x['classification'] for x in a).values())==162 and all(1<=x['distinctiveness_score']<=5 for x in a))
check('Every merge target exists and is not a merge source',all(x['merge_target_id'] in ids and next(y for y in a if y['id']==x['merge_target_id'])['classification']!='MERGE' for x in a if x['classification']=='MERGE'))
cols=sum((json.loads((R/x).read_text()) for x in ['content/collections.json','content/expansion/collections.json','content/additions/friends-trip-collections.json']),[])
check('All 39 collections reviewed exactly once',len(c)==len({x['id'] for x in c})==39 and {x['id'] for x in c}=={x['id'] for x in cols})
check('Collection memberships and proposed leads resolve',all(set(x['prompt_ids'])<=ids for x in cols) and all(y['slug'] in slugs for x in c for y in x['top_concepts']))
check('20 proposal IDs and slugs unique',len(p)==len({x['id'] for x in p})==len({x['slug'] for x in p})==20)
check('New proposal slugs avoid current library; intentional reuse explicitly declared',all((x['slug'] not in slugs) if not x['existing_prompt_slug'] else x['slug']==x['existing_prompt_slug'] and x['slug'] in slugs for x in p))
check('New creative-transformations collection slug has no collision','creative-transformations' not in {x['slug'] for x in cols})
fields=['references','preserve','transform','preview_brief','why_ai','originality','risks','reuse','reel_potential','detail_url_proposal','destinations','transformation_type']
check('Every proposal contains required substantive fields',all(all(x.get(k) for k in fields) for x in p))
check('12 ranked previews, 10 new outputs, 2 reuses, all 4–5',len(s)==12 and sorted(x['rank'] for x in s)==list(range(1,13)) and sum(x['action']=='new-output-required' for x in s)==10 and all(x['score']>=4 for x in s))
check('At least six first-batch mechanisms',len({x['mechanism'] for x in s})>=6)
check('Retained shortlist assets exist and were full-resolution inspected',all((R/'public'/x['existing_path'].lstrip('/')).exists() and any(y['path']==x['existing_path'] and y['full_resolution_inspected'] for y in assets) for x in s if x['action']=='retain-existing-recommended'))
check('All proposals and records link evidence',all(set(x['evidence'])<=researchids and bool(x['supporting_evidence']) for x in p) and all(bool(x['evidence']) for x in a+c))
check('18 complete source pairs with access limits explicit',sum(x['full_prompt_inspected'] and x['image_result_inspected'] for x in r)==18 and len(r)==20 and all(x['url'] and x['inspected_on'] and x['access'] for x in r))
check('86 actual asset files accounted for',len(assets)==86 and len({x['path'] for x in assets})==86 and all((R/'public'/x['path'].lstrip('/')).exists() for x in assets))
check('Input content hashes unchanged since Phase A inventory',all(hashlib.sha256((R/f).read_bytes()).hexdigest()==sha for f,sha in inv['input_sha256'].items()))
check('No generation approval implied by shortlist',all(x['generation_approved'] is False for x in s) and all(x['generation_status']=='not-approved; no submissions' for x in p))
status=subprocess.check_output(['git','status','--porcelain'],cwd=R,text=True).splitlines();filterstatus=lambda rows:{x for x in rows if 'docs/audits/creative-upgrade-2026-09-11' not in x}
check('No new changed-path status outside this review directory',filterstatus(status)==filterstatus(inv['baseline_git_status']))
# Cross-referenced planning markdown files are present.
check('Durable required documents exist',all((D/f).exists() for f in ['README.md','research.md','complete-audit.md','proposals.md','shortlist.md','generator-review.md','homepage-and-architecture.md','handoff.md']))
result={'date':'2026-09-11','scope':'Research/planning validation only; no application test or generation claim','passed':all(x['passed'] for x in checks),'checks':checks,'totals':{'concepts':len(a),'collections':len(c),'proposals':len(p),'shortlist':len(s),'classifications':dict(collections.Counter(x['classification'] for x in a)),'score_distribution':{str(i):sum(x['distinctiveness_score']==i for x in a) for i in range(1,6)}}}
(D/'validation.json').write_text(json.dumps(result,indent=2)+'\n')
for x in checks:print(('PASS' if x['passed'] else 'FAIL')+' '+x['check'])
raise SystemExit(0 if result['passed'] else 1)
