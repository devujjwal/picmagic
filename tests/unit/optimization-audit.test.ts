import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, stat, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
import { analyzeCatalog } from "../../scripts/optimization/analyze";
import { inspectImages } from "../../scripts/optimization/images";
import {
  canonicalPath,
  crawl,
  expectedPages,
  expectedSitemapPaths,
  observeHtml,
  pageProblems,
  validateOrigin,
} from "../../scripts/optimization/rendered";
import {
  analyzeSearch,
  canonicalFamily,
  measurementCoverage,
} from "../../scripts/optimization/search";
import {
  finalizeReport,
  markdownReport,
  priorReportSchema,
} from "../../scripts/optimization/report";
import { writeReports } from "../../scripts/optimization/io";
import { promptPath } from "../../types/content";

const asOf = "2026-09-24T12:00:00.000Z";
const catalog = loadAuditCatalog();
const baseline = analyzeCatalog(catalog, asOf);
const fresh = () => structuredClone(baseline);
const row = {
  page: "https://picmagic.in/ai-prompts/men",
  query: "portrait ideas",
  searchType: "web" as const,
  clicks: 0,
  impressions: 3,
  position: 10,
};
function searchInput(rows = [row]) {
  return {
    version: 1,
    source: "search-console-export",
    current: {
      start: "2026-08-27",
      end: "2026-09-23",
      lastAvailableDate: "2026-09-23",
      complete: true,
      rows,
    },
  };
}

