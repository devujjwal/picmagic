import "server-only";
import { requireAdmin } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/content";
import { articleSchema, authorSchema } from "@/lib/blog/schema";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "@/lib/seo/eligibility";
export async function blogEditorData() {
  const { db } = await requireAdmin();
  const [a, authors, catalog] = await Promise.all([
    db
      .from("blog_articles")
      .select("*")
      .order("date_modified", { ascending: false }),
    db.from("blog_authors").select("*"),
    getCatalog(),
  ]);
  if (a.error || authors.error)
    throw new Error(
      "Editorial admin unavailable. Apply the reviewed blog migration to the disposable local backend for QA.",
    );
  return {
    articles: a.data.map((a) => articleSchema.parse(a)),
    authors: authors.data.map((a) => authorSchema.parse(a)),
    catalog: {
      prompts: catalog.prompts.filter(
        (p) => isPromptSeoEligible(p) && p.poster_role !== "source-reference",
      ),
      categories: catalog.categories.filter((c) =>
        isCategorySeoEligible(c, catalog.prompts),
      ),
      collections: catalog.collections.filter((c) =>
        isCollectionSeoEligible(c, catalog.prompts),
      ),
    },
  };
}
