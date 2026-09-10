import fs from "node:fs/promises";
const prompts = JSON.parse(await fs.readFile("content/prompts.json", "utf8"));
const origin = process.env.E2E_BASE_URL || "http://localhost:4313";
const site = "https://picmagic.in";
const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
const failures = [];
if (new Set(urls).size !== urls.length) failures.push("Duplicate sitemap URL");
if (urls.some((url) => /\/(search|saved|admin)(\/|$)/.test(url)))
  failures.push("Private or noindex URL in sitemap");
for (const p of prompts) {
  const path =
    p.prompt_type === "reel" || p.prompt_type === "video"
      ? `/reel-prompts/${p.slug}`
      : `/ai-prompts/${p.category_id}/${p.slug}`;
  if (!urls.includes(site + path)) failures.push(`Missing canonical ${path}`);
}
const checked = [];
for (const path of [
  "/",
  "/ai-prompts/women",
  "/collections/romantic",
  "/ai-prompts/women/golden-hour-draped-in-tradition",
  "/reel-prompts/the-anniversary-slow-dance",
  "/ai-prompts?page=2",
]) {
  const response = await fetch(origin + path);
  const html = await response.text();
  const head = html.split("</head>")[0];
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = head.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  const description = head.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  if (
    !response.ok ||
    !canonical ||
    !description ||
    new URL(canonical).href !== new URL(site + path).href ||
    robots?.includes("noindex")
  )
    failures.push(`Indexability ${path}`);
  const structured = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
  ].map((m) => JSON.parse(m[1]));
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
  const html = await (await fetch(origin + path)).text();
  if (!html.match(/<meta name="robots" content="[^"]*noindex/))
    failures.push(`Missing noindex ${path}`);
}
const bad = await fetch(origin + "/ai-prompts/couple/romantic");
if (bad.status !== 404)
  failures.push("Collection resolves in prompt namespace");
const og = await fetch(origin + "/api/og/" + prompts[0].id);
if (!og.ok || !og.headers.get("content-type")?.startsWith("image/png"))
  failures.push("Share image unavailable");
const result = {
  sitemapCanonicalCount: urls.length,
  promptCanonicals: prompts.length,
  checked,
  shareImageStatus: og.status,
  failures,
};
await fs.writeFile("docs/qa/seo.json", JSON.stringify(result, null, 2));
console.log(result);
if (failures.length) process.exitCode = 1;
