import { describe, it, expect, vi } from "vitest";
import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { allPrompts } from "@/content/catalog";
import { allCollections } from "@/content/catalog";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
import { PromptDetail } from "@/components/prompts/prompt-detail";
import { promptGuides, hubGuides } from "@/content/seo-guides";
import { EditorialGuide } from "@/components/prompts/editorial-guide";
import { deferredAdvertisingPrompts } from "@/config/ads";
import { promptMetadata } from "@/lib/seo/metadata";
import changes from "../../docs/audits/content-rereview-2026-09-25/changes.json";
import collectionChanges from "../../docs/audits/content-rereview-2026-09-25/collection-changes.json";
import baseline from "../../docs/releases/2026-09-15/content-review.json";
vi.mock("@/components/ui/site-link", () => ({
  default: ({ children, href }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/share/detail-actions", () => ({
  DetailActions: () => null,
  CopyButton: () => null,
}));
vi.mock("@/components/prompts/preview-media", () => ({
  PreviewMedia: () => null,
}));
vi.mock("@/components/prompts/prompt-grid", () => ({ PromptGrid: () => null }));
vi.mock("@/components/ads/ad-slot", () => ({ AdSlot: () => null }));
describe("scoped content re-review", () => {
  it("keeps the publication, identity, asset and URL boundaries unchanged", () => {
    expect(changes).toHaveLength(9);
    expect(new Set(changes.map((c) => c.id)).size).toBe(9);
    expect(allPrompts.filter((p) => p.is_published)).toHaveLength(103);
    expect(allPrompts.filter((p) => !p.is_published)).toHaveLength(89);
    for (const c of changes) {
      expect(
        Object.keys(c.after).every((k) =>
          [
            "description",
            "seo_description",
            "prompt_text",
            "reel",
            "updated_at",
          ].includes(k),
        ),
      ).toBe(true);
      const p = allPrompts.find((p) => p.id === c.id)!;
      expect(p.is_published).toBe(true);
      expect(p).toMatchObject(c.after);
    }
  });
  it("uses the five reviewed editing descriptions in search and social metadata", () => {
    const catalog = loadAuditCatalog();
    const edits = changes.filter((c) => "seo_description" in c.after);
    expect(edits).toHaveLength(5);
    expect(new Set(edits.map((c) => c.after.seo_description)).size).toBe(5);
    for (const change of edits) {
      const prompt = catalog.prompts.find((p) => p.id === change.id)!;
      expect(prompt.prompt_type).toBe("photo_edit");
      expect(prompt.seo_description).toBe(change.after.seo_description);
      expect(prompt.seo_description).not.toBe(change.before.seo_description);
      const metadata = promptMetadata(prompt);
      expect(metadata.description).toBe(change.after.seo_description);
      expect(metadata.openGraph?.description).toBe(
        change.after.seo_description,
      );
      expect(metadata.twitter?.description).toBe(change.after.seo_description);
    }
  });
  it("keeps one complete timeline in every published reel and aligns copied actions", () => {
    for (const p of allPrompts.filter((p) => p.is_published && p.reel)) {
      const scenes = p.reel!.scenes;
      const ranges = [
        ...p.prompt_text.matchAll(/^(\d+)[–-](\d+) seconds:/gm),
      ].map((m) => [Number(m[1]), Number(m[2])]);
      expect(ranges, p.slug).toEqual(scenes.map((s) => [s.start, s.end]));
      scenes.forEach((s) => expect(p.prompt_text, p.slug).toContain(s.action));
      expect(scenes[0].start).toBe(0);
      expect(scenes.at(-1)!.end).toBe(p.reel!.duration);
    }
  });
  it("chains changed prompts to the historical review without changing identity instructions", () => {
    const hash = (s: string) => createHash("sha256").update(s).digest("hex");
    for (const c of changes) {
      if (!("prompt_text" in c.before) || !("prompt_text" in c.after)) continue;
      const before = c.before.prompt_text!,
        after = c.after.prompt_text!;
      expect(hash(before)).toBe(
        baseline.records.find((r) => r.id === c.id)!.sha256,
      );
      expect(after.split("CREATIVE DIRECTION:")[0]).toBe(
        before.split("CREATIVE DIRECTION:")[0],
      );
      expect(after.split("REFERENCE COMPATIBILITY:")[1]).toBe(
        before.split("REFERENCE COMPATIBILITY:")[1],
      );
      expect(after).not.toContain("Loop-compatible hold");
    }
  });
  it("renders twelve authored guides in HTML and preserves the three advertising holds", () => {
    const newGuides = Object.entries(promptGuides).filter(
      ([slug, g]) =>
        g.updatedAt === "2026-09-25T08:11:00Z" &&
        slug !== "our-courtyard-small-enough-to-hold",
    );
    expect(newGuides).toHaveLength(12);
    for (const [slug, guide] of newGuides) {
      expect(allPrompts.find((p) => p.slug === slug)?.is_published).toBe(true);
      expect(guide.sections).toHaveLength(2);
      const html = renderToStaticMarkup(<EditorialGuide guide={guide} />);
      expect(html).toContain("Practical guidance");
      expect(html).not.toContain("<script");
      expect(guide.sections.map((s) => s.body).join(" ")).not.toMatch(
        /guaranteed approval|tested successfully|proven ranking/i,
      );
    }
    expect([...deferredAdvertisingPrompts].sort()).toEqual([
      "coral-against-the-sky-reel",
      "soft-light-unmistakably-you-reel",
      "your-next-introduction-reel",
    ]);
    expect(
      JSON.stringify(promptGuides["our-courtyard-small-enough-to-hold"]),
    ).toContain("does not override your actual family");
    expect(
      JSON.stringify(hubGuides["/collections/dating-profile-reels"]),
    ).toContain("one stir");
  });
  it("includes guidance in actual server-rendered detail pages, not only isolated components", () => {
    const catalog = loadAuditCatalog();
    for (const [slug, guide] of Object.entries(promptGuides).filter(
      ([, g]) => g.updatedAt === "2026-09-25T08:11:00Z",
    )) {
      const prompt = catalog.prompts.find((p) => p.slug === slug)!;
      const html = renderToStaticMarkup(
        <PromptDetail prompt={prompt} catalog={catalog} />,
      );
      for (const section of guide.sections)
        expect(html, slug).toContain(section.heading);
    }
  });
  it("changes only the two reviewed collection descriptions", () => {
    expect(collectionChanges).toHaveLength(2);
    for (const change of collectionChanges) {
      expect(Object.keys(change.after)).toEqual(["description"]);
      expect(allCollections.find((c) => c.id === change.id)).toMatchObject(
        change.after,
      );
    }
    expect(
      collectionChanges.find((c) => c.slug === "dating-profile-reels")!.after
        .description,
    ).toContain("one adult");
  });
});
