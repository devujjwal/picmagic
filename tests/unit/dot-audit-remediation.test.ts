import { expect, it } from "vitest";
import { allPrompts } from "@/content/catalog";
import { personaIssues } from "@/lib/prompts/persona";
import { promptSchema } from "@/types/content";
import { promptGuides } from "@/content/seo-guides";
import changes from "../../docs/audits/dot-public-2026-10-05/changes.json";
import reels from "../../docs/audits/dot-public-2026-10-05/reel-changes.json";
import dates from "../../docs/audits/dot-public-2026-10-05/date-provenance.json";
const find = (slug: string) => allPrompts.find((p) => p.slug === slug)!;

it.each([
  "your-everyday-with-better-light",
  "a-memory-worth-restoring",
  "change-the-scene-keep-yourself",
  "an-outfit-with-a-new-perspective",
])("preserves source composition for %s", (slug) => {
  const text = find(slug).prompt_text;
  expect(text).toContain("preserve the source aspect ratio and framing");
  expect(text).toContain("unless the user explicitly requests");
  expect(text).not.toContain("Output aspect ratio: 4:5,");
});
it("uses two photographic wedding identities and conditional hair styling", () => {
  const wedding = find("dressed-for-the-first-dance");
  expect(wedding.prompt_text).not.toContain("artistic pigment");
  expect(wedding.prompt_text).toContain(
    "Label the two adult identities separately",
  );
  expect(personaIssues(promptSchema.parse(wedding))).toEqual([]);
  expect(find("quiet-confidence").prompt_text).not.toContain("on one knee");
  expect(find("golden-hour-draped-in-tradition").prompt_text).toContain(
    "only when the reference hair is long enough",
  );
  expect(find("a-frame-from-another-decade").why_ai).toContain("1990s");
});
it.each([
  "coffee-and-a-real-smile",
  "the-bookshop-detour",
  "sunday-park-conversation",
  "something-good-in-the-kitchen",
])("gives %s one still moment and specific repair", (slug) => {
  const p = find(slug);
  expect(p.prompt_text).toContain("single still instant");
  expect(p.prompt_text).not.toContain(
    "resting moment at the start of this action",
  );
  expect(p.faqs[1].question).toMatch(/cup|pages|shoe|spoon/);
});
it("separates source crops, proposed motion and legacy evidence", () => {
  for (const slug of [
    "the-little-flute-keeper-reel",
    "skincare-on-stone-reel",
    "ceramic-and-linen-reel",
  ])
    expect(find(slug).prompt_text).toContain("SOURCE AND VIDEO FRAMING:");
  expect(find("from-suitcase-to-seaside").prompt_text).toContain(
    "three separate matched shots",
  );
  for (const slug of ["the-anniversary-slow-dance", "the-fragrance-reveal"]) {
    expect(promptGuides[slug].sections.at(-1)?.body).toContain(
      "roughly five-second",
    );
    expect(promptGuides[slug].sections.at(-1)?.body).toContain(
      "fifteen-second",
    );
  }
});
it("records history-backed dates without changing publication ownership", () => {
  expect(dates).toHaveLength(9);
  for (const d of dates) {
    const p = find(d.slug);
    expect(p.created_at).toBe(d.created_at);
    expect(p.updated_at).toBe(d.updated_at);
    expect(Date.parse(p.updated_at)).toBeGreaterThanOrEqual(
      Date.parse(p.created_at),
    );
    expect(d.first.hash).toMatch(/^[a-f0-9]{40}$/);
  }
  for (const change of [...changes, ...reels]) {
    expect(find(change.slug)).toMatchObject(change.after);
    for (const key of [
      "id",
      "slug",
      "category_id",
      "is_published",
      "is_indexable",
      "preview_image_url",
    ])
      expect(change.after).not.toHaveProperty(key);
  }
});
