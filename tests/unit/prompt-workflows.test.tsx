import { describe, it, expect, vi } from "vitest";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { promptWorkflows } from "@/content/prompt-workflows";
import { PromptWorkflow } from "@/components/prompts/prompt-workflow";
import trial from "@/content/prompt-trial.json";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
import { safeAnalyticsPath } from "@/lib/analytics";
import { PromptDetail } from "@/components/prompts/prompt-detail";
vi.mock("@/components/ads/ad-slot", () => ({
  AdSlot: ({ placement }: { placement: string }) => (
    <aside data-test-ad={placement} />
  ),
}));
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
const catalog = loadAuditCatalog();
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
describe("practical guidance and evidence", () => {
  it("adds six complete workflows to existing published records, not new filler pages", () => {
    expect(Object.keys(promptWorkflows)).toHaveLength(6);
    for (const [slug, workflow] of Object.entries(promptWorkflows)) {
      expect(catalog.prompts.find((p) => p.slug === slug)?.is_published).toBe(
        true,
      );
      const html = renderToStaticMarkup(<PromptWorkflow workflow={workflow} />);
      expect(html).toContain("Before you start");
      expect(html.match(/<details>/g)).toHaveLength(2);
      expect(workflow.steps).toHaveLength(3);
      expect(workflow.checks).toHaveLength(3);
    }
    expect(renderToStaticMarkup(<PromptWorkflow />)).toBe("");
  });
  it("keeps regression-specific identity and material rules in the repair instructions", () => {
    expect(JSON.stringify(promptWorkflows["barefoot-at-blue-hour"])).toMatch(
      /separate facial geometry/,
    );
    expect(JSON.stringify(promptWorkflows["tiny-krishna-big-wonder"])).toMatch(
      /Adapt only the hair arrangement/,
    );
    expect(JSON.stringify(promptWorkflows["tiny-krishna-big-wonder"])).toMatch(
      /natural complexion/,
    );
    expect(
      JSON.stringify(promptWorkflows["portrait-cut-from-monsoon-paper"]),
    ).toMatch(/without lightening/);
    expect(
      JSON.stringify(promptWorkflows["perfume-the-water-sculpture"]),
    ).toMatch(/original supplied bottle/);
  });
  it("retains exact historical inputs, limited scope and real optimized files", () => {
    expect(trial.records).toHaveLength(2);
    for (const r of trial.records) {
      expect(hash(r.promptText)).toBe(r.promptSha256);
      expect(hash(r.inputText)).toBe(r.inputSha256);
      expect(r.attempts).toBe(1);
      expect(r.imageModelVersion).toMatch(/Not disclosed/);
      expect(existsSync(`public${r.asset}`)).toBe(true);
      expect(readFileSync(`public${r.asset}`).byteLength).toBe(r.bytes);
      expect(r.correctionsRun).toBe(0);
    }
    expect(trial.records[0].inputText).toBe(trial.records[0].promptText);
    expect(trial.records[0].referenceAsset).toBeNull();
    expect(trial.records[1].referenceAsset).toBe(trial.records[0].asset);
    expect(trial.records[1].inputText).toContain("image you just generated");
    expect(trial.scope).toContain("No real-person likeness test");
    expect(safeAnalyticsPath("/guides/prompt-trial?private=secret")).toBe(
      "/guides/prompt-trial",
    );
  });
  it("does not render manual ad slots on draft preview or unreviewed prompt pages", () => {
    const p = catalog.prompts.find(
      (p) => p.slug === "a-fold-around-you-profile",
    )!;
    expect(
      renderToStaticMarkup(
        <PromptDetail prompt={p} catalog={catalog} preview />,
      ),
    ).not.toContain("data-test-ad");
    expect(
      renderToStaticMarkup(
        <PromptDetail
          prompt={{ ...p, is_published: false }}
          catalog={catalog}
        />,
      ),
    ).not.toContain("data-test-ad");
    expect(
      renderToStaticMarkup(
        <PromptDetail
          prompt={{ ...p, preview_review_status: "generation-required" }}
          catalog={catalog}
        />,
      ),
    ).not.toContain("data-test-ad");
    expect(
      renderToStaticMarkup(<PromptDetail prompt={p} catalog={catalog} />).match(
        /data-test-ad=/g,
      ),
    ).toHaveLength(1);
  });
});
