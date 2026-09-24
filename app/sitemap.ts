import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/content";
import { promptPath } from "@/types/content";
import { site } from "@/config/site";
import {
  categorySeoMembers,
  collectionSeoMembers,
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "@/lib/seo/eligibility";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexing) return [];
  const { prompts, categories, collections } = await getCatalog();
  const latestPromptUpdate = prompts
    .filter(isPromptSeoEligible)
    .map((prompt) => prompt.updated_at)
    .sort()
    .at(-1);
  return [
    ...[
      "/",
      "/ai-prompts",
      "/collections",
      "/enhance-photo",
      "/create",
      "/reel-prompts",
      "/about",
    ].map((path) => ({
      url: site.url + path,
      ...(latestPromptUpdate &&
      ["/", "/ai-prompts", "/collections", "/reel-prompts"].includes(path)
        ? { lastModified: latestPromptUpdate }
        : {}),
    })),
    ...categories
      .filter((category) => isCategorySeoEligible(category, prompts))
      .map((category) => ({
        url: `${site.url}/ai-prompts/${category.slug}`,
        lastModified: categorySeoMembers(category, prompts)
          .map((prompt) => prompt.updated_at)
          .sort()
          .at(-1),
      })),
    ...collections
      .filter((collection) => isCollectionSeoEligible(collection, prompts))
      .map((collection) => ({
        url: `${site.url}/collections/${collection.slug}`,
        lastModified: collectionSeoMembers(collection, prompts)
          .map((prompt) => prompt.updated_at)
          .sort()
          .at(-1),
      })),
    ...prompts.filter(isPromptSeoEligible).map((p) => ({
      url: site.url + promptPath(p),
      lastModified: p.updated_at,
      images: [site.url + p.preview_image_url].map((url) =>
        p.preview_image_url.startsWith("https://") ? p.preview_image_url : url,
      ),
    })),
  ];
}
