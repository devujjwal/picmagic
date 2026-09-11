/** Explicit editorial revision, separate from the insert-only seed importer. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { promptSchema, type Prompt } from "../types/content";
const args = process.argv.slice(2);
const baseRef = args[args.indexOf("--base-ref") + 1];
if (!args.includes("--base-ref") || !/^[a-f0-9]{7,40}$/.test(baseRef || ""))
  throw new Error(
    "Provide --base-ref with the reviewed baseline commit hash. Default is dry run; add --apply to write.",
  );
const before: Prompt[] = JSON.parse(
  execFileSync("git", ["show", `${baseRef}:content/prompts.json`], {
    encoding: "utf8",
  }),
).map((p: unknown) => promptSchema.parse(p));
const after: Prompt[] = JSON.parse(
  readFileSync("content/prompts.json", "utf8"),
).map((p: unknown) => promptSchema.parse(p));
if (
  after.some((p) => !p.is_published || p.preview_review_status !== "approved")
)
  throw new Error(
    "Complete local content and preview review before a production revision.",
  );
const fields = [
  "title",
  "style",
  "lighting",
  "seo_title",
  "seo_description",
  "distinctiveness_score",
  "content_intent",
  "why_ai",
  "editorial_review_version",
  "preview_review_status",
  "is_featured",
  "is_trending",
  "trending_rank",
  "prompt_text",
  "description",
  "faqs",
  "reel",
  "framing",
  "camera",
  "image_alt",
  "preview_image_url",
  "thumbnail_url",
  "image_width",
  "image_height",
  "image_brief",
  "persona_policy",
  "persona_version",
  "preview_video",
  "subject",
  "tags",
] as const;
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.PICMAGIC_ADMIN_EMAIL;
const password = process.env.PICMAGIC_ADMIN_PASSWORD;
if (!url || !key || !email || !password)
  throw new Error(
    "Load the private production and administrator environment files.",
  );
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: auth, error: authError } = await db.auth.signInWithPassword({
  email,
  password,
});
if (authError || !auth.user) throw new Error("Administrator sign-in failed.");
try {
  const { data: role, error: roleError } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (roleError || !role) throw new Error("Administrator membership required.");
  const { data: raw, error: readError } = await db.from("prompts").select("*");
  if (readError) throw new Error(`Read failed: ${readError.code}`);
  const current = raw.map((p) => promptSchema.parse(p));
  const pending: { current: Prompt; patch: Partial<Prompt> }[] = [];
  for (const next of after) {
    const old = before.find((p) => p.id === next.id);
    const live = current.find((p) => p.id === next.id);
    if (!old || !live)
      throw new Error(`Missing baseline or live record: ${next.slug}`);
    if (
      next.slug !== old.slug ||
      next.category_id !== old.category_id ||
      next.prompt_type !== old.prompt_type
    )
      throw new Error("This revision tool cannot change canonical ownership.");
    const patch: Partial<Prompt> = {};
    for (const field of fields) {
      if (same(old[field], next[field]) || same(live[field], next[field]))
        continue;
      if (!same(live[field], old[field]))
        throw new Error(
          `Editorial conflict: ${next.slug}.${field}; no writes performed.`,
        );
      Object.assign(patch, { [field]: next[field] });
    }
    if (Object.keys(patch).length) pending.push({ current: live, patch });
  }
  console.log(
    JSON.stringify({
      mode: args.includes("--apply") ? "apply" : "dry-run",
      reviewed: after.length,
      pending: pending.length,
      changed_fields: [
        ...new Set(pending.flatMap((p) => Object.keys(p.patch))),
      ],
    }),
  );
  if (args.includes("--apply") && pending.length) {
    const backup = `/tmp/picmagic-editorial-backup-${Date.now()}.json`;
    writeFileSync(backup, JSON.stringify(current, null, 2), { mode: 0o600 });
    console.log(`Private pre-write backup: ${backup}`);
    let applied = 0;
    for (const { current: live, patch } of pending) {
      const { data, error } = await db
        .from("prompts")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", live.id)
        .eq("updated_at", live.updated_at)
        .select("id");
      if (error || data?.length !== 1)
        throw new Error(
          `Stopped after ${applied} updates; conflict or write failure at ${live.slug}. Re-run dry-run before continuing.`,
        );
      applied++;
    }
    console.log(
      `Updated ${applied} records. Other fields and publication states preserved. Save a reviewed prompt through the protected editor to invalidate the catalog, then verify public HTML.`,
    );
  }
} finally {
  await db.auth.signOut({ scope: "local" });
}
