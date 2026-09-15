import { describe, expect, it } from "vitest";
import drafts from "@/content/additions/katana-streetwear-prompts.json";
import { allCollections, allPrompts } from "@/content/catalog";
import { promptSchema, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import { socialPreviewIds } from "@/lib/prompts/social-preview";

describe("katana studio fashion draft", () => {
  it("preserves identity and build while recording exactly the relevant local memberships", () => {
    const p = promptSchema.parse(drafts[0]);
    expect(personaIssues(p)).toEqual([]);
    expect(p.category_id).toBe("men");
    expect(promptPath(p)).toBe("/ai-prompts/men/katana-in-the-square-of-light");
    expect(allPrompts.filter((x) => x.slug === p.slug)).toHaveLength(1);
    expect(
      allCollections
        .filter((c) => c.prompt_ids.includes(p.id))
        .map((c) => c.slug)
        .sort(),
    ).toEqual(["cinematic", "studio"]);
    expect(p.prompt_text).toContain("rather than forcing an athletic physique");
    expect(p.prompt_text).toContain(
      "without twisting the neck or torso unnaturally",
    );
    expect(p.prompt_text).toContain(
      "One hand holds a traditional Japanese katana",
    );
    expect(p.prompt_text).toContain("bright white SQUARE softbox");
    expect(p.prompt_text).not.toContain("--ar");
    expect(p.reference_contract).toMatchObject({
      identity_count: 1,
      depiction_count: 1,
      reference_age: "adult-required",
    });
    expect(p.is_published || p.is_indexable || p.is_featured).toBe(false);
    expect(socialPreviewIds.has(p.id)).toBe(true);
    expect(p.preview_review_status).toBe("approved");
  });
});
