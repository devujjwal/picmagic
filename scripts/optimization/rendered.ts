import { createRequire } from "node:module";
import { promptPath } from "../../types/content";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "../../lib/seo/eligibility";
import type { AuditCatalog, Finding } from "./types";
import { finding, origin } from "./analyze";
import { sitePages } from "../../content/site-pages";
import {
  editorialRedirects,
  isConsolidatedPrompt,
} from "../../content/consolidations";

// jsdom never runs page scripts or loads subresources here.
const { JSDOM } = createRequire(import.meta.url)("jsdom") as {
  JSDOM: new (
    html: string,
    options?: { contentType: string },
  ) => { window: { document: Document; close(): void } };
};
export type PageObservation = {
  path: string;
  status: number | null;
  canonical?: string;
  robots?: string;
  title?: string;
  description?: string;
  h1: number;
  links: string[];
  types: string[];
  ogImage?: string;
  twitterCard?: string;
  primaryImage?: string;
  promptVisible: boolean;
  location?: string;
  error?: string;
  cache?: string;
  bytes: number;
};
type ExpectedPage = {
  path: string;
  indexable: boolean;
  status: number;
  promptImage?: string;
  redirect?: string;
};

export function expectedPages(c: AuditCatalog, now: Date): ExpectedPage[] {
  const pages: ExpectedPage[] = sitePages.map(({ path }) => ({
    path,
    status: 200,
    indexable: true,
  }));
  for (const category of c.categories.filter((x) => x.slug !== "reels"))
    pages.push({
      path: `/ai-prompts/${category.slug}`,
      status: 200,
      indexable: isCategorySeoEligible(category, c.prompts),
    });
  for (const collection of c.collections.filter((x) => x.active))
    pages.push({
      path: `/collections/${collection.slug}`,
      status: 200,
      indexable: isCollectionSeoEligible(collection, c.prompts, now),
    });
  for (const p of c.prompts)
    pages.push({
      path: promptPath(p),
      indexable: isPromptSeoEligible(p),
      status: p.is_published ? 200 : 404,
      ...(p.is_published
        ? { promptImage: new URL(p.preview_image_url, origin).href }
        : {}),
    });
  const photoPages = Math.ceil(
    c.prompts.filter(
      (p) =>
        p.is_published &&
        !isConsolidatedPrompt(p) &&
        !["reel", "video"].includes(p.prompt_type),
    ).length / 24,
  );
  for (let page = 2; page <= photoPages; page++)
    pages.push({
      path: `/ai-prompts?page=${page}`,
      indexable: true,
      status: 200,
    });
  pages.push(
    ...["/search", "/saved", "/admin/login"].map((path) => ({
      path,
      indexable: false,
      status: 200,
    })),
  );
  pages.push(
    { path: "/ai-prompts?page=999999", status: 404, indexable: false },
    { path: "/optimization-audit-missing-page", status: 404, indexable: false },
    {
      path: "/ai-prompts?page=1&utm_source=audit",
      status: 200,
      indexable: true,
    },
    {
      path: "/ai-prompts/reels",
      status: 308,
      indexable: false,
      redirect: "/reel-prompts",
    },
  );
  return pages.map((page) => {
    const redirect = editorialRedirects.find((r) => r.source === page.path);
    return redirect
      ? {
          path: page.path,
          status: 308,
          indexable: false,
          redirect: redirect.destination,
        }
      : page;
  });
}

export function expectedSitemapPaths(c: AuditCatalog, now: Date) {
  return expectedPages(c, now)
    .filter((p) => p.indexable && !p.path.includes("?"))
    .map((p) => p.path)
    .sort();
}

export function validateOrigin(value: string, production: boolean) {
  const url = new URL(value);
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error("Use an origin without credentials, path or query");
  if (
    production
      ? url.origin !== origin
      : !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
        url.protocol !== "http:"
  )
    throw new Error(
      "Only HTTP loopback origins or explicitly enabled https://picmagic.in are allowed",
    );
  return url.origin;
}

export function canonicalPath(path: string) {
  const u = new URL(path, origin),
    page = Number(u.searchParams.get("page") || 1);
  return (
    u.pathname + (Number.isSafeInteger(page) && page > 1 ? `?page=${page}` : "")
  );
}

