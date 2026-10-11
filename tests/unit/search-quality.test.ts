import { describe, expect, it, vi } from "vitest";
import { latestModified, promptModified } from "@/lib/seo/modified";
import { allPrompts, allCollections } from "@/content/catalog";
import rawCategories from "@/content/categories.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
  promptPath,
} from "@/types/content";
import {
  remainingGuidanceDate,
  remainingPromptFaqs,
} from "@/content/remaining-guidance";
import { safeAnalyticsPath, cleanProperties } from "@/lib/analytics";
vi.mock("@/config/site", () => ({
  site: { url: "https://picmagic.in", indexing: true },
}));
import { sitemapEntries } from "@/lib/seo/sitemap";

describe("search quality safeguards", () => {
  it("compares actual instants, ignoring absent or invalid dates", () => {
    expect(latestModified(undefined, "", "invalid")).toBeUndefined();
    expect(
      latestModified("2026-10-10T23:00:00+05:30", "2026-10-10T18:00:00Z"),
    ).toBe("2026-10-10T18:00:00Z");
  });
  it("sitemaps include public FAQ revisions and agree with page schema", () => {
    const prompts = allPrompts.map((p) => promptSchema.parse(p));
    const entries = sitemapEntries({
      prompts,
      categories: rawCategories.map((c) => categorySchema.parse(c)),
      collections: allCollections.map((c) => collectionSchema.parse(c)),
    });
    for (const p of prompts) {
      const entry = entries.find(
        (e) => e.url === `https://picmagic.in${promptPath(p)}`,
      );
      if (!entry) continue;
      expect(entry.lastModified).toBe(promptModified(p));
      if (remainingPromptFaqs[p.slug])
        expect(Date.parse(String(entry.lastModified))).toBeGreaterThanOrEqual(
          Date.parse(remainingGuidanceDate),
        );
    }
  });
  it("allows tool measurement without query strings or personal export data", () => {
    expect(
      safeAnalyticsPath(
        "/festival-poster-maker?design=diwali&email=secret@example.test#phone",
      ),
    ).toBe("/festival-poster-maker");
    expect(safeAnalyticsPath("/guides/double-exposure-fashion")).toBe(
      "/guides/double-exposure-fashion",
    );
    expect(
      cleanProperties({
        poster_design: "diwali",
        poster_format: "portrait",
        poster_language: "hi",
        email: "secret",
        name: "private",
        uploaded_file: "photo.png",
        greeting: "secret",
      } as never),
    ).toEqual({
      poster_design: "diwali",
      poster_format: "portrait",
      poster_language: "hi",
    });
    expect(
      cleanProperties({
        poster_design: "private",
        poster_format: "secret",
        poster_language: "email@test.com",
      } as never),
    ).toEqual({});
  });
});
