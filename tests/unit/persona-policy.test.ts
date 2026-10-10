import { describe, it, expect } from "vitest";
import { allPrompts, allCollections } from "@/content/catalog";
import {
  PERSONA_POLICY_VERSION,
  AUTHORING_PERSONA_POLICY_VERSION,
  personaIssues,
  personaPreamble,
} from "@/lib/prompts/persona";
import {
  composePreviewGenerationPrompt,
  PREVIEW_GENERATION_POLICY_VERSION,
} from "@/lib/prompts/preview-generation-policy";
import { promptPath, promptSchema } from "@/types/content";
import { TemplatePromptProvider } from "@/features/generator/provider";
import existing from "@/content/prompts.json";
import expansion from "@/content/expansion/prompts.json";

describe("reference and preview persona separation", () => {
  it("validates all existing and new content without mixing preview demographics into copyable scenes", () => {
    for (const raw of allPrompts) {
      const p = promptSchema.parse(raw);
      expect(personaIssues(p), p.slug).toEqual([]);
      expect(p.image_brief, p.slug).not.toBe(p.prompt_text);
      if (
        p.persona_policy === "person" ||
        p.persona_policy === "person-and-product"
      ) {
        expect(p.prompt_text).toContain("REFERENCE PRESENT:");
        expect(p.prompt_text).toContain("ethnicity");
        expect(p.prompt_text).toContain("hairline");
        expect(p.prompt_text).toContain("NO REFERENCE PRESENT:");
        if (p.generation_mode === "reference-required")
          expect(p.prompt_text).toContain("Stop and ask for reference photos");
        else expect(p.prompt_text).toContain("Indian/South Asian");
      }
    }
  });
  it("keeps an Indian couple's reference identity instead of prescribing African or Indian preview faces", () => {
    const p = existing.find((p) => p.slug === "barefoot-at-blue-hour")!;
    expect(p.prompt_text).not.toMatch(
      /African couple|dark-skinned African|Create a photograph of an? Indian couple/,
    );
    expect(p.prompt_text).toContain(
      "The attached person/persons are authoritative",
    );
    expect(p.prompt_text).toContain("their individual skin tones");
    expect(p.prompt_text).toContain("visible bare feet");
  });
  it("permits Krishna hair transformation without losing facial identity or the tilak", () => {
    const p = existing.find((p) => p.slug === "tiny-krishna-big-wonder")!;
    expect(p.prompt_text).toContain("hairstyle transformation is essential");
    expect(p.prompt_text).toContain("may change the original hairstyle");
    expect(p.prompt_text).toContain(
      "preserving the hairline, hair colour and recognizable facial identity",
    );
    expect(p.prompt_text).toContain("narrow U");
    expect(p.prompt_text).toContain(
      "do not replace the tilak with a round dot",
    );
  });
  it("rejects publication rules without a separate preview brief or with demographic overrides", () => {
    const valid = promptSchema.parse(existing[8]);
    expect(personaIssues({ ...valid, image_brief: "" })).not.toEqual([]);
    expect(
      personaIssues({
        ...valid,
        prompt_text:
          valid.prompt_text + " Create a photograph of an African couple.",
      }),
    ).not.toEqual([]);
    expect(
      personaIssues({
        ...valid,
        prompt_text: "Create an Indian couple wearing linen.",
      }),
    ).not.toEqual([]);
  });
  it("separates commercially advertised product identity from the model", () => {
    for (const p of expansion.filter(
      (p) => p.persona_policy === "person-and-product",
    )) {
      expect(p.prompt_text).toContain("PRODUCT REFERENCE:");
      expect(p.prompt_text).toContain("existing logos");
      expect(p.prompt_text).toContain(
        "Keep model/person identity separate from product identity",
      );
    }
    expect(personaPreamble("product", "Product")).not.toContain(
      "Indian/South Asian",
    );
  });
  it("keeps subject-appropriate framing and continuous reel actions", () => {
    for (const p of expansion.filter((p) =>
      ["product", "animal"].includes(p.persona_policy),
    )) {
      expect(p.prompt_text, p.slug).not.toContain("use natural hands");
      expect(p.prompt_text, p.slug).not.toContain(
        "Keep faces, defining clothing",
      );
    }
    const founder = expansion.find(
      (p) => p.slug === "founder-after-hours-reel",
    )!;
    expect(founder.prompt_text).toContain("closed notebook");
    expect(founder.prompt_text).not.toContain("closes the notebook once");
    const book = expansion.find((p) => p.slug === "the-bookshop-detour-reel")!;
    expect(book.prompt_text).toContain("already in the person’s hands");
    const shoes = expansion.find(
      (p) => p.slug === "footwear-the-city-in-one-step",
    )!;
    expect(shoes.prompt_text).toContain("face need not be in crop");
  });
  it("gives every requested collection four distinct concepts and a single canonical path per record", () => {
    const collections = allCollections.filter((c) => c.priority === 20);
    expect(collections).toHaveLength(31);
    for (const c of collections) {
      expect(new Set(c.prompt_ids).size).toBeGreaterThanOrEqual(4);
      expect(c.description.length).toBeGreaterThan(100);
    }
    const paths = allPrompts.map((p) => promptPath(promptSchema.parse(p)));
    expect(new Set(paths).size).toBe(allPrompts.length);
    expect(paths.every((p) => !p.startsWith("/collections/"))).toBe(true);
  });
  it("keeps the reusable creator reference-first even when the old identity toggle is off", () => {
    const provider = new TemplatePromptProvider();
    const result = provider.generatePhotoPrompt({
      subject: "Woman",
      style: "Korean drama",
      background: "City street",
      outfit: "Everyday casual",
      lighting: "Soft Studio",
      framing: "Portrait",
      aspect_ratio: "4:5",
      identity: false,
    });
    expect(result.text).toContain(
      "Preserve every person's recognizable facial identity",
    );
    expect(result.text).toContain(
      "preserve every supplied person's apparent age",
    );
    expect(result.text).not.toContain("22–30");
    expect(result.text).toContain("NO REFERENCE PRESENT:");
    expect(result.text).not.toContain("lips, hairstyle, skin tone");
  });
  it("preserves actual reference age for new authoring while retaining historical v2", () => {
    const preamble = personaPreamble("person", "adult woman");
    expect(PERSONA_POLICY_VERSION).toBe("identity-expression-age-v2");
    expect(AUTHORING_PERSONA_POLICY_VERSION).toBe(
      "reference-first-india-default-v1",
    );
    expect(preamble).toContain("actual age");
    expect(preamble).not.toContain("22–30");
    expect(preamble).toContain("creative direction controls emotion");
    expect(
      personaIssues({
        persona_policy: "person",
        persona_version: AUTHORING_PERSONA_POLICY_VERSION,
        prompt_text: preamble + "A cobalt studio fashion portrait.",
        image_brief: "Private adult reference pool.",
      }),
    ).toEqual([]);

    const composed = composePreviewGenerationPrompt({
      identityRole: "female",
      referenceAssetId: "private-female-reference",
      explicitAge: null,
      mood: "serious editorial",
      expression: "neutral, composed gaze with closed lips",
      scenePrompt: "A cobalt studio fashion portrait.",
      outputRequirements: "One 4:5 image.",
    });
    expect(PREVIEW_GENERATION_POLICY_VERSION).toBe(
      "preview-reference-age-preserved-v2",
    );
    expect(composed).toContain("identity and actual age");
    expect(composed).not.toContain("22–30");
    expect(composed).toContain("neutral, composed gaze with closed lips");
    expect(composed).not.toContain("smiling reference");
  });
  it("rejects age overrides for references and supports intact couple identities", () => {
    const input = {
      identityRole: "couple" as const,
      referenceAssetId: "private-couple",
      mood: "warm",
      expression: "relaxed",
      scenePrompt: "Courtyard celebration",
      outputRequirements: "4:5",
    };
    expect(() =>
      composePreviewGenerationPrompt({ ...input, explicitAge: "25" }),
    ).toThrow("Age overrides");
    expect(composePreviewGenerationPrompt(input)).toContain(
      "never combine solo identities",
    );
  });
});
