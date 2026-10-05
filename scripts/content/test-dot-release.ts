/** Exercise release SQL in a newly initialized, socket-only disposable database. */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { reviewedRevisions, releaseSql } from "./dot-release";

const root = mkdtempSync(join(tmpdir(), "picmagic-dot-sql-"));
const data = join(root, "db");
const port = "55449";
let started = false;
const run = (command: string, args: string[], input?: string) =>
  execFileSync(command, args, {
    encoding: "utf8",
    input,
    stdio: ["pipe", "pipe", "pipe"],
  });
const sql = (input: string) =>
  run(
    "psql",
    [
      "-X",
      "-v",
      "ON_ERROR_STOP=1",
      "-h",
      root,
      "-p",
      port,
      "-d",
      "postgres",
      "-At",
    ],
    input,
  );
const literal = (value: unknown) =>
  `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const databaseError = (message: string) => (error: unknown) => {
  const result = error as { stderr?: string; message?: string };
  return (result.stderr || result.message || "").includes(message);
};
try {
  run("initdb", ["-D", data, "--auth=trust", "--no-locale", "--encoding=UTF8"]);
  run("pg_ctl", [
    "-D",
    data,
    "-l",
    join(root, "postgres.log"),
    "-o",
    `-k ${root} -h '' -p ${port}`,
    "-w",
    "start",
  ]);
  started = true;
  const revisions = reviewedRevisions("c21f970");
  sql(`create table public.prompts (
    id uuid primary key, slug text, category_id text, prompt_type text,
    is_published boolean, is_indexable boolean, preview_review_status text,
    preview_image_url text, thumbnail_url text, published_at timestamptz,
    description text, prompt_text text, faqs jsonb, why_ai text, framing text,
    reel jsonb, reference_contract jsonb, created_at timestamptz default now(), updated_at timestamptz default now()
  );
  create table public.categories (id text primary key, slug text, is_indexable boolean, description text);`);
  const seed = () => {
    sql("truncate public.prompts, public.categories;");
    for (const r of revisions)
      sql(
        `insert into public.${r.table} select * from jsonb_populate_record(null::public.${r.table}, ${literal({ id: r.id, ...r.guard, ...r.before })});`,
      );
    sql(
      "insert into public.prompts (id,slug,is_published,is_indexable) values ('00000000-0000-4000-8000-000000000095','untouched-draft',false,false);",
    );
  };
  const snapshot = () =>
    sql(
      "select jsonb_build_object('prompts',(select jsonb_agg(to_jsonb(p) order by id) from public.prompts p),'categories',(select jsonb_agg(to_jsonb(c) order by id) from public.categories c));",
    );
  seed();
  const before = snapshot();
  const preview = releaseSql(revisions);
  sql(preview);
  assert.equal(snapshot(), before, "preview must roll back every change");
  const apply = preview.replace(/rollback;\s*$/, "commit;\n");
  sql(apply);
  for (const r of revisions) {
    const columns = Object.keys(r.after);
    const check = columns
      .map(
        (key) =>
          `(to_jsonb(live)->'${key}') is not distinct from (to_jsonb(expected)->'${key}')`,
      )
      .join(" and ");
    assert.equal(
      sql(
        `select ${check} from public.${r.table} live cross join jsonb_populate_record(null::public.${r.table}, ${literal(r.after)}) expected where live.id='${r.id}';`,
      ).trim(),
      "t",
    );
  }
  const applied = snapshot();
  sql(apply);
  assert.equal(
    snapshot(),
    applied,
    "already-applied revisions must be idempotent",
  );
  assert.equal(
    sql(
      "select not is_published and not is_indexable from public.prompts where slug='untouched-draft';",
    ).trim(),
    "t",
  );
  seed();
  const last = revisions.at(-1)!;
  sql(
    `update public.${last.table} set description='An unexpected concurrent editorial change' where id='${last.id}';`,
  );
  const conflicting = snapshot();
  assert.throws(() => sql(apply), databaseError("Editorial conflict"));
  assert.equal(
    snapshot(),
    conflicting,
    "late conflict must roll back earlier records too",
  );
  seed();
  const first = revisions[0];
  sql(
    `update public.prompts set is_indexable = not is_indexable where id='${first.id}';`,
  );
  const protectedConflict = snapshot();
  assert.throws(() => sql(apply), databaseError("Protected field conflict"));
  assert.equal(snapshot(), protectedConflict);
  console.log(
    "Disposable PostgreSQL verification passed: rollback preview, exact fields/dates, idempotency, untouched draft, late-conflict atomic rollback and protected-field conflict. No production connection.",
  );
} catch (error) {
  if (started)
    console.error(
      readFileSync(join(root, "postgres.log"), "utf8").slice(-1000),
    );
  throw error;
} finally {
  if (started) run("pg_ctl", ["-D", data, "-m", "fast", "-w", "stop"]);
  rmSync(root, { recursive: true, force: true });
}
