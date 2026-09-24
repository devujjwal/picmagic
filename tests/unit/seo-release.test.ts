import { expect, it, vi } from "vitest";
import { allPrompts, allCollections } from "@/content/catalog";
import rawCategories from "@/content/categories.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "@/types/content";
import { relatedPrompts } from "@/lib/prompts/discovery";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "@/lib/seo/eligibility";
import { hubGuides } from "@/content/seo-guides";
import { textSimilarity } from "@/lib/seo/similarity";
import { safeAnalyticsPath } from "@/lib/analytics";
vi.mock("@/config/site", () => ({
  site: { url: "https://picmagic.in", indexing: true },
}));
import { sitemapEntries } from "@/lib/seo/sitemap";
import { sitemapXml, sitemapIndexXml } from "@/lib/seo/sitemap-xml";
const prompts = allPrompts.map((p) => promptSchema.parse(p));
const categories = rawCategories.map((c) => categorySchema.parse(c));
const collections = allCollections.map((c) => collectionSchema.parse(c));
it("covers every eligible page and image with a stable two-child sitemap index", () => {
  const entries = sitemapEntries({ prompts, categories, collections });
  expect(entries.filter((e) => e.images)).toHaveLength(
    prompts.filter(isPromptSeoEligible).length,
  );
  expect(sitemapIndexXml()).toContain("https://picmagic.in/sitemap-images.xml");
  expect(
    sitemapXml(
      [
        {
          url: "https://picmagic.in/?a=1&b=2",
          images: ["https://picmagic.in/i.webp?a=1&b=2"],
        },
      ],
      true,
    ),
  ).toContain("&amp;b=2");
  expect(sitemapXml(entries)).not.toContain("<image:image>");
  expect(sitemapXml(entries, true)).toContain("<image:image>");
});
it("all indexable hubs have reviewed, distinct editorial modules", () => {
  for (const c of categories.filter((c) => isCategorySeoEligible(c, prompts)))
    expect(
      hubGuides[`/ai-prompts/${c.slug}`]?.sections.length,
    ).toBeGreaterThanOrEqual(2);
  for (const c of collections.filter((c) =>
    isCollectionSeoEligible(c, prompts),
  ))
    expect(
      hubGuides[`/collections/${c.slug}`]?.sections.length,
    ).toBeGreaterThanOrEqual(2);
});
it("related rails contain approved distinct images and the same medium", () => {
  for (const p of prompts.filter(isPromptSeoEligible)) {
    const related = relatedPrompts(p, prompts);
    expect(new Set(related.map((r) => r.preview_image_url)).size).toBe(
      related.length,
    );
    for (const r of related) {
      expect(isPromptSeoEligible(r)).toBe(true);
      expect(r.preview_image_url).not.toBe(p.preview_image_url);
      expect(["reel", "video"].includes(r.prompt_type)).toBe(
        ["reel", "video"].includes(p.prompt_type),
      );
    }
  }
});
it("recognises the collection hub without accepting private paths", () => {
  expect(safeAnalyticsPath("/collections?private=secret")).toBe("/collections");
  expect(safeAnalyticsPath("/collections/private/extra")).toBeNull();
  expect(safeAnalyticsPath("/admin")).toBeNull();
});
it("similarity reports overlap without inventing semantic equivalence", () => {
  expect(textSimilarity("one two three four", "one two three four")).toBe(1);
  expect(textSimilarity("one two three four", "five six seven eight")).toBe(0);
});
