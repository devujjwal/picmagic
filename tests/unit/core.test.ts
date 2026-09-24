import { describe, it, expect } from "vitest";
import {
  interpolate,
  TemplatePromptProvider,
  identityInstruction,
  inputSchema,
} from "@/features/generator/provider";
import {
  searchPrompts,
  relatedPrompts,
  slugify,
  activeCollection,
} from "@/lib/prompts/discovery";
import { promptSchema, promptPath } from "@/types/content";
import { brandedTitle, metadata, jsonLd } from "@/lib/seo/metadata";
import data from "@/content/prompts.json";
const prompts = data.map((p) => promptSchema.parse(p));
const base = {
  subject: "Woman" as const,
  style: "Natural" as const,
  background: "Garden" as const,
  outfit: "Keep original outfit" as const,
  lighting: "Golden Hour" as const,
  framing: "Half Body" as const,
  aspect_ratio: "4:5" as const,
};
const provider = new TemplatePromptProvider();
describe("safe interpolation", () => {
  it("substitutes literal values without interpreting code", () => {
    expect(interpolate("Hello {{subject}}", { subject: "$& <script>" })).toBe(
      "Hello $& <script>",
    );
  });
  it("rejects absent and inherited variables", () => {
    expect(() => interpolate("{{subject}}", {})).toThrow("Missing");
    expect(() => interpolate("{{constructor}}", {})).toThrow("Missing");
  });
});
describe("template providers", () => {
  it("produces a usable photo prompt and distinct variants", () => {
    const a = provider.generatePhotoPrompt(base);
    const b = provider.generatePhotoPrompt({ ...base, variant: 1 });
    expect(a.text).toContain("4:5");
    expect(a.text).not.toBe(b.text);
    expect(a.text).not.toContain("{{");
  });
  it("preserves identity for editing", () => {
    expect(
      provider.generatePhotoEditPrompt({
        ...base,
        improvement: "Improve Lighting",
      }).text,
    ).toContain(identityInstruction);
  });
  it("avoids human instructions for products", () => {
    const t = provider.generatePhotoPrompt({
      ...base,
      subject: "Product",
      identity: true,
    }).text;
    expect(t).toContain("geometry");
    expect(t).not.toContain("skin texture");
    expect(t).not.toContain("facial identity");
  });
  it("hairstyle editing does not freeze the hairstyle", () => {
    expect(
      provider.generatePhotoEditPrompt({
        ...base,
        improvement: "Hairstyle Ideas",
      }).text,
    ).not.toContain("hairstyle, skin tone");
  });
  it.each([5, 10, 15, 30] as const)(
    "fits scenes exactly into %i seconds",
    (duration) => {
      const r = provider.generateReelPrompt({ ...base, duration });
      expect(r.scenes?.[0].start).toBe(0);
      expect(r.scenes?.at(-1)?.end).toBe(duration);
      expect(r.scenes?.reduce((n, s) => n + s.end - s.start, 0)).toBe(duration);
      r.scenes?.forEach((s, i) => {
        expect(s.end).toBeGreaterThan(s.start);
        if (i) expect(s.start).toBe(r.scenes![i - 1].end);
      });
    },
  );
  it("refinements are idempotent", () => {
    const a = provider.improvePrompt(
      provider.generatePhotoPrompt(base),
      "realistic",
    );
    expect(provider.improvePrompt(a, "realistic")).toEqual(a);
  });
  it("rejects invalid selections", () => {
    expect(inputSchema.safeParse({ ...base, duration: 999 }).success).toBe(
      false,
    );
  });
});
describe("discovery and routes", () => {
  it("has exactly 50 validated records and unique canonical routes", () => {
    expect(prompts).toHaveLength(50);
    expect(new Set(prompts.map(promptPath)).size).toBe(50);
    expect(
      prompts.every((p) => !promptPath(p).startsWith("/collections/")),
    ).toBe(true);
  });
  it("matches multiple search fields", () => {
    expect(searchPrompts(prompts, "couple rain").length).toBeGreaterThan(0);
    expect(searchPrompts(prompts, "birthday kid").length).toBeGreaterThan(0);
    expect(searchPrompts(prompts, "linkedin").length).toBeGreaterThan(0);
    expect(searchPrompts(prompts, "nonexistentxyz")).toEqual([]);
  });
  it("related selection excludes current and unpublished records", () => {
    const current = prompts[1];
    const related = relatedPrompts(current, [
      ...prompts,
      ...prompts,
      { ...prompts[0], id: "hidden", is_published: false },
    ]);
    expect(related.some((p) => p.id === current.id || p.id === "hidden")).toBe(
      false,
    );
    expect(new Set(related.map((p) => p.id)).size).toBe(related.length);
  });
  it("makes safe slugs", () => {
    expect(slugify("Café — A New Look!")).toBe("cafe-a-new-look");
  });
  it("seasonal dates use India calendar day", () => {
    const c = {
      id: "diwali",
      slug: "diwali",
      name: "Diwali",
      description: "x",
      kind: "seasonal" as const,
      prompt_ids: [],
      is_indexable: false,
      active: true,
      start_date: "2026-09-11",
      end_date: "2026-09-11",
      priority: 1,
      featured_image: "",
    };
    expect(activeCollection(c, new Date("2026-09-10T20:00:00Z"))).toBe(true);
    expect(activeCollection({ ...c, start_date: null }, new Date())).toBe(
      false,
    );
  });
});
describe("SEO", () => {
  it("uses one canonical host", () => {
    expect(
      metadata("Title", "Description", "/collections/romantic").alternates
        ?.canonical,
    ).toBe("https://picmagic.in/collections/romantic");
  });
  it("normalizes brand suffixes and allows large image previews", () => {
    expect(brandedTitle("Creative transformations | PicMagic")).toBe(
      "Creative transformations | PicMagic",
    );
    expect(brandedTitle("Creative transformations")).toBe(
      "Creative transformations | PicMagic",
    );
    expect(metadata("Title", "Description", "/").robots).toMatchObject({
      googleBot: { "max-image-preview": "large" },
    });
  });
  it("escapes script-breaking markup in structured data", () => {
    expect(
      jsonLd({ name: "</script><script>alert(1)</script>" }),
    ).not.toContain("<");
  });
});
