import releaseReview from "../../docs/releases/2026-09-11/content-review.json";
import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  TemplatePromptProvider,
  type GeneratorInput,
} from "@/features/generator/provider";
import prompts from "@/content/prompts.json";
import review from "../../docs/audits/library-2026-09/editorial-audit.json";
const provider = new TemplatePromptProvider();
const input: GeneratorInput = {
  subject: "Woman",
  style: "Natural",
  background: "Garden",
  outfit: "Tailored suit",
  lighting: "Soft Studio",
  framing: "Full Body",
  aspect_ratio: "4:5",
};
describe("preview fidelity", () => {
  it("covers every published preview with a reviewed prompt and essential details", () => {
    expect(
      review.records.filter((r) => prompts.some((p) => p.id === r.id)),
    ).toHaveLength(prompts.length);
    for (const p of prompts) {
      const r = releaseReview.records.find((r) => r.id === p.id)!;
      expect(r.slug).toBe(p.slug);
      expect(createHash("sha256").update(p.prompt_text).digest("hex")).toBe(
        r.sha256,
      );
      expect(p.prompt_text).toContain("CREATIVE DIRECTION:");
      expect(p.image_brief).not.toBe(p.prompt_text);
      if (p.is_published) expect(p.preview_review_status).toBe("approved");
      expect(p.faqs.some((f) => f.question.includes("leaves out"))).toBe(true);
    }
  });
  it("keeps the Krishna reference identity, tilak, hair, smile and unobstructed framing explicit", () => {
    const p = prompts.find((p) => p.slug === "tiny-krishna-big-wonder")!;
    for (const essential of [
      "identity",
      "hairline",
      "tilak",
      "narrow U",
      "reddish vertical line",
      "loose curls",
      "playful closed-mouth smile",
      "Tilt the head",
      "Exactly one upright peacock feather",
      "both hands",
      "above the feather",
    ])
      expect(p.prompt_text).toContain(essential);
    expect(p.framing).not.toContain("half-body");
  });
  it("uses product-specific fidelity instead of human boilerplate", () => {
    for (const p of prompts.filter((p) => p.subject === "Product")) {
      expect(p.prompt_text).toMatch(/preserve its exact shape/);
      expect(p.prompt_text).not.toMatch(
        /skin texture|facial identity|believable hands/,
      );
    }
  });
  it("synchronizes specific reel actions and keeps the hold inside the selected duration", () => {
    for (const p of prompts.filter((p) => p.reel)) {
      const reel = p.reel!;
      expect(reel.scenes[0].start).toBe(0);
      expect(reel.scenes.at(-1)?.end).toBe(reel.duration);
      expect(
        reel.scenes.reduce((total, s, i) => {
          if (i) expect(s.start).toBe(reel.scenes[i - 1].end);
          expect(p.prompt_text).toContain(s.action);
          return total + s.end - s.start;
        }, 0),
      ).toBe(reel.duration);
      expect(reel.hook).toBeTruthy();
      expect(reel.progression).toBeTruthy();
      expect(reel.payoff).toBeTruthy();
      expect(p.prompt_text).not.toContain(
        "subject begins a small natural movement",
      );
    }
  });
});
describe("generator fidelity", () => {
  it("keeps essential appearance instructions when shortened", () => {
    const generated = provider.generatePhotoPrompt({
      ...input,
      identity: true,
    });
    const shortened = provider.improvePrompt(generated, "shorten");
    for (const essential of [
      "hair part",
      "expression",
      "spectacles",
      "bindi or tilak",
      "Do not invent a religious mark",
      "aspect ratio: 4:5",
      "facial identity",
    ])
      expect(shortened.text).toContain(essential);
    expect(shortened.text.length).toBeLessThan(generated.text.length);
  });
  it.each([
    "Change Background",
    "Improve Lighting",
    "Restore Old Photo",
  ] as const)("does not restage a scoped %s edit", (improvement) => {
    const { text } = provider.generatePhotoEditPrompt({
      ...input,
      improvement,
    });
    expect(text).not.toContain("Create a natural photograph");
    expect(text).not.toContain("tailored suit");
    expect(text).not.toContain("attention directed slightly beyond");
    expect(text).toContain("original expression, pose, outfit and background");
    expect(text).toContain("bindi or tilak");
  });
  it("allows a hairstyle change without replacing face or unrelated details", () => {
    const { text } = provider.generatePhotoEditPrompt({
      ...input,
      improvement: "Hairstyle Ideas",
    });
    expect(text).toContain("Change only the hairstyle");
    expect(text).not.toContain("lips, hairstyle, skin tone");
    expect(text).toContain("unless a requested direction explicitly changes");
  });
  it("keeps product edit and reel directions free of human preservation instructions", () => {
    for (const result of [
      provider.generatePhotoEditPrompt({
        ...input,
        subject: "Product",
        improvement: "Product Background",
      }),
      provider.generateReelPrompt({ ...input, subject: "Product" }),
    ]) {
      expect(result.text).toContain("label");
      expect(result.text).not.toMatch(
        /facial|hairstyle|bindi|original expression/,
      );
    }
  });
});