export function observeHtml(
  path: string,
  status: number,
  html: string,
  headers = new Headers(),
): PageObservation {
  const dom = new JSDOM(html),
    doc = dom.window.document;
  const meta = (name: string) =>
    doc.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || "";
  const types: string[] = [];
  let primaryImage: string | undefined,
    invalidJson = false;
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    const v = value as Record<string, unknown>;
    if (typeof v["@type"] === "string") types.push(v["@type"]);
    if (v.primaryImageOfPage && typeof v.primaryImageOfPage === "object")
      primaryImage = (v.primaryImageOfPage as { contentUrl?: string })
        .contentUrl;
    Object.values(v).forEach(visit);
  };
  for (const script of doc.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      visit(JSON.parse(script.textContent || ""));
    } catch {
      invalidJson = true;
    }
  }
  const result: PageObservation = {
    path,
    status,
    title: doc.title,
    description: meta("description"),
    canonical:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
      undefined,
    robots: [
      meta("robots"),
      meta("googlebot"),
      headers.get("x-robots-tag") || "",
    ].join(","),
    h1: doc.querySelectorAll("h1").length,
    links: [...doc.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href")!)
      .filter((x) => x.startsWith("/") && !x.startsWith("//")),
    types: [...new Set(types)].sort(),
    primaryImage,
    ogImage:
      doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
      undefined,
    twitterCard: meta("twitter:card") || undefined,
    promptVisible: Boolean(
      doc.querySelector(".prompt-text")?.textContent?.trim(),
    ),
    location: headers.get("location") || undefined,
    cache: headers.get("cache-control") || undefined,
    bytes: Buffer.byteLength(html),
    ...(invalidJson ? { error: "Invalid JSON-LD" } : {}),
  };
  dom.window.close();
  return result;
}

export function pageProblems(
  expected: ExpectedPage,
  actual: PageObservation,
  indexing = true,
): string[] {
  if (actual.status === null)
    return ["Observation unavailable; not an indexability verdict"];
  const errors: string[] = [];
  if (expected.redirect) {
    if (
      ![301, 308].includes(actual.status) ||
      new URL(actual.location || "/", origin).pathname !== expected.redirect
    )
      errors.push("Unexpected redirect");
    return errors;
  }
  if (actual.status !== expected.status)
    errors.push(`Expected HTTP ${expected.status}, observed ${actual.status}`);
  if (actual.error) errors.push(actual.error);
  if (expected.status === 404) {
    if (!/noindex/i.test(actual.robots || ""))
      errors.push("Missing not-found noindex");
    return errors;
  }
  // Admin inherits its noindex layout; it is not a public canonical landing page.
  if (
    !expected.path.startsWith("/admin/") &&
    (!actual.canonical ||
      URL.parse(actual.canonical)?.href !==
        new URL(canonicalPath(expected.path), origin).href)
  )
    errors.push("Canonical mismatch");
  const shouldIndex = indexing && expected.indexable;
  if (
    !actual.robots?.replaceAll(",", "").trim() ||
    /noindex|\bnone\b/i.test(actual.robots) === shouldIndex
  )
    errors.push("Indexing directive mismatch");
  if (!actual.title || !actual.description)
    errors.push("Missing title/description");
  if (actual.h1 !== 1) errors.push("Expected one H1");
  if (
    expected.promptImage &&
    (!actual.promptVisible ||
      actual.primaryImage !== expected.promptImage ||
      !actual.types.includes("CreativeWork"))
  )
    errors.push("Missing SSR prompt or prompt/image entity");
  if (
    expected.promptImage &&
    (actual.ogImage !== expected.promptImage ||
      actual.twitterCard !== "summary_large_image")
  )
    errors.push("Prompt social preview mismatch");
  return errors;
}

