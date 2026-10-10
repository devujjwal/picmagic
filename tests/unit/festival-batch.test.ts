import { describe, it, expect } from "vitest";
import {
  festivalReleaseDrafts,
  festivalReleaseMemberships,
  refreshSlugs,
} from "@/content/releases/festival-2026-10";
import { allPrompts, allCollections } from "@/content/catalog";
import categories from "@/content/categories.json";
import { promptPath, promptSchema } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import { posterDesigns } from "@/features/poster-maker/designs";
describe("staged festival release", () => {
  it("stages exactly six preserved drafts and six distinct additions, without activation", () => {
    expect(festivalReleaseDrafts).toHaveLength(12);
    const paths = festivalReleaseDrafts.map((p) => promptPath(p));
    expect(new Set(paths).size).toBe(12);
    for (const slug of refreshSlugs) {
      const original = allPrompts.find((p) => p.slug === slug)!;
      const draft = festivalReleaseDrafts.find((p) => p.slug === slug)!;
      expect(draft.id).toBe(original.id);
      expect(promptPath(draft)).toBe(promptPath(promptSchema.parse(original)));
    }
    expect(allPrompts.filter((p) => p.is_published)).toHaveLength(104);
    expect(allPrompts.filter((p) => !p.is_published)).toHaveLength(89);
    for (const staged of festivalReleaseDrafts) {
      const approved = promptSchema.parse(
        allPrompts.find((p) => p.id === staged.id),
      );
      expect(approved.preview_review_status).toBe("approved");
      expect(isPromptSeoEligible(approved)).toBe(true);
    }
    for (const p of festivalReleaseDrafts) {
      expect(p.is_published).toBe(false);
      expect(p.is_indexable).toBe(false);
      expect(p.preview_review_status).toBe("generation-required");
      expect(isPromptSeoEligible(p)).toBe(false);
    }
  });
  it("retains existing schema and reference-preservation rules without private inputs in public fields", () => {
    for (const p of festivalReleaseDrafts) {
      expect(() => promptSchema.parse(p)).not.toThrow();
      expect(personaIssues(p), p.slug).toEqual([]);
      expect(categories.some((c) => c.id === p.category_id)).toBe(true);
      expect(p.prompt_type).toBe("photo");
      expect(p.prompt_text).not.toMatch(
        /15.?35|22.?30|\.release-private|reference-0|men-\d|women-\d|couple-\d/,
      );
      expect(p.faqs.length).toBeGreaterThanOrEqual(3);
      for (const id of festivalReleaseMemberships[p.id])
        expect(allCollections.some((c) => c.id === id)).toBe(true);
    }
  });
  it("differentiates festival concepts and maps all three business artworks", () => {
    const find = (slug: string) =>
      festivalReleaseDrafts.find((p) => p.slug === slug)!;
    expect(find("navratri-dandiya-portrait").prompt_text).toContain(
      "exactly two",
    );
    expect(find("diwali-courtyard-celebration").prompt_text).toContain(
      "no child",
    );
    expect(find("durga-puja-pandal-portrait").prompt_text).toContain(
      "No idol needs to appear",
    );
    for (const d of posterDesigns) {
      const p = find(d.slug);
      expect(p.id).toBe(d.templateId);
      expect(p.prompt_text).toContain("No people");
      expect(p.prompt_text).toContain("never regenerate supplied logos");
    }
    expect(find("kurta-at-the-lantern-courtyard").prompt_text).toContain(
      "Without a garment reference",
    );
    expect(find("midnight-fuel-stop").prompt_text).toContain(
      "otherwise the bike is fictional",
    );
  });
});
