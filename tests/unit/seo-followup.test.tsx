import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
import {
  promptCollections,
  discoverCollections,
} from "../../lib/prompts/collections";
import {
  previewCacheHeaders,
  generatedHeader,
} from "../../scripts/preview-cache-headers.mjs";
import { metadata } from "../../lib/seo/metadata";
import { safeAnalyticsPath } from "../../lib/analytics";
import { referenceGuidePath } from "../../content/site-pages";
import Guide from "../../app/guides/reference-photo-prompts/page";
import About from "../../app/about/page";
import editorialChanges from "../../docs/audits/seo-followup-2026-09-24/editorial-changes.json";

vi.mock("@/components/ui/site-link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
const c = loadAuditCatalog();
const now = new Date("2026-09-24T12:00:00Z");
describe("approved SEO follow-up", () => {
  it("limits catalogue edits to the reviewed editorial fields", () => {
    expect(editorialChanges).toHaveLength(11);
    for (const change of editorialChanges) {
      expect(
        Object.keys(change.after).every((key) =>
          [
            "seo_title",
            "seo_description",
            "tags",
            "updated_at",
            "reel",
          ].includes(key),
        ),
      ).toBe(true);
      expect(c.prompts.find((p) => p.slug === change.slug)).toMatchObject(
        change.after,
      );
      if (
        "reel" in change.after &&
        change.after.reel &&
        "reel" in change.before &&
        change.before.reel
      ) {
        const unchangedReelFields = (reel: Record<string, unknown>) =>
          Object.fromEntries(
            Object.entries(reel).filter(
              ([key]) => key !== "concept" && key !== "caption",
            ),
          );
        const before = unchangedReelFields(change.before.reel);
        const after = unchangedReelFields(change.after.reel);
        expect(after).toEqual(before);
      }
    }
  });
  it.each(["one-city-one-beautiful-evening", "the-anniversary-slow-dance"])(
    "exposes %s membership without lowering card quality thresholds",
    (slug) => {
      const prompt = c.prompts.find((p) => p.slug === slug)!;
      expect(
        discoverCollections({
          collections: c.collections,
          prompts: c.prompts,
          medium: "reel",
          contextIds: [prompt.id],
          now,
        }),
      ).toHaveLength(0);
      expect(
        promptCollections(prompt, c.collections, c.prompts, now).length,
      ).toBeGreaterThan(0);
      expect(
        promptCollections(
          { ...prompt, is_published: false },
          c.collections,
          c.prompts,
          now,
        ),
      ).toEqual([]);
      expect(
        promptCollections(
          prompt,
          c.collections.map((x) => ({ ...x, active: false })),
          c.prompts,
          now,
        ),
      ).toEqual([]);
    },
  );
  it("only gives exact versioned asset paths immutable browser caching", () => {
    const headers = previewCacheHeaders([
      "river-ce7d3f07d3.webp",
      "river-ce7d3f07d3-thumb.webp",
      "legacy.webp",
      "../river-ce7d3f07d3.webp",
      "unsafe\nHeader: bad",
      "river-ce7d3f07d3.webp",
    ]);
    expect(headers.startsWith(generatedHeader)).toBe(true);
    expect(headers.match(/immutable/g)).toHaveLength(2);
    expect(headers).not.toMatch(/legacy|unsafe|\.\.|\/\*/);
    expect(headers).toContain("/previews/river-ce7d3f07d3-thumb.webp");
  });
  it("preserves social image descriptions", () => {
    const m = metadata("Test", "Description", "/about", true, [
      {
        url: "https://picmagic.in/previews/test.webp",
        alt: "An illustrated portrait",
        width: 960,
        height: 1200,
      },
    ]);
    expect(m.twitter?.images).toEqual([
      {
        url: "https://picmagic.in/previews/test.webp",
        alt: "An illustrated portrait",
      },
    ]);
  });
  it("renders a semantic guide and honest provenance without a fabricated test badge", () => {
    const document = new DOMParser().parseFromString(
      renderToStaticMarkup(<Guide />),
      "text/html",
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelectorAll("article > ol > li")).toHaveLength(5);
    expect(document.body.textContent).toContain(
      "not verified compatibility badges",
    );
    expect(
      document.querySelector(
        'a[href="/ai-prompts/travel/the-river-remembers"]',
      ),
    ).not.toBeNull();
    expect(renderToStaticMarkup(<About />)).toContain(
      'id="editorial-methodology"',
    );
    expect(safeAnalyticsPath(referenceGuidePath + "?private=secret")).toBe(
      referenceGuidePath,
    );
    expect(safeAnalyticsPath("/guides/private-reference")).toBeNull();
  });
});