async function responseText(response: Response, limit = 5_000_000) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Response exceeds audit byte limit");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function crawl(
  c: AuditCatalog,
  options: {
    base: string;
    production: boolean;
    observedAt: string;
    indexing: boolean;
  },
  fetcher: typeof fetch = fetch,
) {
  const base = validateOrigin(options.base, options.production),
    now = new Date(options.observedAt);
  const all = expectedPages(c, now);
  const pages = options.production
    ? all.filter((p) =>
        [
          "/",
          "/collections",
          "/ai-prompts",
          "/reel-prompts",
          "/optimization-audit-missing-page",
          "/ai-prompts/reels",
        ].includes(p.path),
      )
    : all;
  if (options.production) {
    const sample = all.find((p) => p.indexable && p.promptImage);
    if (sample) pages.push(sample);
  }
  const cap = options.production ? 12 : 500;
  let requests = 0;
  const request = async (path: string, method: "GET" | "HEAD" = "GET") => {
    const target = new URL(path, base);
    if (
      target.origin !== base ||
      target.username ||
      target.password ||
      ++requests > cap
    )
      throw new Error("Audit request boundary exceeded");
    const response = await fetcher(target, {
      method,
      redirect: "manual",
      credentials: "omit",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "PicMagic-Recommendation-Audit/1.0" },
    });
    const location = response.headers.get("location");
    if (
      location &&
      new URL(location, target).origin !== base &&
      new URL(location, target).origin !== origin
    )
      throw new Error("Redirect outside allowlist; not followed");
    return { response, text: await responseText(response) };
  };
  const observations: PageObservation[] = [],
    findings: Finding[] = [];
  let directivesUnavailable = false;
  for (const expected of pages) {
    let actual: PageObservation;
    try {
      const { response, text } = await request(expected.path);
      actual = observeHtml(
        expected.path,
        response.status,
        text,
        response.headers,
      );
    } catch {
      actual = {
        path: expected.path,
        status: null,
        bytes: 0,
        h1: 0,
        links: [],
        types: [],
        promptVisible: false,
        error: "Request failed or safety boundary reached",
      };
    }
    observations.push(actual);
    const problems = pageProblems(expected, actual, options.indexing);
    const critical = problems.some((p) =>
      /HTTP|Canonical mismatch|Indexing directive|Missing not-found|Unexpected redirect/.test(
        p,
      ),
    );
    if (problems.length)
      findings.push(
        finding(
          {
            rule: "rendered-page",
            key: expected.path,
            priority: actual.status !== null && critical ? "P0" : "P2",
            areas: ["SEO", "AEO", "GEO"],
            urls: [origin + canonicalPath(expected.path)],
            sources: [{ file: "scripts/optimization/rendered.ts" }],
            issue: "Rendered route needs verification",
            evidence: problems.join("; "),
            evidenceSource: options.production
              ? "production HTTP"
              : "local HTTP",
            action:
              "Verify the response and deployment configuration before proposing a fix. No indexing settings were changed.",
            benefit: "Protect route availability and correct indexability.",
            confidence: actual.status === null ? "low" : "high",
            uncertainty:
              "A local response is not proof of production or Google index state.",
            complexity: "medium",
            approval: "technical",
          },
          options.observedAt,
        ),
      );
  }
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-pages.xml",
    "/sitemap-images.xml",
  ]) {
    const errors: string[] = [];
    let failed = false;
    try {
      const { response, text } = await request(path);
      if (response.status !== 200) errors.push(`HTTP ${response.status}`);
      if (path === "/robots.txt") {
        if (
          options.indexing &&
          (!text.includes(`Sitemap: ${origin}/sitemap.xml`) ||
            /^Disallow:\s*\/\s*$/im.test(text))
        )
          errors.push("Sitemap declaration missing or root disallow observed");
      } else {
        const dom = new JSDOM(text, { contentType: "application/xml" });
        const locs = [...dom.window.document.getElementsByTagName("loc")]
          .map((n) => n.textContent || "")
          .sort();
        const wanted = !options.indexing
          ? []
          : path === "/sitemap.xml"
            ? [origin + "/sitemap-images.xml", origin + "/sitemap-pages.xml"]
            : path === "/sitemap-images.xml"
              ? c.prompts
                  .filter(isPromptSeoEligible)
                  .map((p) => origin + promptPath(p))
                  .sort()
              : expectedSitemapPaths(c, now).map((p) => origin + p);
        if (JSON.stringify(locs) !== JSON.stringify(wanted))
          errors.push("Sitemap membership differs from repository eligibility");
        if (path === "/sitemap-images.xml" && options.indexing)
          for (const p of c.prompts.filter(isPromptSeoEligible)) {
            const entry = [
              ...dom.window.document.getElementsByTagName("url"),
            ].find(
              (u) =>
                u.getElementsByTagName("loc")[0]?.textContent ===
                origin + promptPath(p),
            );
            if (
              entry?.getElementsByTagName("image:loc")[0]?.textContent !==
              new URL(p.preview_image_url, origin).href
            )
              errors.push(`Image mapping mismatch: ${p.slug}`);
          }
        dom.window.close();
      }
    } catch {
      failed = true;
      directivesUnavailable = true;
      errors.push("Fetch or XML parse unavailable");
    }
    if (errors.length)
      findings.push(
        finding(
          {
            rule: "crawl-directives",
            key: path,
            priority: failed ? "P2" : "P0",
            areas: ["SEO", "images"],
            urls: [origin + path],
            sources: [{ file: "lib/seo/sitemap.ts" }],
            issue: "Crawl directive/sitemap observation needs review",
            evidence: errors.join("; "),
            evidenceSource: options.production
              ? "production HTTP"
              : "local HTTP",
            action:
              "Compare live data, local data and configuration; do not automatically change sitemap or robots behaviour.",
            benefit: "Prevent crawl and content-source mismatches.",
            confidence: failed ? "low" : "high",
            uncertainty:
              "Repository and production database may intentionally differ.",
            complexity: "medium",
            approval: "technical",
          },
          options.observedAt,
        ),
      );
  }
  // Only classify links whose destinations were actually checked. Never recursively
  // follow arbitrary page-provided URLs or mistake a partial smoke test for a graph.
  const checked = new Map(observations.map((p) => [p.path, p]));
  for (const page of observations.filter((p) => p.status === 200)) {
    const broken = [...new Set(page.links)].filter(
      (href) => checked.get(href.split("#")[0])?.status === 404,
    );
    if (broken.length)
      findings.push(
        finding(
          {
            rule: "rendered-links",
            key: page.path,
            priority: "P2",
            areas: ["SEO", "links"],
            urls: [origin + page.path],
            sources: [{ file: "scripts/optimization/rendered.ts" }],
            issue: "Rendered links reach checked 404 destinations",
            evidence: broken.join(", "),
            evidenceSource: options.production
              ? "production HTTP"
              : "local HTTP",
            action:
              "Review these anchors against the intended destination. Unchecked URLs are not declared broken.",
            benefit: "Restore useful internal navigation.",
            confidence: "high",
            uncertainty:
              "Only destinations checked in this run are classified.",
            complexity: "low",
            approval: "technical",
          },
          options.observedAt,
        ),
      );
  }
  let assetCache:
    { path: string; status: number | null; header?: string } | undefined;
  const asset = c.prompts
    .filter(isPromptSeoEligible)
    .map((p) => p.preview_image_url)
    .find((path) => /^\/previews\/[a-z0-9-]+-[a-f0-9]{10}\.webp$/.test(path));
  if (asset) {
    try {
      const { response } = await request(asset, "HEAD");
      assetCache = {
        path: asset,
        status: response.status,
        header: response.headers.get("cache-control") || "",
      };
    } catch {
      assetCache = { path: asset, status: null };
      directivesUnavailable = true;
    }
    if (
      assetCache.status !== 200 ||
      !/\bimmutable\b/i.test(assetCache.header || "")
    )
      findings.push(
        finding(
          {
            rule: "rendered-image-cache",
            key: asset,
            priority: "P2",
            areas: ["SEO", "images"],
            urls: [origin + asset],
            sources: [{ file: "next.config.ts" }],
            issue: "Sampled content-addressed image caching needs verification",
            evidence: `HTTP ${assetCache.status ?? "unknown"}; Cache-Control: ${assetCache.header || "unknown"}`,
            evidenceSource: options.production
              ? "production HTTP"
              : "local HTTP",
            action:
              "Verify the hosting header mechanism before changing configuration. Never mark mutable filenames immutable.",
            benefit:
              "Avoid unnecessary repeat image downloads while preserving asset correctness.",
            confidence: assetCache.status === null ? "low" : "high",
            uncertainty:
              "One sampled asset is not a full delivery/CDN audit. Local cache headers are not production evidence.",
            complexity: "medium",
            approval: "technical",
          },
          options.observedAt,
        ),
      );
  }
  return {
    findings,
    observations,
    requests,
    assetCache,
    coverage:
      directivesUnavailable || observations.some((p) => p.status === null)
        ? ("partial" as const)
        : options.production
          ? ("partial" as const)
          : ("observed" as const),
  };
}
