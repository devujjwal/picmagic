/** Deliberately destructive synchronization ONLY for the disposable QA database. */
import { createClient } from "@supabase/supabase-js";
import { allPrompts, allCollections } from "../../content/catalog";
import categories from "../../content/categories.json";
import { promptSchema, collectionSchema } from "../../types/content";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("Local QA only: refusing any other backend");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error("Missing local service key");
const db = createClient("http://127.0.0.1:54421", key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
check((await db.from("categories").upsert(categories)).error);
check(
  (
    await db
      .from("prompts")
      .upsert(allPrompts.map((p) => promptSchema.parse(p)))
  ).error,
);
for (const raw of allCollections) {
  const { prompt_ids, ...record } = collectionSchema.parse(raw);
  check((await db.from("collections").upsert(record)).error);
  check(
    (
      await db
        .from("collection_prompts")
        .delete()
        .eq("collection_id", record.id)
    ).error,
  );
  if (prompt_ids.length)
    check(
      (
        await db
          .from("collection_prompts")
          .insert(
            prompt_ids.map((prompt_id) => ({
              collection_id: record.id,
              prompt_id,
            })),
          )
      ).error,
    );
}
const { data, error } = await db.from("prompts").select("id,slug,is_published");
check(error);
const ids = new Set(allPrompts.map((p) => p.id));
const stale = (data || []).filter((p) => !ids.has(p.id) && !p.is_published);
if (stale.length)
  check(
    (
      await db
        .from("prompts")
        .delete()
        .in(
          "id",
          stale.map((p) => p.id),
        )
    ).error,
  );
console.log(
  `Disposable local QA synchronized: ${allPrompts.length} prompts, ${allCollections.length} collections; ${stale.length} stale drafts removed. Production untouched.`,
);
