import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import prompts from "@/content/prompts.json";
import categories from "@/content/categories.json";
import collections from "@/content/collections.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
  type Catalog,
} from "@/types/content";
export interface ContentRepository {
  getCatalog(): Promise<Catalog>;
  resolveRedirect(path: string): Promise<string | null>;
}
export class SeedRepository implements ContentRepository {
  async getCatalog() {
    return {
      prompts: prompts
        .map((p) => promptSchema.parse(p))
        .filter((p) => p.is_published),
      categories: categories.map((c) => categorySchema.parse(c)),
      collections: collections.map((c) => collectionSchema.parse(c)),
    };
  }
  async resolveRedirect() {
    return null;
  }
}
function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      "Supabase is not configured. Set CONTENT_SOURCE=seed only for local previews.",
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export class SupabaseRepository implements ContentRepository {
  async getCatalog() {
    const db = client();
    const [p, c, s] = await Promise.all([
      db
        .from("prompts")
        .select("*")
        .eq("is_published", true)
        .order("trending_rank"),
      db.from("categories").select("*"),
      db
        .from("collections")
        .select("*,collection_prompts(prompt_id)")
        .eq("active", true),
    ]);
    if (p.error || c.error || s.error) {
      console.error("[content] catalog unavailable", {
        code: p.error?.code || c.error?.code || s.error?.code,
      });
      throw new Error(
        "The library is temporarily unavailable. Please try again.",
      );
    }
    return {
      prompts: p.data.map((x) => promptSchema.parse(x)),
      categories: c.data.map((x) => categorySchema.parse(x)),
      collections: s.data.map((x) =>
        collectionSchema.parse({
          ...x,
          prompt_ids: (x.collection_prompts as { prompt_id: string }[]).map(
            (y) => y.prompt_id,
          ),
        }),
      ),
    };
  }
  async resolveRedirect(path: string) {
    const { data, error } = await client()
      .from("content_redirects")
      .select("new_path")
      .eq("old_path", path)
      .maybeSingle();
    if (error) throw new Error("Unable to resolve content");
    return data?.new_path ?? null;
  }
}
export function repository(): ContentRepository {
  return process.env.CONTENT_SOURCE === "seed"
    ? new SeedRepository()
    : new SupabaseRepository();
}
export const getCatalog = unstable_cache(
  () => repository().getCatalog(),
  [
    "catalog-v1",
    process.env.CONTENT_SOURCE || "supabase",
    process.env.NEXT_PUBLIC_SUPABASE_URL || "local",
  ],
  { revalidate: 3600, tags: ["catalog"] },
);
