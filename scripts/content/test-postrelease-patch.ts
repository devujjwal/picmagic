/** Socket-only, newly initialized disposable PostgreSQL. Never reads credentials. */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
const root = mkdtempSync(join(tmpdir(), "picmagic-postrelease-sql-"));
const data = join(root, "db");
const dir="docs/audits/postrelease-fixes-2026-10-05";
const revisions=JSON.parse(readFileSync(`${dir}/database-patch.json`,"utf8"));
const literal=(v: unknown)=>`'${JSON.stringify(v).replaceAll("'","''")}'::jsonb`;
const run=(cmd: string,args: string[],input?: string)=>execFileSync(cmd,args,{encoding:"utf8",input,stdio:["pipe","pipe","pipe"]});
const sql=(text: string)=>run("psql",["-X","-v","ON_ERROR_STOP=1","-h",root,"-p","55451","-d","postgres","-At"],text);
let started=false;
try {
 run("initdb",["-D",data,"--auth=trust","--no-locale","--encoding=UTF8"]);
 run("pg_ctl",["-D",data,"-l",join(root,"postgres.log"),"-o",`-k ${root} -h '' -p 55451`,"-w","start"]); started=true;
 sql(`create table public.prompts (id uuid primary key, slug text, category_id text, prompt_type text, is_published boolean, is_indexable boolean, preview_review_status text, preview_image_url text, thumbnail_url text, published_at timestamptz, updated_at timestamptz, framing text, camera text, prompt_text text);
 create table public.collection_prompts (collection_id text, prompt_id uuid);`);
 const seed=()=>{
 sql("truncate public.prompts,public.collection_prompts;");
 for(const r of revisions) sql(`insert into public.prompts select * from jsonb_populate_record(null::public.prompts,${literal({id:r.id,...r.guard,...r.before})});`);
 sql("insert into public.prompts(id,slug,is_published,is_indexable) values ('00000000-0000-4000-8000-000000000095','untouched-draft',false,false); insert into public.collection_prompts values ('untouched','00000000-0000-4000-8000-000000000095');");
 };
 const snapshot=()=>sql("select jsonb_agg(to_jsonb(p) order by id) from public.prompts p; select jsonb_agg(to_jsonb(c)) from public.collection_prompts c;");
 const forward=readFileSync(`${dir}/database-forward.sql`,"utf8");
 const rollback=readFileSync(`${dir}/database-rollback.sql`,"utf8");
 const apply=forward.replace(/rollback;\s*$/,"commit;");
 seed(); const before=snapshot(); sql(forward); assert.equal(snapshot(),before,"preview rolls back");
 sql(apply);
 for(const r of revisions) {
   const value=JSON.parse(sql(`select to_jsonb(p) from public.prompts p where id='${r.id}';`).trim());
   for(const k of Object.keys(r.after)) assert.equal(value[k],r.after[k]);
 }
 assert.equal(sql("select not is_published and not is_indexable from public.prompts where slug='untouched-draft';").trim(),"t");
 sql(rollback.replace(/rollback;\s*$/,"commit;"));
 for(const r of revisions){
   const value=JSON.parse(sql(`select to_jsonb(p) from public.prompts p where id='${r.id}';`).trim());
   for(const k of Object.keys(r.before)) assert.equal(value[k],r.before[k]);
 }
 seed(); const last=revisions.at(-1);
 sql(`update public.prompts set prompt_text='Concurrent edit' where id='${last.id}';`);
 const conflict=snapshot(); assert.throws(()=>sql(apply)); assert.equal(snapshot(),conflict,"late conflict rolls back earlier update");
 seed(); sql(`update public.prompts set is_indexable=false where id='${revisions[0].id}';`);
 const flags=snapshot(); assert.throws(()=>sql(apply)); assert.equal(snapshot(),flags,"protected conflict preserves all rows");
 seed(); sql(apply); const once=snapshot(); assert.throws(()=>sql(apply)); assert.equal(snapshot(),once,"repeat application rejects stale baseline");
 sql(`update public.prompts set camera='Later camera edit' where id='${revisions[0].id}';`);
 const later=snapshot(); assert.throws(()=>sql(rollback.replace(/rollback;\s*$/,"commit;"))); assert.equal(snapshot(),later,"rollback rejects concurrent change");
 console.log("PASS: preview rollback, two exact row updates, verification, guarded rollback, untouched draft/membership, late-conflict atomicity, protected flag rejection, repeat apply rejection, rollback conflict rejection. Disposable socket-only database; no production connection.");
} finally {if(started)run("pg_ctl",["-D",data,"-m","fast","-w","stop"]);rmSync(root,{recursive:true,force:true});}
