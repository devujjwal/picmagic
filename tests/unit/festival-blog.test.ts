import { describe, expect, it } from "vitest";
import articles from "@/content/blog/articles.json";
import authors from "@/content/blog/authors.json";
import {
  articleSchema,
  authorSchema,
  isArticleDiscoverable,
} from "@/lib/blog/schema";
import {
  articleMetadata,
  articleStructuredData,
  articleSitemapEntries,
} from "@/lib/blog/seo";
import { getDesign, formats } from "@/features/poster-maker/designs";

const slugs = [
  "diwali-durga-puja-dussehra-business-posters",
  "garba-dandiya-ai-photo-ideas",
];
const rows = articles
  .filter((a) => slugs.includes(a.slug))
  .map((a) => articleSchema.parse(a));
const author = authorSchema.parse(authors[0]);

describe("festival blog editorial safeguards", () => {
  it("keeps both new articles private with unique ownership and no invented publication date", () => {
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((a) => a.id)).size).toBe(2);
    for (const a of rows) {
      expect(a.status).toBe("draft");
      expect(a.is_indexable).toBe(false);
      expect(a.date_published).toBeNull();
      expect(a.reviewed_by).toBeNull();
      expect(isArticleDiscoverable(a)).toBe(false);
      expect(a.body.filter((b) => b.type === "image")).toHaveLength(3);
      expect(a.related_prompts).toHaveLength(3);
      expect(a.related_articles).toContain(
        slugs.find((slug) => slug !== a.slug),
      );
    }
    expect(articleSitemapEntries(rows)).toEqual([]);
  });
  it("uses existing canonical, social and BlogPosting architecture without FAQ markup", () => {
    for (const a of rows) {
      const metadata = articleMetadata(a, author);
      expect(metadata.alternates?.canonical).toBe(
        `https://picmagic.in/blog/${a.slug}`,
      );
      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
      const schema = articleStructuredData(a, author);
      expect(schema["@graph"][0]).toMatchObject({
        "@type": "BlogPosting",
        headline: a.title,
      });
      expect(JSON.stringify(schema)).not.toContain("FAQPage");
      expect(JSON.stringify(schema)).not.toContain("datePublished");
    }
  });
  it("maps only real poster design IDs and documented export dimensions", () => {
    const poster = rows[0];
    const hrefs = poster.body.flatMap((b) =>
      b.type === "paragraph"
        ? b.content.flatMap((s) => (s.href ? [s.href] : []))
        : [],
    );
    for (const id of ["diwali", "durga-puja", "dussehra"]) {
      expect(getDesign(id).id).toBe(id);
      expect(hrefs).toContain(`/festival-poster-maker?design=${id}`);
    }
    const text = JSON.stringify(poster.body);
    for (const [width, height] of Object.values(formats))
      expect(text).toContain(`${width} × ${height}`);
    expect(text).toContain("not native 4K");
    expect(text).toContain("browser memory");
  });
  it("keeps the owner-supplied couple disclosure visible, without a generic generated-preview card", () => {
    const portrait = rows[1];
    const image = portrait.body.find(
      (b) =>
        b.type === "image" && b.image.url.includes("dandiya-night-together"),
    );
    expect(image?.type).toBe("image");
    if (image?.type === "image")
      expect(image.image.caption).toContain("not independently verified");
    expect(
      portrait.body.some(
        (b) => b.type === "prompt_card" || b.type === "prompt_grid",
      ),
    ).toBe(false);
    expect(portrait.evidence_note).toContain(
      "No new generation or controlled comparison",
    );
  });
});
