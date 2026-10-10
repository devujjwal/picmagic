import { describe, it, expect, vi, beforeEach } from "vitest";
import drafts from "@/content/blog/articles.json";
import {
  articleSchema,
  publicationIssues,
  isArticleDiscoverable,
  isArticlePublic,
  safeHref,
} from "@/lib/blog/schema";
import { articleContentIssues } from "@/lib/blog/validation";
import { allPrompts, allCollections } from "@/content/catalog";
import categories from "@/content/categories.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "@/types/content";
import {
  classifyEntry,
  readBlogAttribution,
  setBlogAttribution,
  blogAttributionKey,
} from "@/lib/analytics/blog-attribution";
import { cleanProperties, safeAnalyticsPath } from "@/lib/analytics";
const rows = drafts.map((a) => articleSchema.parse(a));
const catalog = {
  prompts: allPrompts.map((p) => promptSchema.parse(p)),
  categories: categories.map((c) => categorySchema.parse(c)),
  collections: allCollections.map((c) => collectionSchema.parse(c)),
};
const now = new Date("2026-10-06T12:00:00Z");
describe("editorial publication and content", () => {
  it("validates seven private source drafts and eligible destinations", () => {
    expect(rows).toHaveLength(7);
    expect(new Set(rows.map((a) => a.slug)).size).toBe(7);
    for (const a of rows) {
      expect(a.status).toBe("draft");
      expect(a.date_published).toBeNull();
      expect(isArticlePublic(a, now)).toBe(false);
      expect(isArticleDiscoverable(a, now)).toBe(false);
      expect(articleContentIssues(a, catalog, now)).toEqual([]);
    }
  });
  it("normalizes PostgreSQL timestamps with offsets", () => {
    expect(
      articleSchema.parse({
        ...rows[0],
        date_modified: "2026-10-06T06:00:00.123456+00:00",
      }).date_modified,
    ).toBe("2026-10-06T06:00:00.123Z");
  });
  it("normal publication is indexable, and temporary exceptions require bounded review", () => {
    const a = {
      ...rows[0],
      status: "published" as const,
      is_indexable: true,
      date_published: now.toISOString(),
    };
    expect(isArticlePublic(a, now)).toBe(true);
    expect(isArticleDiscoverable(a, now)).toBe(true);
    expect(publicationIssues({ ...a, is_indexable: false }, now)).not.toEqual(
      [],
    );
    const exception = {
      ...a,
      is_indexable: false,
      noindex_reason: "Correct a source attribution",
      noindex_review_at: "2026-10-07T12:00:00Z",
    };
    expect(isArticlePublic(exception, now)).toBe(true);
    expect(isArticleDiscoverable(exception, now)).toBe(false);
    expect(isArticlePublic(exception, new Date("2026-10-08"))).toBe(false);
    expect(
      publicationIssues(
        { ...exception, noindex_review_at: "2026-12-07T12:00:00Z" },
        now,
      ).length,
    ).toBeGreaterThan(0);
    expect(isArticlePublic({ ...a, status: "review" }, now)).toBe(false);
  });
  it("rejects executable formats, unsafe URLs and conflicting structure", () => {
    for (const href of [
      "javascript:alert(1)",
      "//example.com",
      "data:text/html,test",
      "https://person:secret@example.com",
      "/\\example.com",
    ])
      expect(safeHref.safeParse(href).success).toBe(false);
    expect(
      articleSchema.safeParse({
        ...rows[0],
        body: [{ type: "html", html: "<script>" }],
      }).success,
    ).toBe(false);
    expect(
      publicationIssues(
        {
          ...rows[0],
          body: [{ type: "heading", level: 3, id: "skip", text: "Skipped" }],
        },
        now,
      ),
    ).toContain("Do not skip heading levels.");
    expect(
      articleContentIssues(
        {
          ...rows[0],
          primary_conversion: {
            ...rows[0].primary_conversion,
            path: "/ai-prompts/missing",
          },
        },
        catalog,
        now,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      articleContentIssues(
        {
          ...rows[0],
          featured_image: {
            ...rows[0].featured_image,
            url: "/.release-private/portrait.webp",
          },
        },
        catalog,
        now,
      ).length,
    ).toBeGreaterThan(0);
  });
});
describe("blog funnel privacy", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, "", "/blog/test-guide");
    vi.useRealTimers();
  });
  it("does not store attribution without consent and rejects preview measurement", () => {
    const input = {
      article_slug: "test-guide",
      cta_role: "primary" as const,
      destination_type: "category" as const,
      destination_path: "/ai-prompts/men",
    };
    setBlogAttribution(input);
    expect(sessionStorage.getItem(blogAttributionKey)).toBeNull();
    expect(safeAnalyticsPath("/admin/blog/test/preview")).toBeNull();
    expect(safeAnalyticsPath("/blog-preview/test-guide")).toBeNull();
    expect(safeAnalyticsPath("/blog/test-guide?private=secret")).toBe(
      "/blog/test-guide",
    );
  });
  it("retains attribution through the hub and clears it after revocation or expiry", () => {
    localStorage.setItem("picmagic:analytics-consent", "yes");
    setBlogAttribution({
      article_slug: "test-guide",
      cta_role: "primary",
      destination_type: "category",
      destination_path: "/ai-prompts/men",
    });
    window.history.replaceState({}, "", "/ai-prompts/men");
    expect(readBlogAttribution()?.article_slug).toBe("test-guide");
    window.history.replaceState(
      {},
      "",
      "/ai-prompts/men/city-lights-main-character-energy",
    );
    expect(readBlogAttribution()?.cta_role).toBe("primary");
    localStorage.setItem("picmagic:analytics-consent", "no");
    expect(readBlogAttribution()).toBeUndefined();
    expect(sessionStorage.getItem(blogAttributionKey)).toBeNull();
    localStorage.setItem("picmagic:analytics-consent", "yes");
    sessionStorage.setItem(
      blogAttributionKey,
      JSON.stringify({
        article_slug: "test-guide",
        cta_role: "primary",
        destination_type: "category",
        destination_path: "/ai-prompts/men",
        entry_source: "direct",
        expires: 1,
      }),
    );
    expect(readBlogAttribution()).toBeUndefined();
  });
  it("sends no extra identifiers or free text", () => {
    expect(classifyEntry("https://www.google.co.in/search?q=private")).toBe(
      "organic_search",
    );
    expect(classifyEntry("https://google.com.attacker.test/search")).toBe(
      "referral",
    );
    expect(
      cleanProperties({
        article_slug: "test-guide",
        destination_path: "/ai-prompts/men",
        scroll_percent: 50,
        email: "secret",
        visitor_id: "secret",
        article_text: "secret",
        query: "secret",
      } as never),
    ).toEqual({
      article_slug: "test-guide",
      destination_path: "/ai-prompts/men",
      scroll_percent: 50,
    });
  });
});
