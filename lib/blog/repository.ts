import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import drafts from "@/content/blog/articles.json";
import authors from "@/content/blog/authors.json";
import {
  articleSchema,
  authorSchema,
  isArticlePublic,
  isArticleDiscoverable,
} from "./schema";
function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Blog backend is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
export const getPublicArticles = unstable_cache(
  async () => {
    if (process.env.CONTENT_SOURCE === "seed")
      return drafts
        .map((a) => articleSchema.parse(a))
        .filter((a) => isArticlePublic(a));
    const { data, error } = await client()
      .from("blog_articles")
      .select("*")
      .eq("status", "published");
    // Fail closed: never use seed drafts as a public backend fallback.
    if (error)
      throw new Error("The editorial library is temporarily unavailable.");
    return (data || [])
      .map((a) => articleSchema.parse(a))
      .filter((a) => isArticlePublic(a));
  },
  [
    "blog-v1",
    process.env.CONTENT_SOURCE || "supabase",
    process.env.NEXT_PUBLIC_SUPABASE_URL || "local",
    createHash("sha256").update(JSON.stringify(drafts)).digest("hex"),
  ],
  { tags: ["blog"], revalidate: 300 },
);
export async function getDiscoverableArticles() {
  return (await getPublicArticles()).filter((a) => isArticleDiscoverable(a));
}
export async function getBlogAuthors() {
  if (process.env.CONTENT_SOURCE === "seed")
    return authors.map((a) => authorSchema.parse(a));
  const { data, error } = await client().from("blog_authors").select("*");
  if (error)
    throw new Error("Editorial attribution is temporarily unavailable.");
  return (data || []).map((a) => authorSchema.parse(a));
}
export function localBlogPreviewEnabled(host: string) {
  return (
    process.env.PICMAGIC_BLOG_PREVIEW === "true" &&
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL &&
    process.env.CONTENT_SOURCE === "seed" &&
    !process.env.NETLIFY &&
    !process.env.CONTEXT &&
    /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)
  );
}
export function getLocalDraft(slug: string) {
  const row = drafts.find((a) => a.slug === slug);
  return row ? articleSchema.parse(row) : null;
}
export async function resolveBlogRedirect(slug: string) {
  if (process.env.CONTENT_SOURCE === "seed") return null;
  const { data, error } = await client()
    .from("blog_redirects")
    .select("article_id,blog_articles(slug)")
    .eq("old_slug", slug)
    .maybeSingle();
  if (error) throw new Error("Unable to resolve article URL");
  if (!data) return null;
  const target = (await getPublicArticles()).find(
    (a) => a.id === data.article_id,
  );
  return target ? `/blog/${target.slug}` : null;
}
export async function getRelatedGuideLinks({
  promptId,
  hubPath,
}: {
  promptId?: string;
  hubPath?: string;
}) {
  return (await getDiscoverableArticles().catch(() => []))
    .filter((a) =>
      promptId
        ? a.related_prompts.includes(promptId)
        : hubPath && a.related_collections.includes(hubPath),
    )
    .slice(0, 3)
    .map(({ id, slug, title }) => ({ id, slug, title }));
}
