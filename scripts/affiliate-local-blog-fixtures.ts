// Temporary public copies of the five articles in the disposable QA database.
// Restore exact original rows after browser testing; never run against hosted Supabase.
import { createClient } from "@supabase/supabase-js";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  renameSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { articleToolIntents } from "../lib/affiliate/recommendations";
import { articleSchema } from "../lib/blog/schema";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("Disposable local backend required");
const db = createClient(
  "http://127.0.0.1:54421",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const dir = ".release-private/affiliate-qa";
const file = `${dir}/blog-originals.json`;
if (process.argv.includes("--restore")) {
  const rows = JSON.parse(readFileSync(file, "utf8")).map((a: unknown) => {
    articleSchema.parse(a);
    // Validate without normalizing PostgreSQL's microsecond timestamp precision.
    return a;
  });
  const cols = Object.keys(articleSchema.shape).filter((c) => c !== "id");
  if (cols.some((c) => !/^[a-z_]+$/.test(c)))
    throw new Error("Unexpected schema column");
  const json = JSON.stringify(rows).replaceAll("'", "''");
  const sql = `begin; alter table public.blog_articles disable trigger blog_article_history; update public.blog_articles a set (${cols.join(",")}) = (${cols.map((c) => `r.${c}`).join(",")}) from jsonb_populate_recordset(null::public.blog_articles, '${json}'::jsonb) r where a.id=r.id; alter table public.blog_articles enable trigger blog_article_history; commit;`;
  const result = spawnSync(
    "docker",
    [
      "exec",
      "-i",
      "supabase_db_picmagic-release-qa",
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    { input: sql, encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error("Local blog restore failed");
  renameSync(file, `${dir}/blog-originals-restored-${Date.now()}.json`);
  console.log(
    "Exact original local blog rows restored; no published state left behind.",
  );
} else {
  if (existsSync(file))
    throw new Error(
      "An original-row snapshot already exists. Restore/review it before preparing another QA run.",
    );
  const { data, error } = await db
    .from("blog_articles")
    .select("*")
    .in("slug", Object.keys(articleToolIntents));
  if (error || data?.length !== 5)
    throw new Error("Expected five local editorial rows");
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2));
  const { error: updateError } = await db
    .from("blog_articles")
    .update({
      status: "published",
      is_indexable: true,
      date_published: new Date().toISOString(),
    })
    .in(
      "id",
      data.map((a) => a.id),
    );
  if (updateError) throw new Error("Local article preparation failed");
  console.log(
    "Five local articles temporarily available for contextual browser QA; exact originals saved privately.",
  );
}
