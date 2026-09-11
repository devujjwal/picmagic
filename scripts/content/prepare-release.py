"""Prepare the reviewed SQL transaction locally. Does not connect or deploy."""
import json, hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
read=lambda p:json.loads((root/p).read_text())
backup=read('.release-private/production-before.json')
ps=sum([read(p) for p in ['content/prompts.json','content/expansion/prompts.json','content/additions/friends-trip-prompts.json','content/additions/creative-prompts.json']],[])
cs=sum([read(p) for p in ['content/collections.json','content/expansion/collections.json','content/additions/friends-trip-collections.json','content/additions/creative-collections.json']],[])
categories=read('content/categories.json')
def literal(value):
 s=json.dumps(value,ensure_ascii=False,separators=(',',':'));assert '$picmagic$' not in s
 return '$picmagic$'+s+'$picmagic$'
def upsert(table,rows):
 cols=sorted(set().union(*(r.keys() for r in rows)) - {'canonical_path','prompt_ids'})
 # Columns are code-controlled schema names, never externally supplied SQL.
 assert all(c.replace('_','').isalnum() for c in cols)
 quoted=','.join('"'+c+'"' for c in cols)
 updates=','.join('"'+c+'"=excluded."'+c+'"' for c in cols if c not in ['id','created_at','published_at'])
 if table=='prompts': updates+=',published_at=coalesce(public.prompts.published_at,excluded.published_at)'
 return f'insert into public.{table}({quoted}) select {quoted} from json_populate_recordset(null::public.{table},{literal(rows)}::json) on conflict(id) do update set {updates};\n'
sql='begin;\nset local lock_timeout=\'5s\';\n'
# Changes since the backup abort instead of silently overwriting an editor.
for table in ['prompts','collections','categories']:
 for row in backup[table]:
  sql+=f"do $guard$ begin if not exists(select 1 from public.{table} t where t.id::text={literal(row['id'])}::json#>>'{{}}' and to_jsonb(t) @> {literal(row)}::jsonb) then raise exception 'Concurrent editorial change; take a new backup and reconcile'; end if; end $guard$;\n"
for name in ['202609100003_persona_and_video.sql','202609100004_editorial_quality.sql','202609100005_friends_trip_template.sql','202609110001_creative_contract.sql']:
 sql+=(root/'supabase/migrations'/name).read_text()+'\n'
sql+=upsert('categories',categories)+upsert('prompts',ps)
sql+=upsert('collections',[{k:v for k,v in c.items() if k!='prompt_ids'} for c in cs])
for c in cs:
 sql+=f"delete from public.collection_prompts where collection_id={literal(c['id'])}::json#>>'{{}}';\n"
 for pid in c['prompt_ids']:sql+=f"insert into public.collection_prompts(collection_id,prompt_id) values({literal(c['id'])}::json#>>'{{}}',({literal(pid)}::json#>>'{{}}')::uuid);\n"
sql+="notify pgrst, 'reload schema';\ncommit;\n"
out=root/'.release-private/release.sql';out.write_text(sql);out.chmod(0o600)
print(f'Prepared atomic transaction: {len(ps)} prompts, {len(cs)} collections; optimistic checks protect existing editorial records. Not applied.')
