"use server";
import { requireAdmin } from "@/lib/supabase/server";
import { articleSchema, type Article } from "@/lib/blog/schema";
import { articleContentIssues } from "@/lib/blog/validation";
import { getCatalog } from "@/lib/content";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
export type BlogActionState = { error?: string; success?: string };
export async function saveArticle(
  _: BlogActionState,
  form: FormData,
): Promise<BlogActionState> {
  const { db } = await requireAdmin();
  let savedId = "";
  try {
    const input = JSON.parse(String(form.get("payload")));
    const parsed = articleSchema.safeParse(input);
    if (!parsed.success)
      return {
        error: parsed.error.issues
          .slice(0, 5)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(" · "),
      };
    const a = parsed.data;
    const { data: old, error: readError } = await db
      .from("blog_articles")
      .select("*")
      .eq("id", a.id)
      .maybeSingle();
    if (readError) throw readError;
    const now = new Date().toISOString();
    const row: Article = {
      ...a,
      created_at: old?.created_at || now,
      date_modified: now,
      date_published:
        old?.date_published ||
        (a.status === "published" ? a.date_published : null),
    };
    const issues = articleContentIssues(
      {
        ...row,
        date_published:
          row.date_published || (row.status === "published" ? now : null),
      },
      await getCatalog(),
    );
    const { data: author, error: authorError } = await db
      .from("blog_authors")
      .select("id")
      .eq("id", row.author_id)
      .maybeSingle();
    if (authorError || !author) issues.push("Choose an existing author.");
    // Existing planned drafts may reference one another; validate targets against the stored registry.
    if (row.related_articles.length) {
      const { data: related, error } = await db
        .from("blog_articles")
        .select("slug")
        .in("slug", row.related_articles);
      if (
        error ||
        row.related_articles.some(
          (slug) => slug === row.slug || !related?.some((r) => r.slug === slug),
        )
      )
        issues.push(
          "Related articles must exist and cannot refer to this article.",
        );
    }
    if (issues.length) return { error: issues.slice(0, 6).join(" · ") };
    const { error } = await db.from("blog_articles").upsert(row);
    if (error)
      return {
        error:
          "Unable to save. Check unique slugs, redirect history and database constraints.",
      };
    updateTag("blog");
    for (const path of [
      "/blog",
      `/blog/${row.slug}`,
      old ? `/blog/${old.slug}` : "/blog",
      "/sitemap-pages.xml",
      "/sitemap-images.xml",
      "/admin/blog",
    ])
      revalidatePath(path);
    revalidatePath("/", "layout");
    if (old)
      return {
        success: "Article saved. Drafts and review records remain private.",
      };
    savedId = row.id;
  } catch {
    return {
      error: "Unable to save. Check required fields and your connection.",
    };
  }
  redirect(`/admin/blog/${savedId}?saved=1`);
}
