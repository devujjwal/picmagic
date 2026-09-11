import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { allPrompts } from "@/content/catalog";
import { promptSchema } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import { PromptCard } from "@/components/prompts/prompt-card";
import { TemplatePromptProvider } from "@/features/generator/provider";
const get = (slug: string) =>
  promptSchema.parse(allPrompts.find((p) => p.slug === slug));
describe("creative reference contracts", () => {
  it("distinguishes one identity from four intentional depictions", () => {
    const p = get("one-day-four-possible-worlds");
    expect(p.reference_contract).toMatchObject({
      identity_count: 1,
      depiction_count: 4,
    });
    expect(personaIssues(p)).toEqual([]);
    expect(
      personaIssues({
        ...p,
        prompt_text: p.prompt_text.replaceAll(
          "intentional depictions",
          "different people",
        ),
      }),
    ).not.toEqual([]);
  });
  it("keeps artistic palettes compatible with identity instead of photographic pigment", () => {
    for (const slug of [
      "portrait-cut-from-monsoon-paper",
      "last-train-two-ink-portrait",
    ]) {
      const p = get(slug);
      expect(p.reference_contract?.medium).toBe("artistic-palette");
      expect(p.prompt_text).toContain(
        "artistic pigment is not literal photographic skin colour",
      );
      expect(
        personaIssues({
          ...p,
          reference_contract: {
            ...p.reference_contract!,
            medium: "photographic",
          },
        }),
      ).not.toEqual([]);
    }
  });
  it("requires reference-supported garment views separately from the model", () => {
    const p = get("one-saree-three-campaign-worlds");
    expect(p.reference_contract).toMatchObject({
      identity_count: 1,
      depiction_count: 3,
      product_views: "reference-supported",
    });
    expect(p.prompt_text).toContain("Do not invent unseen construction");
    expect(
      personaIssues({
        ...p,
        reference_contract: {
          ...p.reference_contract!,
          product_views: "not-applicable",
        },
      }),
    ).not.toEqual([]);
  });
  it("preserves uncropped wide 3:4 cards", () => {
    const { container } = render(
      <PromptCard prompt={get("one-day-four-possible-worlds")} />,
    );
    expect(container.querySelector("article")).toHaveClass("prompt-card-wide");
    expect(container.querySelector(".card-image")).toHaveStyle({
      aspectRatio: "1080 / 1440",
    });
  });
  it("does not lose creative actions through shortening or add people to product refinement", () => {
    const provider = new TemplatePromptProvider();
    const p = get("perfume-the-water-sculpture");
    const short = provider.improvePrompt({ text: p.prompt_text }, "shorten");
    expect(short.text).toBe(p.prompt_text.replace(/\s+/g, " ").trim());
    expect(provider.improvePrompt(short, "identity").text).not.toContain(
      "facial identity",
    );
  });
  it("narrow edits keep source crop unless recrop is explicitly requested", () => {
    const provider = new TemplatePromptProvider();
    const input = {
      subject: "Woman" as const,
      style: "Natural" as const,
      background: "Garden" as const,
      outfit: "Everyday casual" as const,
      lighting: "Soft Studio" as const,
      framing: "Portrait" as const,
      aspect_ratio: "4:5" as const,
      improvement: "Improve Lighting" as const,
    };
    expect(provider.generatePhotoEditPrompt(input).text).toContain(
      "Preserve the source aspect ratio and original crop",
    );
    expect(
      provider.generatePhotoEditPrompt({ ...input, recrop: true }).text,
    ).toContain("Recrop to 4:5 only as explicitly requested");
  });
});
