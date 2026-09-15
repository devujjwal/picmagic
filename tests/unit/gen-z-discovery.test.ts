import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import sharp from "sharp";
import { createHash } from "node:crypto";
import prompts from "@/content/additions/gen-z-prompts.json";
import candidates from "../../docs/audits/gen-z-discovery-2026-09-15/candidates.json";
import manifest from "../../docs/audits/gen-z-discovery-2026-09-15/generation-manifest.json";
import { allPrompts, allCollections } from "@/content/catalog";
import { promptSchema, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import {
  socialPreviewMemberships,
  socialPreviewIds,
} from "@/lib/prompts/social-preview";
vi.mock("server-only", () => ({}));
import { SeedRepository } from "@/lib/content";
describe("Gen Z editorial batch", () => {
  it("has traceable nearest neighbours and no canonical collisions", () => {
    expect(candidates).toHaveLength(15);
    for (const c of candidates)
      expect(allPrompts.some((p) => p.id === c.nearest_existing_id)).toBe(true);
    const paths = allPrompts.map((p) => promptPath(promptSchema.parse(p)));
    expect(new Set(paths).size).toBe(paths.length);
    expect(manifest).toHaveLength(5);
    expect(manifest.filter((m) => m.accepted)).toHaveLength(4);
    for (const m of manifest) {
      const c = candidates.find((c) => c.content_id === m.content_id)!;
      for (const n of [
        c.distinctiveness_score,
        c.novelty_score,
        c.shareability_score,
      ])
        expect(n).toBeGreaterThanOrEqual(4);
    }
  });
  it("integrates only accepted assets with truthful dimensions and provenance", async () => {
    expect(prompts).toHaveLength(4);
    for (const raw of prompts) {
      const p = promptSchema.parse(raw),
        m = manifest.find((m) => m.content_id === p.id)!;
      expect(m.accepted).toBe(true);
      expect(personaIssues(p)).toEqual([]);
      expect(p.is_published && p.is_indexable).toBe(true);
      expect(p.is_featured).toBe(false);
      expect(p.prompt_text).toContain("never make an older person Gen Z");
      expect(p.image_brief).toContain("fictional Indian");
      expect(p.prompt_text).not.toBe(p.image_brief);
      const file = `public${p.preview_image_url}`;
      const metadata = await sharp(file).metadata();
      expect([metadata.width, metadata.height]).toEqual([
        p.image_width,
        p.image_height,
      ]);
      expect(
        createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
      ).toBe(m.optimized_sha256);
    }
    expect(prompts.some((p) => p.slug === "a-face-on-the-scanner-glass")).toBe(
      false,
    );
    const friends = prompts.find((p) => p.slug === "chai-between-the-floors")!;
    expect(friends.reference_contract.identity_count).toBe(3);
    expect(friends.prompt_text).toMatch(/exactly three/i);
  });
  it("keeps memberships valid and exposes drafts only with the existing explicit local guard", async () => {
    for (const [slug, ids] of Object.entries(socialPreviewMemberships)) {
      expect(allCollections.some((c) => c.slug === slug)).toBe(true);
      expect(ids.every((id) => socialPreviewIds.has(id))).toBe(true);
    }
    vi.stubEnv("CONTENT_SOURCE", "seed");
    vi.stubEnv("PICMAGIC_SOCIAL_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_INDEXING_ENABLED", "false");
    vi.stubEnv("NETLIFY", "");
    vi.stubEnv("CONTEXT", "");
    vi.stubEnv("CI", "");
    try {
      const local = await new SeedRepository().getCatalog();
      expect(
        prompts.every((p) => local.prompts.some((x) => x.id === p.id)),
      ).toBe(true);
      for (const [slug, ids] of Object.entries(socialPreviewMemberships))
        expect(
          local.collections.find((c) => c.slug === slug)?.prompt_ids,
        ).toEqual(expect.arrayContaining(ids));
      vi.stubEnv("CONTEXT", "deploy-preview");
      const hosted = await new SeedRepository().getCatalog();
      expect(
        hosted.prompts.some((p) => prompts.some((x) => x.id === p.id)),
      ).toBe(true);
      expect(
        hosted.collections.some((c) =>
          c.prompt_ids.some((id) => prompts.some((p) => p.id === id)),
        ),
      ).toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
