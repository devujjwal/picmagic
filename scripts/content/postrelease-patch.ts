/** Generates reviewable SQL files only. No connection or apply mode. */
import { readFileSync, writeFileSync } from "node:fs";
const root = "docs/audits/postrelease-fixes-2026-10-05";
type Revision = { table: string; id: string; guard: Record<string, unknown>; before: Record<string, unknown>; after: Record<string, unknown> };
const revisions: Revision[] = JSON.parse(readFileSync(`${root}/database-patch.json`, "utf8"));
const json = (v: unknown) => `'${JSON.stringify(v).replaceAll("'", "''")}'::jsonb`;
const sql = (rollback = false) => {
  const blocks = revisions.map((r, i) => {
    if(r.table !== "prompts" || !/^[a-f0-9-]{36}$/.test(r.id) || !Object.keys(r.after).every(k => ["framing","camera","prompt_text"].includes(k))) throw new Error("Patch exceeds reviewed scope");
    const expected = rollback ? r.after : r.before;
    const next = rollback ? r.before : r.after;
    // Rollback doesn't guess a future updated_at. Every changed field still must
    // equal the reviewed after value; preserve unrelated subsequent fields.
    const guard = rollback ? Object.fromEntries(Object.entries(r.guard).filter(([k]) => k !== "updated_at")) : r.guard;
    return `do $fix_${i}$
declare live public.prompts; expected public.prompts; desired public.prompts; guard_row public.prompts; key text; affected integer;
begin
  select * into strict live from public.prompts where id = '${r.id}' for update;
  expected := jsonb_populate_record(null::public.prompts, ${json(expected)});
  desired := jsonb_populate_record(null::public.prompts, ${json(next)});
  guard_row := jsonb_populate_record(null::public.prompts, ${json(guard)});
  for key in select jsonb_object_keys(${json(guard)}) loop
    if (to_jsonb(live)->key) is distinct from (to_jsonb(guard_row)->key) then raise exception 'Protected field conflict: ${r.id}.%', key; end if;
  end loop;
  for key in select jsonb_object_keys(${json(expected)}) loop
    if (to_jsonb(live)->key) is distinct from (to_jsonb(expected)->key) then raise exception 'Old value conflict: ${r.id}.%', key; end if;
  end loop;
  update public.prompts set ${Object.keys(next).map(k=>`${k} = desired.${k}`).join(", ")}, updated_at = transaction_timestamp() where id = live.id;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Expected exactly one affected row for ${r.id}, got %', affected; end if;
  select * into strict live from public.prompts where id = '${r.id}';
  for key in select jsonb_object_keys(${json(next)}) loop
    if (to_jsonb(live)->key) is distinct from (to_jsonb(desired)->key) then raise exception 'Verification failed: ${r.id}.%', key; end if;
  end loop;
  for key in select k from jsonb_object_keys(${json(guard)}) as keys(k) where k <> 'updated_at' loop
    if (to_jsonb(live)->key) is distinct from (to_jsonb(guard_row)->key) then raise exception 'Protected field changed: ${r.id}.%', key; end if;
  end loop;
end $fix_${i}$;`;
  });
  return `-- UNAPPLIED. ${rollback ? "Rollback" : "Forward patch"} is an approval-gated rehearsal artifact; owner authorized this scoped release on 5 October.
-- Expected: exactly two prompts, one affected row each. No membership/flag changes.
-- Source: release 4d70ca6 text; old values and protected guards verified against the live read-only snapshot in live-baseline-verification.json.
-- Always rehearse first: this file ends in ROLLBACK. Change to COMMIT only after approval.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
${blocks.join("\n")}
select id, slug, framing, camera, prompt_text, updated_at from public.prompts where id in (${revisions.map(r=>`'${r.id}'`).join(", ")}) order by id;
rollback;
`;
};
writeFileSync(`${root}/database-forward.sql`, sql());
writeFileSync(`${root}/database-rollback.sql`, sql(true));
console.log("Wrote unapplied forward/rollback SQL; no database connection.");
