import type { MetadataRoute } from "next";
import type { Catalog } from "@/types/content";
import { promptPath } from "@/types/content";
import { site } from "@/config/site";
import { hubGuides, promptGuides } from "@/content/seo-guides";
import { sitePages } from "@/content/site-pages";
import {
  categorySeoMembers,
  collectionSeoMembers,
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "@/lib/seo/eligibility";
export function sitemapEntries({
  prompts,
  categories,
  collections,
}: Catalog): MetadataRoute.Sitemap {
  if (!site.indexing) return [];
  const latestPromptUpdate = prompts
    .filter(isPromptSeoEligible)
    .map((prompt) => prompt.updated_at)
    .sort()
    .at(-1);
  return [
    ...sitePages.map(({ path, updatedAt }) => ({
      url: site.url + path,
      ...(updatedAt ? { lastModified: updatedAt } : {}),
      ...(latestPromptUpdate &&
      ["/", "/ai-prompts", "/collections", "/reel-prompts"].includes(path)
        ? { lastModified: latestPromptUpdate }
        : {}),
    })),
    ...categories
      .filter((category) => isCategorySeoEligible(category, prompts))
      .map((category) => ({
        url: `${site.url}/ai-prompts/${category.slug}`,
        lastModified: [
          ...categorySeoMembers(category, prompts).map(
            (prompt) => prompt.updated_at,
          ),
          hubGuides[`/ai-prompts/${category.slug}`]?.updatedAt || "",
        ]
          .sort()
          .at(-1),
      })),
    ...collections
      .filter((collection) => isCollectionSeoEligible(collection, prompts))
      .map((collection) => ({
        url: `${site.url}/collections/${collection.slug}`,
        lastModified: [
          ...collectionSeoMembers(collection, prompts).map(
            (prompt) => prompt.updated_at,
          ),
          hubGuides[`/collections/${collection.slug}`]?.updatedAt || "",
        ]
          .sort()
          .at(-1),
      })),
    ...prompts.filter(isPromptSeoEligible).map((p) => ({
      url: site.url + promptPath(p),
      lastModified: [p.updated_at, promptGuides[p.slug]?.updatedAt || ""]
        .sort()
        .at(-1),
      images: [site.url + p.preview_image_url].map((url) =>
        p.preview_image_url.startsWith("https://") ? p.preview_image_url : url,
      ),
    })),
  ];
}
