import fs from "node:fs/promises";
const read = async (path) => JSON.parse(await fs.readFile(path, "utf8"));
const prompts = [
  ...(await read("content/prompts.json")),
  ...(await read("content/expansion/prompts.json")),
  ...(await read("content/additions/creative-prompts.json")),
  ...(await read("content/additions/friends-trip-prompts.json")),
];
const collections = [
  ...(await read("content/collections.json")),
  ...(await read("content/expansion/collections.json")),
  ...(await read("content/additions/creative-collections.json")),
  ...(await read("content/additions/friends-trip-collections.json")),
];
const origin = process.env.E2E_BASE_URL || "http://localhost:4313";
const indexing = process.env.SEO_EXPECT_INDEXING !== "false";
const site = "https://picmagic.in";
const request = (path, options = {}) =>
  fetch(origin + path, {
    headers: { "User-Agent": "Twitterbot/1.0 (PicMagic local metadata QA)" },
    ...options,
  });
const promptPath = (p) =>
  ["reel", "video"].includes(p.prompt_type)
    ? `/reel-prompts/${p.slug}`
    : `/ai-prompts/${p.category_id}/${p.slug}`;
const failures = [];
const sitemapResponse = await request("/sitemap.xml");
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!sitemapResponse.ok) failures.push("Sitemap unavailable");
if (new Set(urls).size !== urls.length) failures.push("Duplicate sitemap URL");
if (urls.some((url) => /\/(search|saved|admin)(\/|$)/.test(url)))
  failures.push("Private/noindex URL in sitemap");
if (!indexing && urls.length) failures.push("Preview sitemap should be empty");
for (const p of prompts) {
  const expected = indexing && p.is_published && p.is_indexable;
  if (urls.includes(site + promptPath(p)) !== expected)
    failures.push(`Sitemap membership ${p.slug}`);
}
const ready = collections.filter(
  (c) =>
    c.active &&
    c.is_indexable &&
    c.description.length >= 100 &&
    prompts.filter((p) => p.is_published && c.prompt_ids.includes(p.id))
      .length >= 4,
);
for (const c of collections) {
  if (
    urls.includes(`${site}/collections/${c.slug}`) !==
    (indexing && ready.includes(c))
  )
    failures.push(`Collection sitemap membership ${c.slug}`);
}
const checked = [];
const sample = [
  "/",
  "/ai-prompts/women",
  "/collections/romantic",
  "/collections/creative-transformations",
  "/ai-prompts/social-media/one-day-four-possible-worlds",
  "/ai-prompts/couple/barefoot-at-blue-hour",
  "/ai-prompts/kids/tiny-krishna-big-wonder",
  "/reel-prompts/the-anniversary-slow-dance",
  "/ai-prompts?page=2",
  ...(prompts.filter(
    (p) => p.is_published && ["reel", "video"].includes(p.prompt_type),
  ).length > 24
    ? ["/reel-prompts?page=2"]
    : []),
  ...ready
    .filter((c) => c.priority === 20)
    .slice(0, 2)
    .map((c) => `/collections/${c.slug}`),
];
for (const path of sample) {
  const response = await request(path);
  const html = await response.text();
  const head = html.split("</head>")[0];
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = head.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  const description = head.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  const og = head.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (
    !response.ok ||
    !canonical ||
    new URL(canonical).href !== new URL(site + path).href ||
    !description ||
    Boolean(robots?.includes("noindex")) === indexing ||
    !og ||
    !canonical ||
    new URL(og).href !== new URL(canonical).href
  )
    failures.push(`Metadata/indexability ${path}`);
  const structured = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ),
  ].map((m) => JSON.parse(m[1]));
  if (!structured.length && !path.includes("?page="))
    failures.push(`Structured data missing ${path}`);
  checked.push({
    path,
    status: response.status,
    canonical,
    robots,
    descriptionInHead: Boolean(description),
    structuredTypes: structured.map((x) => x["@type"]),
  });
}
for (const path of ["/search", "/saved", "/admin/login"]) {
  const html = await (await request(path)).text();
  if (!/<meta name="robots" content="[^"]*noindex/.test(html))
    failures.push(`Missing noindex ${path}`);
}
const draft = prompts.find((p) => !p.is_published);
if (draft && (await request(promptPath(draft))).status !== 404)
  failures.push(`Draft publicly accessible ${draft.slug}`);
for (const path of [
  "/ai-prompts/couple/romantic",
  "/ai-prompts/couple/pre-wedding",
])
  if ((await request(path)).status !== 404)
    failures.push(`Collection resolves as prompt: ${path}`);
const redirect = await request("/ai-prompts/reels", { redirect: "manual" });
if (
  ![301, 308].includes(redirect.status) ||
  !redirect.headers.get("location")?.endsWith("/reel-prompts")
)
  failures.push("Legacy reel redirect");
const share = await request(`/api/og/${prompts[0].id}`);
if (!share.ok || !share.headers.get("content-type")?.startsWith("image/png"))
  failures.push("Share image unavailable");
const robotsText = await (await request("/robots.txt")).text();
if (robotsText.includes(`Sitemap: ${site}/sitemap.xml`) !== indexing)
  failures.push("Robots sitemap declaration");
const result = {
  origin,
  measuredAt: new Date().toISOString(),
  indexingExpected: indexing,
  sitemapCanonicalCount: urls.length,
  libraryRecords: prompts.length,
  published: prompts.filter((p) => p.is_published).length,
  readyCollections: ready.length,
  checked,
  shareImageStatus: share.status,
  failures,
};
await fs.writeFile("docs/qa/seo.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
