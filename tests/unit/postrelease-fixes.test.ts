import { describe, expect, it } from "vitest";
import {
  TemplatePromptProvider,
  type GeneratorInput,
} from "@/features/generator/provider";
import {
  generateFriendsTrip,
  friendsTripDefaults,
} from "@/features/generator/friends-trip";
import { allPrompts, allCollections } from "@/content/catalog";
import { hubGuides, promptGuides } from "@/content/seo-guides";
import patch from "../../docs/audits/postrelease-fixes-2026-10-05/database-patch.json";
const provider = new TemplatePromptProvider();
const input: GeneratorInput = {
  subject: "Woman",
  style: "Natural",
  background: "Garden",
  outfit: "Tailored suit",
  lighting: "Soft Studio",
  framing: "Half Body",
  aspect_ratio: "4:5",
};
const find = (slug: string) => allPrompts.find((p) => p.slug === slug)!;
describe("post-release utility output", () => {
  it.each(["photo", "lighting", "reel", "friends"])(
    "preserves default source age and identity in %s",
    (flow) => {
      const result =
        flow === "photo"
          ? provider.generatePhotoPrompt(input)
          : flow === "lighting"
            ? provider.generatePhotoEditPrompt({
                ...input,
                improvement: "Improve Lighting",
              })
            : flow === "reel"
              ? provider.generateReelPrompt(input)
              : generateFriendsTrip(friendsTripDefaults);
      expect(result.text).toContain(
        "preserve every supplied person's apparent age",
      );
      expect(result.text).not.toMatch(/22–30|regardless of the reference/);
      expect(result.text.match(/(?<!NO )REFERENCE PRESENT:/g)).toHaveLength(1);
      for (const safeguard of [
        "facial identity",
        "eye geometry",
        "skin tone",
        "ethnicity",
        "hairline",
        "distinct identities",
        "child or teenager",
      ])
        expect(result.text).toContain(safeguard);
    },
  );
  it.each(["Adult", "Older adult"] as const)(
    "honours explicit %s transformation only in creative flows",
    (age_group) => {
      for (const text of [
        provider.generatePhotoPrompt({ ...input, age_group }).text,
        provider.generateReelPrompt({ ...input, age_group }).text,
      ]) {
        expect(text).toContain(
          "explicitly selected creative age transformation",
        );
        expect(text).toContain(age_group === "Adult" ? "22–30" : "60–75");
        expect(text).not.toContain("Do not rejuvenate or age anyone");
      }
      const edit = provider.generatePhotoEditPrompt({
        ...input,
        age_group,
        improvement: "Improve Lighting",
      }).text;
      expect(edit).toContain("Do not rejuvenate or age anyone");
      expect(edit).not.toContain("creative age transformation");
    },
  );
  it.each(["photo", "lighting"])(
    "shortens %s substantively without losing constraints or repeated refinements",
    (flow) => {
      const result =
        flow === "photo"
          ? provider.generatePhotoPrompt(input)
          : provider.generatePhotoEditPrompt({
              ...input,
              improvement: "Improve Lighting",
            });
      const short = provider.improvePrompt(result, "shorten");
      expect(short.text.length).toBeLessThan(result.text.length * 0.85);
      for (const safeguard of [
        "facial identity",
        "eye geometry",
        "skin tone",
        "ethnicity",
        "hairline",
        "apparent age",
        "NO REFERENCE PRESENT:",
        "hair part",
        "spectacles",
        "bindi or tilak",
        "held objects",
        "Do not invent a religious mark",
      ])
        expect(short.text).toContain(safeguard);
      if (flow === "photo")
        for (const selection of [
          "garden",
          "tailored suit",
          "half body",
          "soft studio",
          "4:5",
          "85mm",
          "beyond the camera",
        ])
          expect(short.text).toContain(selection);
      else
        for (const constraint of [
          "exposure and white balance",
          "Lighting direction: Soft Studio",
          "source aspect ratio",
          "do not invent unseen body parts",
          "original expression, pose, outfit and background",
        ])
          expect(short.text).toContain(constraint);
      expect(provider.improvePrompt(short, "shorten")).toEqual(short);
      expect(provider.improvePrompt(short, "identity")).toEqual(short);
      expect(short.text.match(/(?<!NO )REFERENCE PRESENT:/g)).toHaveLength(1);
    },
  );
  it("retains unknown specific constraints during shortening", () => {
    const text =
      "Keep a violet scarf and exactly two shells. No added person. Frame the left hand within 3:4. Preserve a distinctive scar and source age.";
    expect(provider.improvePrompt({ text }, "shorten").text).toBe(text);
  });
});
describe("precise content corrections", () => {
  it("compares the three actual professional cards", () => {
    const body = hubGuides["/ai-prompts/professional"].sections
      .map((s) => s.body)
      .join(" ");
    for (const title of [
      "Your Next Chapter in Focus",
      "A Headshot That Feels Like You",
      "Your Everyday with Better Light",
    ])
      expect(body).toContain(title);
    expect(body).not.toContain("Quiet Confidence");
  });
  it("maps repairs onto the existing asymmetric regions", () => {
    const worlds =
      promptGuides["one-day-four-possible-worlds"].sections.at(-1)!.body;
    for (const region of [
      "dominant left portrait",
      "curved right-side",
      "observer",
      "pottery",
      "traveller",
      "original curved boundaries",
    ])
      expect(worlds).toContain(region);
    expect(worlds).not.toMatch(/top-left|bottom-right|grid boundaries/);
    const saree =
      promptGuides["one-saree-three-campaign-worlds"].sections.at(-1)!.body;
    for (const region of [
      "dominant left basalt courtyard",
      "right-side",
      "glass pavilion",
      "sculptural studio",
      "boundaries",
    ])
      expect(saree).toContain(region);
    expect(saree).not.toContain("centre");
  });
  it("aligns both hairstyle cards without changing the already fixed prompt", () => {
    const p = find("golden-hour-draped-in-tradition");
    for (const field of [p.camera, p.framing])
      expect(field).toContain(
        "leave space around the selected hairstyle and jasmine",
      );
    expect(p.prompt_text).toContain(
      "only when the reference hair is long enough",
    );
    expect(p.prompt_text).toContain("small pinned arrangement");
  });
  it("copies both outfit branches without demanding unseen lower body", () => {
    const text = find("an-outfit-with-a-new-perspective").prompt_text;
    expect(text).toContain(
      "For a waist-up source, edit the blazer/blouse only",
    );
    expect(text).toContain(
      "trousers and waistband are included only where visible in the source",
    );
    expect(text).toContain("preserve the source aspect ratio and framing");
    expect(text).toContain("Preserve identity, age, skin tone");
  });
  it("festival promises correspond to four unchanged photo entries including one child concept", () => {
    const c = allCollections.find((c) => c.slug === "indian-festivals")!;
    const members = c.prompt_ids.map((id) =>
      allPrompts.find((p) => p.id === id)!,
    );
    expect(members).toHaveLength(4);
    expect(
      members.every((p) => p.is_published && p.prompt_type === "photo"),
    ).toBe(true);
    expect(members.filter((p) => p.subject === "Kid")).toHaveLength(1);
    const body = hubGuides["/collections/indian-festivals"].sections
      .map((s) => s.body)
      .join(" ");
    expect(body).toContain("four photo ideas");
    expect(body).not.toMatch(/includes child and reel|still or motion/);
    expect(c.description).not.toMatch(/reel|motion/);
  });
  it("limits database patch to exactly two records and reviewed fields", () => {
    expect(patch).toHaveLength(2);
    for (const r of patch) {
      expect(r.table).toBe("prompts");
      // Seed timestamps retain their editorial provenance; SQL guards use the
      // independently observed live timestamp. All substantive guards match.
      const seedGuard = Object.fromEntries(
        Object.entries(r.guard).filter(([key]) => key !== "updated_at"),
      );
      expect(find(r.guard.slug)).toMatchObject({ ...seedGuard, ...r.after });
      expect(Date.parse(r.guard.updated_at as string)).not.toBeNaN();
      expect(
        Object.keys(r.after).every((k) =>
          ["framing", "camera", "prompt_text"].includes(k),
        ),
      ).toBe(true);
    }
  });
});