describe("read-only catalogue acceptance", () => {
  it("recalculates the complete inventory and contextual graph", () => {
    expect(baseline.inventory).toMatchObject({
      total: 186,
      published: 91,
      drafts: 95,
      eligible: 91,
      categories: 17,
      collections: 40,
      eligibleCollections: 8,
      uniqueImages: 80,
      relatedEdges: 706,
      withoutCollection: 20,
      withoutEligibleCollection: 34,
      modeledUnreachablePrompts: 0,
    });
    expect(
      baseline.findings.filter((f) => f.rule === "shared-preview"),
    ).toHaveLength(11);
    expect(
      baseline.findings.filter((f) => f.rule === "lexical-overlap"),
    ).toHaveLength(31);
  });
  it("retains exact source locations and keeps drafts out of recommendations", () => {
    expect(catalog.sources["category:cinematic"].file).toBe(
      "content/categories.json",
    );
    expect(catalog.sources["collection:cinematic"].file).not.toBe(
      "content/categories.json",
    );
    const draftUrls = new Set(
      catalog.prompts
        .filter((p) => !p.is_published)
        .map((p) => "https://picmagic.in" + promptPath(p)),
    );
    expect(
      baseline.findings
        .flatMap((f) => f.urls)
        .some((url) => draftUrls.has(url)),
    ).toBe(false);
    for (const p of catalog.prompts)
      expect(catalog.sources[p.id]).toMatchObject({
        recordId: p.id,
        line: expect.any(Number),
        file: expect.stringMatching(/^content\//),
      });
    expect(baseline.findings.some((f) => f.action.includes("auto-merge"))).toBe(
      true,
    );
  });
  it("keeps fixed membership links and taxonomy clean while detecting a new contradiction", () => {
    expect(
      baseline.findings
        .filter((f) => f.rule === "mixed-medium-link")
        .flatMap((f) => f.urls)
        .sort(),
    ).toEqual([]);
    const contradictory = structuredClone(catalog);
    contradictory.prompts
      .find((p) => p.slug === "portrait-cut-from-monsoon-paper")!
      .tags.push("couple");
    expect(
      analyzeCatalog(contradictory, asOf)
        .findings.filter((f) => f.rule === "taxonomy-conflict")
        .flatMap((f) => f.urls),
    ).toContain(
      "https://picmagic.in/ai-prompts/social-media/portrait-cut-from-monsoon-paper",
    );
    expect(
      baseline.findings
        .filter((f) => f.rule === "curated-context")
        .every((f) => f.issue.includes("not an orphan")),
    ).toBe(true);
  });
  it("models every eligible canonical and every protected draft", () => {
    const paths = expectedSitemapPaths(catalog, new Date(asOf));
    expect(paths).toHaveLength(114);
    expect(paths).toContain("/guides/prompt-trial");
    expect(new Set(paths).size).toBe(paths.length);
    expect(
      expectedPages(catalog, new Date(asOf)).filter((p) => p.status === 404),
    ).toHaveLength(97);
    for (const p of catalog.prompts.filter((p) => p.is_published))
      expect(paths).toContain(promptPath(p));
  });
  it("inspects source and thumbnail metadata without rewriting assets", async () => {
    const result = await inspectImages(catalog, asOf, process.cwd());
    expect(result.coverage).toBe("observed");
    expect(result.findings).toEqual([]);
    expect(result.inventory.inspectedAssetFiles).toBeGreaterThanOrEqual(80);
  });
  it("detects missing assets and dimension mismatches without modifying mappings", async () => {
    const c = structuredClone(catalog);
    c.prompts = [c.prompts.find((p) => p.is_published)!];
    c.prompts[0].preview_image_url = "/previews/nonexistent-audit-fixture.webp";
    expect(
      (await inspectImages(c, asOf, process.cwd())).findings.some((f) =>
        f.issue.includes("missing"),
      ),
    ).toBe(true);
    c.prompts[0] = {
      ...catalog.prompts.find((p) => p.is_published)!,
      image_width: 1,
    };
    expect(
      (await inspectImages(c, asOf, process.cwd())).findings.some((f) =>
        f.issue.includes("dimensions"),
      ),
    ).toBe(true);
  });
  it("proposes existing-hub intent review without approving publication", () => {
    const candidates = baseline.findings.filter(
      (f) => f.rule === "hub-supply-review",
    );
    expect(candidates).toHaveLength(2);
    expect(
      candidates.every(
        (f) =>
          f.priority === "P3" &&
          f.confidence === "low" &&
          f.action.includes("Counts alone"),
      ),
    ).toBe(true);
    expect(baseline.findings.some((f) => f.rule === "testing-provenance")).toBe(
      true,
    );
  });
});

describe("determinism and evidence-aware snapshot differences", () => {
  it("produces identical output for identical inputs", () => {
    expect(finalizeReport(fresh())).toEqual(
      finalizeReport(analyzeCatalog(catalog, asOf)),
    );
    expect(priorReportSchema.parse(finalizeReport(fresh()))).toEqual(
      finalizeReport(fresh()),
    );
  });
  it("ignores observation timestamps when detecting material changes", () => {
    const before = priorReportSchema.parse(
      JSON.parse(JSON.stringify(finalizeReport(fresh()))),
    );
    const next = fresh();
    next.observedAt = "2026-09-25T12:00:00.000Z";
    next.findings.forEach((f) =>
      f.evidence.forEach((e) => {
        e.observedAt = next.observedAt;
      }),
    );
    const after = finalizeReport(next, before);
    expect(after.changes.new).toHaveLength(0);
    expect(after.changes.changed).toHaveLength(0);
    expect(after.changes.persistent).toHaveLength(before.findings.length);
  });
  it("records changes and resolves findings only with fresh complete source evidence", () => {
    const before = finalizeReport(fresh()),
      next = fresh();
    const removed = next.findings.pop()!;
    const changedId = next.findings[0].id;
    next.findings[0].action = "A materially different recommendation";
    const after = finalizeReport(next, before);
    expect(after.changes.resolved).toContain(removed.id);
    expect(after.changes.changed).toContain(changedId);
    const incomplete = fresh();
    incomplete.findings = [];
    incomplete.coverage.repository = "unknown";
    expect(finalizeReport(incomplete, before).changes.resolved).toHaveLength(0);
  });
  it("requires explained, unexpired suppressions and rejects future snapshots", () => {
    const id = baseline.findings[0].id;
    expect(
      finalizeReport(fresh(), undefined, [
        {
          id,
          reason: "Reviewed legitimate shared instructions",
          expires: "2026-10-01",
        },
      ]).findings.find((f) => f.id === id)?.status,
    ).toBe("suppressed");
    expect(
      finalizeReport(fresh(), undefined, [
        {
          id,
          reason: "Reviewed legitimate shared instructions",
          expires: "2026-09-23",
        },
      ]).findings.find((f) => f.id === id)?.status,
    ).toBe("new");
    expect(() =>
      finalizeReport(fresh(), undefined, [
        { id, reason: "", expires: "2026-10-01" },
      ]),
    ).toThrow();
    const future = fresh();
    future.observedAt = "2026-09-25T12:00:00.000Z";
    expect(() => finalizeReport(fresh(), future)).toThrow();
  });
  it("renders imported content as escaped text, never executable instructions", () => {
    const report = fresh();
    report.findings[0].issue =
      "<script>alert(1)</script> ![track](https://example.com)";
    const md = markdownReport(report);
    expect(md).not.toContain("<script>");
    expect(md).not.toContain("![track]");
    expect(md).toContain("&lt;script&gt;");
  });
  it("does not resolve missing search rows as zero traffic or success", () => {
    const before = fresh();
    before.findings = analyzeSearch(searchInput(), asOf).findings;
    const after = fresh();
    after.coverage.search = "observed";
    const result = finalizeReport(after, before);
    expect(result.changes.resolved).toHaveLength(0);
    expect(
      result.findings.find((f) => f.rule === "search-opportunity")?.status,
    ).toBe("persistent");
  });
  it("does not use a local pass to resolve a production observation", () => {
    const before = fresh();
    before.findings = [structuredClone(before.findings[0])];
    before.findings[0].rule = "rendered-image-cache";
    before.findings[0].evidence[0].source = "production HTTP";
    const after = fresh();
    after.findings = [];
    after.coverage.rendered = "observed";
    const result = finalizeReport(after, before);
    expect(result.changes.resolved).toHaveLength(0);
    expect(result.findings[0].status).toBe("persistent");
  });
});

describe("search evidence safeguards", () => {
  it("keeps low samples on a watchlist and never invents missing measurements", () => {
    expect(analyzeSearch(searchInput(), asOf).findings[0]).toMatchObject({
      priority: "P3",
      confidence: "low",
    });
    expect(baseline.coverage).toMatchObject({
      search: "unknown",
      analytics: "unknown",
      fieldCWV: "unknown",
    });
    expect(
      analyzeSearch(searchInput([{ ...row, impressions: 100 }]), asOf)
        .findings[0],
    ).toMatchObject({ priority: "P1", confidence: "medium" });
  });
  it("does not output private query text or arbitrary URL parameters", () => {
    const result = analyzeSearch(
      searchInput([
        {
          ...row,
          query: "private-person-unique-query",
          page: row.page + "?email=private-address&page=2",
        },
      ]),
      asOf,
    );
    expect(JSON.stringify(result)).not.toContain("private-person");
    expect(JSON.stringify(result)).not.toContain("private-address");
    expect(JSON.stringify(result)).toContain("page=2");
  });
  it("keeps incomplete and stale windows out of confident opportunities", () => {
    const input = searchInput([{ ...row, impressions: 1000 }]);
    input.current.complete = false;
    expect(analyzeSearch(input, asOf)).toMatchObject({
      coverage: "partial",
      findings: [expect.objectContaining({ priority: "P3" })],
    });
    expect(
      analyzeSearch(searchInput(), "2026-10-10T00:00:00.000Z").coverage,
    ).toBe("stale");
    expect(() =>
      analyzeSearch(searchInput(), "2026-09-01T00:00:00.000Z"),
    ).toThrow();
  });
  it("requires equivalent complete windows and enough prior clicks for declines", () => {
    const input = {
      ...searchInput([{ ...row, position: 30, clicks: 10, impressions: 90 }]),
      previous: {
        start: "2026-07-30",
        end: "2026-08-26",
        lastAvailableDate: "2026-08-26",
        complete: true,
        rows: [{ ...row, position: 30, clicks: 30, impressions: 90 }],
      },
    };
    expect(analyzeSearch(input, asOf).findings[0]?.priority).toBe("P1");
    input.previous.start = "2026-08-01";
    expect(analyzeSearch(input, asOf).findings).toHaveLength(0);
    input.previous.start = "2026-07-30";
    input.previous.rows[0].clicks = 19;
    expect(analyzeSearch(input, asOf).findings).toHaveLength(0);
  });
  it("does not treat historical host aliases as query cannibalization", () => {
    const input = searchInput([
      row,
      { ...row, page: row.page.replace("https://", "http://www.") },
    ]);
    expect(
      analyzeSearch(input, asOf).findings.some(
        (f) => f.rule === "search-intent-review",
      ),
    ).toBe(false);
    input.current.rows[1].page = "https://picmagic.in/ai-prompts/women";
    expect(
      analyzeSearch(input, asOf).findings.some(
        (f) => f.rule === "search-intent-review",
      ),
    ).toBe(true);
    expect(
      canonicalFamily(
        "http://www.picmagic.in/ai-prompts?page=2&utm_source=x#hello",
      ),
    ).toBe("https://picmagic.in/ai-prompts?page=2");
  });
  it("rejects duplicate rows, mixed aggregation, invalid hosts and unsafe thresholds", () => {
    expect(() => analyzeSearch(searchInput([row, row]), asOf)).toThrow();
    expect(() =>
      analyzeSearch(
        searchInput([row, { ...row, device: "mobile" }] as (typeof row)[]),
        asOf,
      ),
    ).toThrow();
    expect(() =>
      analyzeSearch(
        searchInput([{ ...row, page: "https://example.com" }]),
        asOf,
      ),
    ).toThrow();
    expect(() =>
      analyzeSearch(searchInput(), asOf, { minImpressions: 0 }),
    ).toThrow();
  });
  it("keeps web/image evidence separate and marks old measurement verification stale", () => {
    const input = searchInput([
      row,
      { ...row, searchType: "image" },
    ] as (typeof row)[]);
    expect(analyzeSearch(input, asOf).findings).toHaveLength(2);
    expect(
      measurementCoverage(
        {
          version: 1,
          observedAt: "2026-09-01T00:00:00.000Z",
          source: "manual-verification",
          analytics: "observed",
          fieldCWV: "unknown",
          note: "Receipt verified on that date only",
        },
        asOf,
      ),
    ).toEqual({ analytics: "stale", fieldCWV: "unknown" });
  });
});

describe("rendered-page and network boundaries", () => {
  it("allows only loopback or explicitly opted-in exact production origins", () => {
    expect(validateOrigin("http://127.0.0.1:4317", false)).toBe(
      "http://127.0.0.1:4317",
    );
    expect(validateOrigin("https://picmagic.in", true)).toBe(
      "https://picmagic.in",
    );
    for (const url of [
      "https://picmagic.in",
      "http://localhost.evil.test",
      "http://user:pass@localhost",
      "http://localhost/path",
      "http://localhost?token=x",
    ])
      expect(() => validateOrigin(url, false)).toThrow();
    expect(() => validateOrigin("https://www.picmagic.in", true)).toThrow();
  });
  it("extracts initial HTML without running scripts and handles query canonicals", () => {
    const html = `<title>A title</title><meta content='A description' name='description'><meta name='robots' content='index,follow'><link href='https://picmagic.in/ai-prompts?page=2' rel='canonical'><h1>Page</h1><a href='/collections'>Collections</a><script>throw new Error('must not execute')</script>`;
    const observation = observeHtml(
      "/ai-prompts?page=2&utm_source=x",
      200,
      html,
    );
    expect(
      pageProblems(
        { path: observation.path, indexable: true, status: 200 },
        observation,
      ),
    ).toEqual([]);
    expect(canonicalPath("/ai-prompts?page=bad&utm_source=x")).toBe(
      "/ai-prompts",
    );
    expect(observation.links).toEqual(["/collections"]);
    expect(
      pageProblems(
        { path: "/", indexable: true, status: 200 },
        { ...observation, path: "/", canonical: "https://picmagic.in" },
      ),
    ).toEqual([]);
  });
  it("recognizes draft/not-found protection and redirect status", () => {
    const notFound = observeHtml(
      "/missing",
      404,
      "",
      new Headers({ "x-robots-tag": "noindex" }),
    );
    expect(
      pageProblems(
        { path: "/missing", indexable: false, status: 404 },
        notFound,
      ),
    ).toEqual([]);
    expect(
      pageProblems(
        { path: "/missing", indexable: false, status: 404 },
        { ...notFound, robots: "" },
      ),
    ).toContain("Missing not-found noindex");
    expect(
      pageProblems(
        { path: "/old", indexable: false, status: 308, redirect: "/new" },
        { ...notFound, status: 308, location: "/new" },
      ),
    ).toEqual([]);
  });
  it("caps production reads, never follows redirects and labels incomplete evidence", async () => {
    const requests: { url: string; options?: RequestInit }[] = [];
    const fetcher: typeof fetch = async (input, options) => {
      requests.push({ url: String(input), options });
      return new Response("", {
        status: 302,
        headers: { location: "https://untrusted.invalid/secret" },
      });
    };
    const result = await crawl(
      catalog,
      {
        base: "https://picmagic.in",
        production: true,
        observedAt: asOf,
        indexing: true,
      },
      fetcher,
    );
    expect(requests.length).toBeLessThanOrEqual(12);
    expect(
      requests.every(
        (r) =>
          ["GET", "HEAD"].includes(r.options?.method || "") &&
          r.options?.redirect === "manual" &&
          new URL(r.url).origin === "https://picmagic.in",
      ),
    ).toBe(true);
    expect(result.coverage).toBe("partial");
    expect(result.observations.every((p) => p.status === null)).toBe(true);
  });
});

describe("private output boundaries", () => {
  it("uses a private ignored location, refuses overwrites and directory traversal", async () => {
    const root = await mkdtemp(join(tmpdir(), "picmagic-audit-test-"));
    try {
      const out = await writeReports(root, "run-1", { "report.md": "example" });
      expect(await readFile(join(out, "report.md"), "utf8")).toBe("example");
      expect((await stat(join(out, "report.md"))).mode & 0o777).toBe(0o600);
      await expect(
        writeReports(root, "run-1", { "report.md": "overwrite" }),
      ).rejects.toThrow();
      await expect(
        writeReports(root, "../public", { "report.md": "unsafe" }),
      ).rejects.toThrow();
      await expect(
        writeReports(root, "run-2", { "../x.md": "unsafe" }),
      ).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it("refuses symlinked private output directories", async () => {
    const root = await mkdtemp(join(tmpdir(), "picmagic-audit-test-"));
    try {
      await mkdir(join(root, "elsewhere"));
      await symlink(join(root, "elsewhere"), join(root, ".release-private"));
      await expect(
        writeReports(root, "run", { "report.md": "unsafe" }),
      ).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
