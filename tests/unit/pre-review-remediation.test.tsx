import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Guide from "@/app/guides/double-exposure-fashion/page";
import {
  doubleExposureIds,
  doubleExposureGuidePath,
  editorialRedirects,
  consolidatedPath,
} from "@/content/consolidations";
import { doubleExposureGuide } from "@/content/double-exposure-guide";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import { allPrompts } from "@/content/catalog";
import { promptSchema } from "@/types/content";
import {
  reviewedRevisions,
  releaseSql,
} from "../../scripts/content/dot-release";

it("consolidates without changing publication or indexability flags", () => {
  const archived = allPrompts.filter((p) =>
    doubleExposureIds.some((id) => p.id === id),
  );
  expect(archived).toHaveLength(2);
  for (const p of archived) {
    expect(p.is_published).toBe(true);
    expect(p.is_indexable).toBe(true);
    expect(isPromptSeoEligible(promptSchema.parse(p))).toBe(false);
  }
  expect(allPrompts.filter((p) => !p.is_published)).toHaveLength(95);
  for (const r of editorialRedirects) {
    expect(r.permanent).toBe(true);
    expect(consolidatedPath(r.source + "?from=save#example")).toBe(
      r.destination + "?from=save#example",
    );
  }
});
it("presents two illustrative examples and one complete inclusive recipe", () => {
  const html = renderToStaticMarkup(<Guide />);
  expect(html).toContain("double-exposure-fashion-men.webp");
  expect(html).toContain("double-exposure-fashion-women.webp");
  expect(html).toContain("not a test of the inclusive prompt");
  expect(html).toContain("No new generation");
  expect(html).toContain(doubleExposureGuidePath);
  expect(doubleExposureGuide.prompt).toContain("Exactly");
  expect(doubleExposureGuide.prompt).toContain("one person");
  expect(doubleExposureGuide.prompt).toContain("not guaranteed");
});
it("prepares only scoped, transactional, conflict-checked revisions", () => {
  const revisions = reviewedRevisions("c21f970");
  expect(revisions.filter((r) => r.table === "prompts")).toHaveLength(27);
  expect(revisions.some((r) => "reference_contract" in r.after)).toBe(true);
  expect(revisions.filter((r) => "created_at" in r.after)).toHaveLength(9);
  for (const r of revisions) {
    expect(r.after).not.toHaveProperty("is_published");
    expect(r.after).not.toHaveProperty("is_indexable");
    expect(r.after).not.toHaveProperty("preview_image_url");
  }
  const sql = releaseSql(revisions);
  expect(sql).toContain("for update");
  expect(sql).toContain("Editorial conflict");
  expect(sql).toContain("Protected field conflict");
  expect(sql.trim().endsWith("rollback;")).toBe(true);
  expect(sql).not.toMatch(/\b(insert|delete|commit)\s/i);
  expect(() =>
    releaseSql([{ ...revisions[0], after: { is_published: true } }]),
  ).toThrow("Unexpected write column");
});
