/** Read-only release check. Do not run against production until a release is authorized. */
import { createClient } from "@supabase/supabase-js";
import { articleSchema, publicationIssues } from "../lib/blog/schema";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error(
    "An authorized read-only full editorial snapshot requires a configured backend and server-only service key.",
  );
if (
  url !== "http://127.0.0.1:54421" &&
  !process.argv.includes("--authorized-production-read")
)
  throw new Error("Remote release inspection must be explicitly authorized.");
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const { data, error } = await db.from("blog_articles").select("*");
if (error) throw new Error("Unable to audit full editorial state");
const issues = (data || []).flatMap((row) => {
  const a = articleSchema.parse(row);
  return publicationIssues(a).map((i) => `${a.slug}: ${i}`);
});
const exceptions = (data || []).filter(
  (a) => a.status === "published" && !a.is_indexable,
);
for (const a of exceptions)
  console.log(`Temporary noindex: ${a.slug}, review ${a.noindex_review_at}`);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Editorial release gate passed: ${(data || []).length} records, ${exceptions.length} temporary exceptions.`,
  );
