/** Disposable local QA only. Seed files are always private drafts. */
import { createClient } from "@supabase/supabase-js";
import drafts from "../content/blog/articles.json";
import authors from "../content/blog/authors.json";
import { articleSchema } from "../lib/blog/schema";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("Refusing any non-local backend");
const db = createClient(
  "http://127.0.0.1:54421",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
const ids = [
  "a0000000-0000-4000-8000-000000000001",
  "a0000000-0000-4000-8000-000000000002",
  "a0000000-0000-4000-8000-000000000003",
  "a0000000-0000-4000-8000-000000000004",
  "a0000000-0000-4000-8000-000000000005",
];
// Existing fixture history is removed only for known QA IDs, never real editorial records.
check((await db.from("blog_articles").delete().in("id", ids)).error);
// The admin browser test creates only this explicit disposable QA prefix.
check(
  (await db.from("blog_articles").delete().like("slug", "qa-admin-blog-%"))
    .error,
);
check((await db.from("blog_authors").upsert(authors)).error);
check(
  (
    await db
      .from("blog_articles")
      .upsert(drafts.map((a) => articleSchema.parse(a)))
  ).error,
);
if (process.argv.includes("--public-fixtures")) {
  const slug = [
    "qa-blog-direct",
    "qa-blog-men",
    "qa-blog-women",
    "qa-blog-couple",
    "qa-blog-noindex",
  ];
  const source = [0, 2, 3, 4, 1];
  const fixtures = source.map((n, i) => ({
    ...articleSchema.parse(drafts[n]),
    id: ids[i],
    slug: slug[i],
    related_articles: [],
    status: "published" as const,
    is_indexable: i !== 4,
    date_published: new Date(Date.now() - 60000).toISOString(),
    noindex_reason: i === 4 ? "Disposable QA exception" : null,
    noindex_review_at:
      i === 4 ? new Date(Date.now() + 86400000).toISOString() : null,
  }));
  check((await db.from("blog_articles").insert(fixtures)).error);
}
const { count, error } = await db
  .from("prompts")
  .select("id", { count: "exact", head: true })
  .eq("is_published", false);
check(error);
if (count !== 95) throw new Error(`Expected 95 prompt drafts, found ${count}`);
console.log(
  "Local blog fixtures ready; original five articles remain private drafts; 95 prompt drafts preserved.",
);
