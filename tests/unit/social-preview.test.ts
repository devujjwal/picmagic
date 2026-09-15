import { describe, expect, it } from "vitest";
import { socialPreviewEnabled } from "@/lib/prompts/social-preview";
import prompts from "@/content/additions/social-prompts.json";
import { promptSchema } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
const local = {
  CONTENT_SOURCE: "seed",
  PICMAGIC_SOCIAL_PREVIEW: "true",
  NEXT_PUBLIC_INDEXING_ENABLED: "false",
};
describe("local social image review", () => {
  it("requires explicit local, noindex seed mode", () => {
    expect(socialPreviewEnabled(local)).toBe(true);
    for (const blocked of [
      { CONTENT_SOURCE: "supabase" },
      { NETLIFY: "true" },
      { CONTEXT: "production" },
      { CONTEXT: "deploy-preview" },
      { CI: "true" },
      { NEXT_PUBLIC_INDEXING_ENABLED: "true" },
      { PICMAGIC_SOCIAL_PREVIEW: "false" },
    ])
      expect(socialPreviewEnabled({ ...local, ...blocked })).toBe(false);
  });
  it("keeps the three complete records unpublished and identity-safe", () => {
    expect(prompts).toHaveLength(3);
    for (const raw of prompts) {
      const p = promptSchema.parse(raw);
      expect(personaIssues(p)).toEqual([]);
      expect(p.is_published).toBe(false);
      expect(p.is_indexable).toBe(false);
      expect(p.prompt_text).not.toBe(p.image_brief);
      expect(p.prompt_text).toContain("glasses and facial hair");
      expect(p.reference_contract?.identity_count).toBe(1);
    }
  });
});
