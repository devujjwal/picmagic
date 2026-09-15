import { describe, expect, it } from "vitest";
import records from "@/content/additions/giant-playlist-prompts.json";
import { allCollections, allPrompts } from "@/content/catalog";
import { personaIssues } from "@/lib/prompts/persona";
import { socialPreviewIds } from "@/lib/prompts/social-preview";
import { promptSchema, promptPath } from "@/types/content";

describe("giant playlist user-requested draft", () => {
  it("keeps requested styling, explicit hair preservation and appropriate discovery metadata", () => {
    const p = promptSchema.parse(records[0]);
    expect(personaIssues(p)).toEqual([]);
    expect(promptPath(p)).toBe(
      "/ai-prompts/social-media/standing-on-my-playlist",
    );
    expect(allPrompts.filter((x) => x.slug === p.slug)).toHaveLength(1);
    expect(
      allCollections
        .filter((c) => c.prompt_ids.includes(p.id))
        .map((c) => c.slug),
    ).toEqual(["studio"]);
    for (const term of [
      "iPhone 16 Pro",
      "Spotify",
      "AirPods Max",
      "Air Jordan",
      "preserve the reference hairstyle",
      "fictional playlist/track labels",
      "outside the screen",
    ])
      expect(p.prompt_text).toContain(term);
    expect(p.reference_contract).toMatchObject({
      identity_count: 1,
      depiction_count: 1,
      reference_age: "adult-required",
    });
    expect(p.prompt_text).toContain("No extra people");
    expect(p.image_brief).not.toBe(p.prompt_text);
    expect(p.is_published && p.is_indexable).toBe(true);
    expect(p.is_featured).toBe(false);
    expect(socialPreviewIds.has(p.id)).toBe(true);
    expect(p.preview_review_status).toBe("approved");
  });
});
