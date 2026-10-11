import { articleSitemapEntries } from "@/lib/blog/seo";
import type { Article } from "@/lib/blog/schema";
import type { MetadataRoute } from "next";
import type { Catalog } from "@/types/content";
import { promptPath } from "@/types/content";
import { site } from "@/config/site";
import { hubGuides } from "@/content/seo-guides";
import { sitePages } from "@/content/site-pages";
import { latestModified, promptModified } from "./modified";
import {
  categorySeoMembers,
  collectionSeoMembers,
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "@/lib/seo/eligibility";
export function sitemapEntries(
  { prompts, categories, collections }: Catalog,
  articles: Article[] = [],
): MetadataRoute.Sitemap {
  if (!site.indexing) return [];
  const latestPromptUpdate = latestModified(
    ...prompts.filter(isPromptSeoEligible).map((prompt) => prompt.updated_at),
  );
  return [
    ...articleSitemapEntries(articles),
    ...(articles.some((a) => articleSitemapEntries([a]).length)
      ? [
          {
            url: site.url + "/blog",
            lastModified: latestModified(
              ...articles
                .filter((a) => articleSitemapEntries([a]).length)
                .map((a) => a.date_modified),
            ),
          },
        ]
      : []),
    ...sitePages.map(({ path, updatedAt }) => ({
      url: site.url + path,
      ...(updatedAt ? { lastModified: updatedAt } : {}),
      ...(latestPromptUpdate &&
      ["/", "/ai-prompts", "/collections", "/reel-prompts"].includes(path)
        ? { lastModified: latestModified(updatedAt, latestPromptUpdate) }
        : {}),
    })),
    ...categories
      .filter((category) => isCategorySeoEligible(category, prompts))
      .map((category) => ({
        url: `${site.url}/ai-prompts/${category.slug}`,
        lastModified: latestModified(
          ...categorySeoMembers(category, prompts).map(
            (prompt) => prompt.updated_at,
          ),
          hubGuides[`/ai-prompts/${category.slug}`]?.updatedAt || "",
        ),
      })),
    ...collections
      .filter((collection) => isCollectionSeoEligible(collection, prompts))
      .map((collection) => ({
        url: `${site.url}/collections/${collection.slug}`,
        lastModified: latestModified(
          ...collectionSeoMembers(collection, prompts).map(
            (prompt) => prompt.updated_at,
          ),
          hubGuides[`/collections/${collection.slug}`]?.updatedAt || "",
        ),
      })),
    ...prompts.filter(isPromptSeoEligible).map((p) => ({
      url: site.url + promptPath(p),
      lastModified: promptModified(p),
      images: [site.url + p.preview_image_url].map((url) =>
        p.preview_image_url.startsWith("https://") ? p.preview_image_url : url,
      ),
    })),
  ];
}
