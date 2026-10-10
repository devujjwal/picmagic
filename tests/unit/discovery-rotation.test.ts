import { describe, expect, it } from "vitest";
import { allPrompts } from "../../content/catalog";
import { promptSchema } from "@/types/content";
import { orderForDiscovery, isHomepageEligible } from "@/lib/prompts/editorial";
import {
  declaredSubjectGroup,
  diversityDeck,
  eligibleDiscoveryPhotos,
  orderExplore,
  selectHomepage,
} from "@/lib/prompts/discovery-rotation";

const prompts = allPrompts.map((p) => promptSchema.parse(p));
const ids = (records: typeof prompts) => records.map((p) => p.id);
describe("server-selected discovery rotation", () => {
  it("preserves the editorial default and rejects unsafe records and duplicate IDs", () => {
    const baseline = prompts
      .filter((p) => isHomepageEligible(p) && p.is_featured)
      .sort((a, b) => a.trending_rank - b.trending_rank);
    expect(selectHomepage(prompts).ids).toEqual(ids(baseline.slice(0, 12)));
    const photos = eligibleDiscoveryPhotos(prompts);
    expect(photos).toHaveLength(85);
    expect(orderExplore(prompts)).toEqual(orderForDiscovery(photos));
    const rejected = [
      { ...photos[0], id: "draft", is_published: false },
      {
        ...photos[0],
        id: "unapproved",
        preview_review_status: "replacement-required" as const,
      },
      { ...photos[0], id: "noindex", is_indexable: false },
      { ...photos[0], id: "weak", distinctiveness_score: 1 },
    ];
    expect(
      ids(eligibleDiscoveryPhotos([...prompts, ...photos, ...rejected])),
    ).toEqual(ids(photos));
    expect(selectHomepage(prompts, NaN)).toEqual(selectHomepage(prompts, 0));
  });
  it("rotates hero and four or more lower cards across the current full deck cycle", () => {
    for (let counter = 0; counter < 144; counter++) {
      const current = selectHomepage(prompts, counter),
        next = selectHomepage(prompts, counter + 1);
      expect(current.hero?.id).not.toBe(next.hero?.id);
      expect(
        next.more.filter((p) => !ids(current.more).includes(p.id)).length,
      ).toBeGreaterThanOrEqual(4);
      expect(next.ids).toHaveLength(12);
      expect(new Set(next.ids).size).toBe(12);
      expect(
        new Set(
          [next.hero!, ...next.next, ...next.more].map(
            (p) => p.preview_image_url,
          ),
        ).size,
      ).toBe(12);
      expect([next.hero!, ...next.next].every((p) => p.is_featured)).toBe(true);
      expect(next).toEqual(selectHomepage([...prompts].reverse(), counter + 1));
    }
  });
  it("keeps page membership and lanes stable with fresh leading cards", () => {
    const baseline = orderExplore(prompts);
    for (let counter = 0; counter < 24; counter++) {
      const current = orderExplore(prompts, counter),
        next = orderExplore(prompts, counter + 1);
      expect(new Set(ids(next)).size).toBe(85);
      for (let start = 0; start < baseline.length; start += 24) {
        expect(ids(next.slice(start, start + 24)).sort()).toEqual(
          ids(baseline.slice(start, start + 24)).sort(),
        );
        if (start < 72)
          expect(
            next
              .slice(start, start + 8)
              .filter(
                (p) => !ids(current.slice(start, start + 8)).includes(p.id),
              ).length,
          ).toBeGreaterThanOrEqual(4);
        expect(
          next.slice(start, start + 24).map((p) => p.content_intent),
        ).toEqual(
          baseline.slice(start, start + 24).map((p) => p.content_intent),
        );
      }
    }
  });
  it("balances declared metadata without guessing identities and handles sparse pools", () => {
    expect(declaredSubjectGroup("Person")).toBe("unknown");
    expect(declaredSubjectGroup("Fashion model and garment")).toBe("unknown");
    expect(declaredSubjectGroup(" Young woman ")).toBe("woman");
    expect(selectHomepage([], 1).ids).toEqual([]);
    const p = eligibleDiscoveryPhotos(prompts).find((p) => p.is_featured)!;
    expect(
      selectHomepage([p, p, { ...p, id: "same-asset" }], 8).ids,
    ).toHaveLength(1);
    expect(orderExplore([p], 1)).toEqual([p]);
    const deck = diversityDeck(eligibleDiscoveryPhotos(prompts));
    expect(
      new Set(deck.slice(0, 8).map((p) => p.category_id)).size,
    ).toBeGreaterThanOrEqual(4);
    expect(
      new Set(deck.slice(0, 8).map((p) => declaredSubjectGroup(p.subject)))
        .size,
    ).toBeGreaterThanOrEqual(4);
    expect(
      new Set(deck.slice(0, 8).map((p) => p.style[0])).size,
    ).toBeGreaterThanOrEqual(4);
  });
});
