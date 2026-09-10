import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/content";
import { promptPath } from "@/types/content";
import { site } from "@/config/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexing) return [];
  const { prompts, categories, collections } = await getCatalog();
  return [
    ...[
      "/",
      "/ai-prompts",
      "/enhance-photo",
      "/create",
      "/reel-prompts",
      "/about",
    ].map((path) => ({ url: site.url + path })),
    ...categories
      .filter((c) => c.is_indexable && c.slug !== "reels")
      .map((c) => ({ url: `${site.url}/ai-prompts/${c.slug}` })),
    ...collections
      .filter(
        (c) =>
          c.active &&
          c.is_indexable &&
          c.description.length >= 100 &&
          prompts.filter((p) => c.prompt_ids.includes(p.id)).length >= 4,
      )
      .map((c) => ({ url: `${site.url}/collections/${c.slug}` })),
    ...prompts
      .filter((p) => p.is_published && p.is_indexable)
      .map((p) => ({
        url: site.url + promptPath(p),
        lastModified: p.updated_at,
        images: [site.url + p.preview_image_url].map((url) =>
          p.preview_image_url.startsWith("https://")
            ? p.preview_image_url
            : url,
        ),
      })),
  ];
}
