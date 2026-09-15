"""Prepare a narrow, optimistic September 15 transaction; no network or writes to a database."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
read=lambda p:json.loads((root/p).read_text())
scope=read('docs/releases/2026-09-15/scope.json')
backup=read('.release-private/release-2026-09-15/production-before.json')
new=sum([read('content/additions/'+name+'-prompts.json') for name in ['social','gen-z','reference-impact','double-exposure-fashion','katana-streetwear','giant-playlist']],[])
assert {p['id'] for p in new}==set(scope['new_prompt_ids'])
cs=sum([read(p) for p in ['content/collections.json','content/expansion/collections.json','content/additions/friends-trip-collections.json','content/additions/creative-collections.json']],[])
oldcols={c['id']:c for c in backup['collections']}
def lit(x):
 s=json.dumps(x,ensure_ascii=False,separators=(',',':'));assert '$pm$' not in s;return '$pm$'+s+'$pm$'
def insert(table,rows,upsert=False):
 if not rows:return ''
 cols=sorted(set().union(*(r.keys() for r in rows))-{'canonical_path','prompt_ids','preview_video_url','poster_image_url','video_width','video_height','video_duration','video_format'})
 assert all(c.replace('_','').isalnum() for c in cols)
 names=','.join('"'+c+'"' for c in cols)
 suffix=(' on conflict(id) do update set '+','.join('"'+c+'"=excluded."'+c+'"' for c in cols if c!='id')) if upsert else ''
 return f'insert into public.{table}({names}) select {names} from json_populate_recordset(null::public.{table},{lit(rows)}::json){suffix};\n'
changed=[];joins=[]
for c in cs:
 before=oldcols[c['id']]; row={k:v for k,v in c.items() if k!='prompt_ids'}
 if any(before.get(k)!=v for k,v in row.items()):changed.append((before,row))
 oldids={j['prompt_id'] for j in backup['collection_prompts'] if j['collection_id']==c['id']}
 # Only add approved new memberships. Existing membership removals are out of scope.
 for i in set(c['prompt_ids'])-oldids:
  assert i in scope['new_prompt_ids'],(c['slug'],i)
  joins.append({'collection_id':c['id'],'prompt_id':i})
sql="begin;\nset local lock_timeout='5s';\nlock table public.prompts, public.collections, public.collection_prompts in share row exclusive mode;\n"
sql+=f"do $guard$ begin if exists(select 1 from public.prompts where id in (select (x->>'id')::uuid from jsonb_array_elements({lit(new)}::jsonb) x) or slug in (select x->>'slug' from jsonb_array_elements({lit(new)}::jsonb) x)) then raise exception 'New release IDs or slugs already exist; reconcile before retry'; end if; end $guard$;\n"
for before,after in changed:
 sql+=f"do $guard$ begin if not exists(select 1 from public.collections t where t.id=({lit(before['id'])}::json#>>'{{}}') and to_jsonb(t) @> {lit(before)}::jsonb) then raise exception 'Concurrent collection edit; abort release'; end if; end $guard$;\n"
sql+=insert('prompts',new)
for before,after in changed:sql+=insert('collections',[after],True)
sql+=insert('collection_prompts',joins)+"commit;\n"
out=root/'.release-private/release-2026-09-15';(out/'release.sql').write_text(sql);(out/'release.sql').chmod(0o600)
# Local rehearsal restores the backup only inside the same rolled-back transaction.
setup='begin;\n'+insert('categories',backup['categories'],True)+insert('prompts',backup['prompts'],True)+insert('collections',backup['collections'],True)
# Local-only pending release records may exist after an interrupted rehearsal; abort instead of deleting.
(out/'rehearsal.sql').write_text(setup+sql.removeprefix('begin;\n').removesuffix('commit;\n')+'rollback;\n')
(root/'docs/releases/2026-09-15/database-plan.json').write_text(json.dumps({'new_prompts':len(new),'new_memberships':len(joins),'collection_metadata_updates':[a['slug'] for b,a in changed],'existing_prompts_modified':0,'migrations_required':False,'optimistic_guards':True,'backup':str(out.relative_to(root) / 'production-before.json')},indent=2)+'\n')
print(f'Prepared {len(new)} inserts, {len(joins)} new memberships and {len(changed)} collection metadata updates. No database mutation.')
