import { createClient } from "@supabase/supabase-js";
import prompts from "../content/prompts.json";
import categories from "../content/categories.json";
import collections from "../content/collections.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "../types/content";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error(
    "Set Supabase URL and service role in .env.local; never commit credentials.",
  );
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
async function insertMissing(table: string, rows: unknown[]) {
  const { error } = await db
    .from(table)
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(`${table}: ${error.code}`);
}
await insertMissing(
  "categories",
  categories.map((c) => categorySchema.parse(c)),
);
await insertMissing(
  "prompts",
  prompts.map((p) => promptSchema.parse(p)),
);
for (const raw of collections) {
  const c = collectionSchema.parse(raw);
  const { data: existing, error: readError } = await db
    .from("collections")
    .select("id")
    .eq("id", c.id)
    .maybeSingle();
  if (readError) throw readError;
  if (existing) continue;
  const { prompt_ids, ...record } = c;
  await insertMissing("collections", [record]);
  if (prompt_ids.length) {
    const { error } = await db
      .from("collection_prompts")
      .insert(
        prompt_ids.map((prompt_id) => ({ collection_id: c.id, prompt_id })),
      );
    if (error) throw error;
  }
}
console.log(
  `Seed import complete. Existing editorial records were preserved; source contains ${prompts.length} prompts.`,
);
