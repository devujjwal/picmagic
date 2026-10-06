import type { Article } from "./schema";
import { publicationIssues } from "./schema";
import type { Catalog } from "@/types/content";
import { promptPath } from "@/lib/routes";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "@/lib/seo/eligibility";
export function articleContentIssues(
  a: Article,
  catalog: Catalog,
  now = new Date(),
) {
  const issues = publicationIssues(a, now);
  const promptIds = [...a.related_prompts];
  const destinations = [a.primary_conversion];
  for (const b of a.body) {
    if (b.type === "prompt_card") promptIds.push(b.prompt_id);
    if (b.type === "prompt_grid")
      promptIds.push(...b.items.map((p) => p.prompt_id));
    if (b.type === "cta") destinations.push(b.destination);
  }
  for (const id of new Set(promptIds)) {
    const p = catalog.prompts.find((p) => p.id === id);
    if (!p || !isPromptSeoEligible(p))
      issues.push(`Prompt ${id} must be published, approved and SEO eligible.`);
    else if (p.poster_role === "source-reference")
      issues.push(
        "Private/source-reference photographs cannot be article assets.",
      );
  }
  for (const d of destinations) {
    const p = catalog.prompts.find((p) => promptPath(p) === d.path);
    const c = catalog.categories.find(
      (c) => `/ai-prompts/${c.slug}` === d.path,
    );
    const col = catalog.collections.find(
      (c) => `/collections/${c.slug}` === d.path,
    );
    if (
      !(d.type === "prompt"
        ? p && isPromptSeoEligible(p)
        : d.type === "category"
          ? c && isCategorySeoEligible(c, catalog.prompts)
          : col && isCollectionSeoEligible(col, catalog.prompts))
    )
      issues.push(
        `Conversion destination ${d.path} is not eligible or has the wrong type.`,
      );
  }
  for (const path of a.related_collections) {
    const c = catalog.categories.find((c) => `/ai-prompts/${c.slug}` === path);
    const col = catalog.collections.find(
      (c) => `/collections/${c.slug}` === path,
    );
    if (
      !(c
        ? isCategorySeoEligible(c, catalog.prompts)
        : col && isCollectionSeoEligible(col, catalog.prompts))
    )
      issues.push(`Related hub ${path} is not eligible.`);
  }
  // Only existing, public catalogue assets are allowed in v1. New assets require a separate provenance review.
  const publicAssets = new Set(
    catalog.prompts
      .filter(
        (p) => isPromptSeoEligible(p) && p.poster_role !== "source-reference",
      )
      .map((p) => p.preview_image_url),
  );
  for (const img of [
    a.featured_image,
    ...a.body.flatMap((b) => (b.type === "image" ? [b.image] : [])),
  ]) {
    const p = catalog.prompts.find((p) => p.preview_image_url === img.url);
    if (
      !publicAssets.has(img.url) ||
      !p ||
      p.image_width !== img.width ||
      p.image_height !== img.height
    )
      issues.push(
        "Article images must reuse an approved public catalogue asset with its actual dimensions.",
      );
  }
  return [...new Set(issues)];
}
