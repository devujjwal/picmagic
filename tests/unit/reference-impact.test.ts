import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { allPrompts, allCollections } from "@/content/catalog";
import { promptSchema, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import prompts from "@/content/additions/reference-impact-prompts.json";
import candidates from "../../docs/audits/reference-impact-2026-09-15/candidates.json";
import manifest from "../../docs/audits/reference-impact-2026-09-15/generation-manifest.json";
import baseline from "../../docs/audits/reference-impact-2026-09-15/current-library.json";
import {
  socialPreviewEnabled,
  socialPreviewMemberships,
} from "@/lib/prompts/social-preview";
vi.mock("server-only", () => ({}));
import { SeedRepository } from "@/lib/content";

describe("Reference-inspired local expansion", () => {
  it("preserves every existing record and requires three traceable comparisons per candidate", () => {
    expect(baseline).toHaveLength(177);
    for (const { source_file: sourceFile, ...p } of baseline) {
      expect(sourceFile).toMatch(/^content\//);
      expect(
        allPrompts.find((x) => x.id === p.id),
        p.slug,
      ).toEqual(p);
    }
    expect(candidates).toHaveLength(15);
    for (const c of candidates) {
      expect(new Set(c.nearest_existing).size).toBe(3);
      for (const slug of c.nearest_existing)
        expect(baseline.some((p) => p.slug === slug)).toBe(true);
      if (c.decision === "shortlist") {
        for (const score of [
          c.scores.distinctiveness,
          c.scores.novelty,
          c.scores.shareability,
          c.scores.mobile_impact,
        ])
          expect(score).toBeGreaterThanOrEqual(4);
      }
    }
    const paths = allPrompts.map((p) => promptPath(promptSchema.parse(p)));
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("ships only inspected original assets with separate persona contracts", async () => {
    expect(prompts).toHaveLength(5);
    for (const raw of prompts) {
      const p = promptSchema.parse(raw),
        m = manifest.find((x) => x.content_id === p.id)!;
      expect(personaIssues(p), p.slug).toEqual([]);
      expect(m.accepted).toBe(true);
      expect(m.generation_provenance.reference_uploads).toEqual([]);
      expect(m.generation_provenance.codex_image_generation_used).toBe(false);
      expect(p.prompt_text).not.toBe(p.image_brief);
      expect(p.prompt_text).toContain("Never lighten, darken, de-age");
      expect(p.image_brief).toContain("fictional Indian");
      expect(p.is_published || p.is_indexable || p.is_featured).toBe(false);
      const file = `public${p.preview_image_url}`;
      const meta = await sharp(file).metadata();
      expect([meta.width, meta.height]).toEqual([1080, 1350]);
      expect(
        createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
      ).toBe(m.optimized_sha256);
      expect(fs.statSync(file).size).toBeLessThan(180_000);
    }
    const projection = prompts.find(
      (p) => p.slug === "the-projectionist-is-me",
    )!;
    expect(projection.reference_contract).toMatchObject({
      identity_count: 1,
      depiction_count: 2,
    });
    expect(projection.prompt_text).toContain(
      "Exactly TWO intentional depictions of ONE identity",
    );
    const kite = prompts.find((p) => p.slug === "the-kite-in-my-notebook")!;
    expect(kite.reference_contract.reference_age).toBe("child-required");
    expect(kite.prompt_text).toContain("do not de-age an adult");
  });
  it("keeps all new drafts behind the existing local-only guard", async () => {
    const base = {
      CONTENT_SOURCE: "seed",
      PICMAGIC_SOCIAL_PREVIEW: "true",
      NEXT_PUBLIC_INDEXING_ENABLED: "false",
    };
    expect(socialPreviewEnabled(base)).toBe(true);
    for (const override of [
      { NETLIFY: "true" },
      { CONTEXT: "deploy-preview" },
      { CI: "true" },
      { CONTENT_SOURCE: "supabase" },
      { NEXT_PUBLIC_INDEXING_ENABLED: "true" },
      { PICMAGIC_SOCIAL_PREVIEW: "false" },
    ])
      expect(socialPreviewEnabled({ ...base, ...override })).toBe(false);
    for (const [slug, ids] of Object.entries(socialPreviewMemberships)) {
      expect(allCollections.some((c) => c.slug === slug)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);
    }
    for (const [key, value] of Object.entries({
      ...base,
      NETLIFY: "",
      CONTEXT: "",
      CI: "",
    }))
      vi.stubEnv(key, value);
    try {
      const local = await new SeedRepository().getCatalog();
      expect(
        prompts.every((p) => local.prompts.some((x) => x.id === p.id)),
      ).toBe(true);
      vi.stubEnv("CONTEXT", "production");
      const hosted = await new SeedRepository().getCatalog();
      expect(
        hosted.prompts.some((p) => prompts.some((x) => x.id === p.id)),
      ).toBe(false);
      expect(
        hosted.collections.some((c) =>
          c.prompt_ids.some((id) => prompts.some((p) => p.id === id)),
        ),
      ).toBe(false);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
