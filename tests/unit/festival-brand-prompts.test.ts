import { describe, expect, it, vi } from "vitest";
import { allPrompts } from "@/content/catalog";
import articles from "@/content/blog/articles.json";
import revisions from "@/docs/audits/festival-brand-prompts-2026-10-11/changes.json";
import premiumReview from "@/docs/audits/festival-premium-2026-10-10/content-review.json";
import { createHash } from "node:crypto";
import { promptSchema } from "@/types/content";
import { articleSchema } from "@/lib/blog/schema";
import { festivalReleaseDrafts } from "@/content/releases/festival-2026-10";
import previewReview from "@/docs/audits/festival-brand-prompts-2026-10-11/preview-review.json";
import fs from "node:fs";
vi.mock("@/config/site", () => ({
  site: { url: "https://picmagic.in", indexing: true },
}));
import { promptMetadata } from "@/lib/seo/metadata";

describe("website-informed festival poster copy", () => {
  it("keeps the metadata sentence complete in the catalogue and authoring source", () => {
    const row = allPrompts.find(
      (p) => p.slug === "durga-puja-pandal-portrait",
    )!;
    const source = festivalReleaseDrafts.find((p) => p.id === row.id)!;
    const meta = promptMetadata(promptSchema.parse(row));
    expect(row.seo_description).toBe(source.seo_description);
    expect(row.seo_description.length).toBeLessThanOrEqual(155);
    expect(meta.description).toMatch(/your face and actual age\.$/);
    expect(meta.openGraph).toMatchObject({ description: row.seo_description });
    expect(meta.twitter).toMatchObject({ description: row.seo_description });
  });

  it("revises only four existing records without touching publication", () => {
    expect(revisions).toHaveLength(4);
    const allowed = new Set([
      "description",
      "prompt_text",
      "seo_description",
      "updated_at",
      "faqs",
      "why_ai",
      "preview_image_url",
      "thumbnail_url",
      "image_alt",
      "image_brief",
    ]);
    for (const change of revisions) {
      const row = allPrompts.find((p) => p.id === change.id)!;
      expect(row.slug).toBe(change.slug);
      for (const [field, value] of Object.entries(change.after)) {
        expect(allowed.has(field)).toBe(true);
        expect(row[field as keyof typeof row]).toEqual(value);
      }
      if (change.before.prompt_text) {
        expect(
          createHash("sha256").update(change.before.prompt_text).digest("hex"),
        ).toBe(premiumReview.find((p) => p.id === row.id)?.sha256);
      }
    }
    expect(allPrompts.filter((p) => p.is_published)).toHaveLength(104);
    expect(allPrompts.filter((p) => !p.is_published)).toHaveLength(89);
  });

  it.each(["diwali", "durga-puja", "dussehra"])(
    "%s asks for verified branding with honest capability and preview boundaries",
    (festival) => {
      const p = promptSchema.parse(
        allPrompts.find((p) => p.slug === `${festival}-business-greeting`),
      );
      expect(p.prompt_text).toContain("[PASTE YOUR WEBSITE URL]");
      expect(p.prompt_text).toContain("source URLs");
      expect(p.prompt_text).toContain("confirm it before generation");
      expect(p.prompt_text).toContain("Never pretend you scanned it");
      expect(p.prompt_text).toContain(
        "Do not redraw, imitate or regenerate it with AI",
      );
      expect(p.prompt_text).toContain("verified services/features");
      expect(p.prompt_text).toContain("consistent thin-line icon");
      expect(p.prompt_text).toContain("does not scan websites");
      expect(p.prompt_text).toContain("PicMagic-branded example");
      expect(p.prompt_text).toContain("homepage request timed out");
      expect(p.prompt_text).toContain("not an export from the fixed-layout");
      expect(p.prompt_text).not.toContain(
        "No human models, endorsements, text, letters, numbers, logos or watermarks",
      );
      expect(p.image_brief).toContain("WEBSITE-INFORMED PICMAGIC SHOWCASE:");
      expect(p.image_brief).toContain(
        "original logo composited from source vectors",
      );
    },
  );

  it("keeps the guide factual about custom workflows versus the fixed editor", () => {
    const a = articleSchema.parse(
      articles.find(
        (a) => a.slug === "diwali-durga-puja-dussehra-business-posters",
      ),
    );
    const text = JSON.stringify(a.body);
    expect(text).toContain("match-your-website");
    expect(text).toContain("choose-relevant-icons");
    expect(text).toContain(
      "does not scan websites, fetch logos, add a service-icon row",
    );
    expect(text).toContain("homepage request timed out");
    expect(a.status).toBe("draft");
    expect(a.is_indexable).toBe(false);
    expect(a.date_published).toBeNull();
    expect(a.related_prompts).toHaveLength(3);
  });

  it("uses three reviewed, hash-verified branded previews in templates and the guide", () => {
    expect(previewReview.records).toHaveLength(3);
    const article = articles.find(
      (a) => a.slug === "diwali-durga-puja-dussehra-business-posters",
    )!;
    for (const evidence of previewReview.records) {
      const row = allPrompts.find((p) => p.slug === evidence.slug)!;
      expect(row.preview_image_url).toBe(evidence.preview.path);
      expect(JSON.stringify(article.body)).toContain(evidence.preview.path);
      for (const asset of [evidence.preview, evidence.thumbnail]) {
        expect(
          createHash("sha256")
            .update(fs.readFileSync(`public${asset.path}`))
            .digest("hex"),
        ).toBe(asset.sha256);
      }
      expect(evidence.logo.source).toContain("brand-logo.tsx");
    }
  });
});
