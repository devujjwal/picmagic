import { describe, expect, it } from "vitest";
import { allPrompts } from "@/content/catalog";
import drafts from "@/content/additions/double-exposure-fashion-prompts.json";
import { promptSchema, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import { editorialIssues } from "@/lib/prompts/editorial";

describe("user-requested double-exposure gender variants", () => {
  it("keeps both category routes and the two-depiction identity contract", () => {
    expect(drafts.map((p) => p.category_id)).toEqual(["men", "women"]);
    for (const raw of drafts) {
      const p = promptSchema.parse(raw);
      expect(allPrompts.filter((x) => x.id === p.id)).toHaveLength(1);
      expect(allPrompts.filter((x) => x.slug === p.slug)).toHaveLength(1);
      expect(promptPath(p)).toBe(`/ai-prompts/${p.category_id}/${p.slug}`);
      expect(personaIssues(p)).toEqual([]);
      expect(editorialIssues(p)).toEqual([]);
      expect(p.reference_contract).toMatchObject({
        identity_count: 1,
        depiction_count: 2,
        reference_age: "adult-required",
      });
      expect(p.prompt_text).toContain(
        "two intentional depictions of the same person",
      );
      expect(p.prompt_text).not.toMatch(
        /100%|flawless skin|elegant feminine features/,
      );
      expect(p.prompt_text).toContain("do not invent long hair");
      expect(p.is_published && p.is_indexable).toBe(true);
      expect(p.is_featured).toBe(false);
    }
  });
  it("keeps the same composition in both versions without reusing preview identity", () => {
    const scenes = drafts.map(
      (p) =>
        p.prompt_text.split("CREATIVE DIRECTION: ")[1].split("\n\nWARDROBE")[0],
    );
    expect(scenes[0]).toBe(scenes[1]);
    for (const p of drafts) {
      expect(p.prompt_text).toContain("Never lighten, darken, de-age");
      expect(p.image_brief).not.toBe(p.prompt_text);
      expect(p.image_brief).toContain("entirely fictional Indian");
      expect(p.prompt_text).toContain(
        "The category controls styling, never the uploaded person’s identity",
      );
    }
  });
});
