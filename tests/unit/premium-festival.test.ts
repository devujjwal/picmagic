import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { allPrompts, allCollections } from "@/content/catalog";
import records from "@/content/releases/premium-festival-approved-2026-10.json";
import provenance from "@/content/releases/premium-festival-provenance-2026-10.json";
import review from "../../docs/audits/festival-premium-2026-10-10/content-review.json";
import { promptSchema, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import { editorialIssues } from "@/lib/prompts/editorial";
import { posterDesigns } from "@/features/poster-maker/designs";
const hash = (data: string | Buffer) =>
  createHash("sha256").update(data).digest("hex");
describe("premium festival follow-up", () => {
  it("limits the scope to four reviewed updates and one distinct couple addition", () => {
    expect(records).toHaveLength(5);
    expect(review.filter((r) => r.kind === "refresh")).toHaveLength(4);
    expect(
      review.filter((r) => r.kind === "addition").map((r) => r.slug),
    ).toEqual(["dandiya-night-together"]);
    expect(allPrompts.filter((p) => !p.is_published)).toHaveLength(89);
    for (const raw of records) {
      const p = promptSchema.parse(raw);
      expect(allPrompts.find((x) => x.id === p.id)).toEqual(raw);
      expect(personaIssues(p)).toEqual([]);
      expect(editorialIssues(p)).toEqual([]);
      expect(review.find((r) => r.id === p.id)?.sha256).toBe(
        hash(p.prompt_text),
      );
      const evidence = provenance.find((r) => r.slug === p.slug)!;
      for (const asset of [evidence.preview, evidence.thumbnail])
        expect(hash(fs.readFileSync(`public${asset.path}`))).toBe(asset.sha256);
      expect(p.preview_image_url).toBe(evidence.preview.path);
    }
  });
  it("keeps the couple pose, reference contract and provider disclosure accurate", () => {
    const p = promptSchema.parse(
      records.find((p) => p.slug === "dandiya-night-together"),
    );
    expect(promptPath(p)).toBe("/ai-prompts/festival/dandiya-night-together");
    expect(p.prompt_text).toContain("four sticks total");
    expect(p.prompt_text).toContain("not full length");
    expect(p.prompt_text).toContain("actual ages");
    expect(p.prompt_text).not.toMatch(/15.?35|22.?30|younger appearance/);
    expect(
      p.faqs.some((f) => f.answer.includes("not independently verified")),
    ).toBe(true);
    expect(
      allCollections.find((c) => c.id === "indian-festivals")?.prompt_ids,
    ).toContain(p.id);
    expect(p.is_featured || p.is_trending).toBe(false);
  });
  it("uses separate text-free premium artwork for all editable designs", () => {
    for (const d of posterDesigns) {
      expect(d.artwork).toContain("-premium-art.webp");
      expect(fs.existsSync(`public${d.artwork}`)).toBe(true);
      const p = records.find((p) => p.id === d.templateId)!;
      expect(p.prompt_text).toContain("Generate the artwork only");
      expect(p.prompt_text).toContain(
        "never regenerate its artwork or lettering",
      );
      expect(p.preview_image_url).not.toBe(d.artwork);
    }
  });
});
