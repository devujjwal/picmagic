import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
const { prompts, categories, collections } = JSON.parse(
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/seo-catalog.ts"],
    { encoding: "utf8", maxBuffer: 10_000_000 },
  ),
);
const origin = process.env.E2E_BASE_URL || "http://localhost:4313";
const indexing = process.env.SEO_EXPECT_INDEXING !== "false";
const site = "https://picmagic.in";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  throw new Error(
    "Full-library SEO QA is local-only to conserve hosting credits.",
  );
const request = (path, options = {}) =>
  fetch(origin + path, {
    headers: { "User-Agent": "Twitterbot/1.0 (PicMagic local metadata QA)" },
    ...options,
  });
const failures = [],
  checked = [];
const locs = (xml) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const index = await request("/sitemap.xml");
const children = locs(await index.text());
if (!index.ok || children.length !== (indexing ? 2 : 0))
  failures.push("Invalid sitemap index");
const pages = await request("/sitemap-pages.xml");
const urls = locs(await pages.text());
const images = await request("/sitemap-images.xml");
const imageXml = await images.text(),
  imageUrls = locs(imageXml);
if (!pages.ok || !images.ok) failures.push("Child sitemap unavailable");
if (new Set(urls).size !== urls.length) failures.push("Duplicate sitemap URL");
if (!indexing && (urls.length || imageUrls.length))
  failures.push("Preview sitemaps must be empty");
for (const p of prompts) {
  const expected = indexing && p.eligible;
  if (
    urls.includes(site + p.path) !== expected ||
    imageUrls.includes(site + p.path) !== expected
  )
    failures.push("Sitemap membership " + p.slug);
  if (expected && !imageXml.includes(new URL(p.preview_image_url, site).href))
    failures.push("Missing image " + p.slug);
}
const hubs = [
  ...categories
    .filter((c) => c.slug !== "reels")
    .map((c) => ({ ...c, path: "/ai-prompts/" + c.slug })),
  ...collections
    .filter((c) => c.active)
    .map((c) => ({ ...c, path: "/collections/" + c.slug })),
];
for (const c of hubs)
  if (urls.includes(site + c.path) !== (indexing && c.eligible))
    failures.push("Hub sitemap membership " + c.slug);
const routes = [
  ...[
    "/",
    "/ai-prompts",
    "/collections",
    "/reel-prompts",
    "/about",
    "/create",
    "/enhance-photo",
    "/ai-prompts?page=2",
  ].map((path) => ({ path, eligible: true })),
  ...hubs,
  ...prompts.filter((p) => p.is_published),
];
for (const entry of routes) {
  const { path } = entry;
  const response = await request(path),
    html = await response.text(),
    head = html.split("</head>")[0];
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = head.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  const description = head.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  const og = head.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const title = head.match(/<title>(.*?)<\/title>/)?.[1];
  if (
    !response.ok ||
    !canonical ||
    new URL(canonical).href !== new URL(site + path).href ||
    !description ||
    !robots ||
    robots.includes("noindex") === (indexing && entry.eligible) ||
    og !== canonical ||
    !title ||
    /\|\s*PicMagic\s*\|\s*PicMagic/i.test(title)
  )
    failures.push("Metadata/indexability " + path);
  let structured = [];
  try {
    structured = [
      ...html.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
  } catch {
    failures.push("Invalid JSON-LD " + path);
  }
  if (entry.prompt_text) {
    const page = structured.find((s) => s["@type"] === "WebPage");
    if (
      page?.primaryImageOfPage?.contentUrl !==
        new URL(entry.preview_image_url, site).href ||
      page?.mainEntity?.["@type"] !== "CreativeWork"
    )
      failures.push("Prompt/image entity " + path);
    if (!head.includes("max-image-preview:large"))
      failures.push("Large preview robots " + path);
    if (!head.includes('property="og:image:alt"'))
      failures.push("OG image alt " + path);
    if (!html.includes('class="prompt-text"'))
      failures.push("Prompt absent from SSR " + path);
  }
  checked.push({
    path,
    status: response.status,
    canonical,
    robots,
    htmlBytes: Buffer.byteLength(html),
    structuredTypes: structured.map((s) => s["@type"]),
  });
}
for (const p of prompts.filter((p) => !p.is_published))
  if ((await request(p.path)).status !== 404)
    failures.push("Draft publicly accessible " + p.slug);
for (const path of ["/search", "/saved", "/admin/login"])
  if (
    !/<meta name="robots" content="[^"]*noindex/.test(
      await (await request(path)).text(),
    )
  )
    failures.push("Missing noindex " + path);
const redirect = await request("/ai-prompts/reels", { redirect: "manual" });
if (
  ![301, 308].includes(redirect.status) ||
  !redirect.headers.get("location")?.endsWith("/reel-prompts")
)
  failures.push("Legacy reel redirect");
const share = await request("/api/og/" + prompts[0].id);
if (!share.ok || !share.headers.get("content-type")?.startsWith("image/png"))
  failures.push("Share image unavailable");
if (
  (await (await request("/robots.txt")).text()).includes(
    "Sitemap: " + site + "/sitemap.xml",
  ) !== indexing
)
  failures.push("Robots sitemap declaration");
const result = {
  origin,
  measuredAt: new Date().toISOString(),
  indexingExpected: indexing,
  sitemapCanonicalCount: urls.length,
  imagePageCount: imageUrls.length,
  libraryRecords: prompts.length,
  published: prompts.filter((p) => p.is_published).length,
  draftsChecked: prompts.filter((p) => !p.is_published).length,
  checked,
  failures,
};
await fs.writeFile("docs/qa/seo.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ ...result, checked: checked.length }, null, 2));
if (failures.length) process.exitCode = 1;
