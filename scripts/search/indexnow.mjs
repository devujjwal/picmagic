import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Public ownership proof, not an authentication secret. Keep the root file deployed.
export const key = "a0b888bffdf02cd16ba0d25392ac6c5f";
export const origin = "https://picmagic.in";
export const endpoint = "https://api.indexnow.org/IndexNow";
const root = fileURLToPath(new URL("../../", import.meta.url));

export function validateBatch(batch) {
  if (!batch || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(batch.id ?? "")) {
    throw new Error("Provide a stable lowercase release batch id.");
  }
  if (
    !Array.isArray(batch.urls) ||
    !batch.urls.length ||
    batch.urls.length > 100
  ) {
    throw new Error(
      "Submit 1–100 deliberately reviewed changed URLs, not a full crawl.",
    );
  }
  const urls = [...new Set(batch.urls)];
  for (const value of urls) {
    if (typeof value !== "string") throw new Error("URLs must be strings.");
    const url = new URL(value);
    if (
      url.origin !== origin ||
      url.href !== value ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      /[%\\]/.test(value) ||
      !/^\/(?:$|festival-poster-maker$|ai-prompts\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$|collections\/[a-z0-9-]+$|blog(?:\/[a-z0-9-]+)?$)/.test(
        url.pathname,
      )
    )
      throw new Error(`Not an allowed canonical public URL: ${value}`);
  }
  return { id: batch.id, urls: urls.sort() };
}

export function assertSitemapMembership(urls, xml) {
  if (!/<urlset\b/.test(xml) || !/<\/urlset>/.test(xml))
    throw new Error("Invalid page sitemap.");
  const known = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  const missing = urls.filter((url) => !known.has(url));
  if (missing.length)
    throw new Error(`Not in the live indexable sitemap: ${missing.join(", ")}`);
}

export async function submitBatch(batch, fetcher = fetch) {
  // Two preflight GETs, no site crawl, no redirects, no cookies or credentials.
  const options = { redirect: "error", signal: AbortSignal.timeout(20_000) };
  const proof = await fetcher(`${origin}/${key}.txt`, options);
  if (proof.status !== 200 || (await proof.text()).trim() !== key) {
    throw new Error(
      "Live IndexNow ownership file is not verified; no submission sent.",
    );
  }
  const sitemap = await fetcher(`${origin}/sitemap-pages.xml`, options);
  if (sitemap.status !== 200)
    throw new Error("Live page sitemap unavailable; no submission sent.");
  assertSitemapMembership(batch.urls, await sitemap.text());
  const response = await fetcher(endpoint, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "picmagic.in",
      key,
      keyLocation: `${origin}/${key}.txt`,
      urlList: batch.urls,
    }),
  });
  return {
    status: response.status,
    result:
      response.status === 200
        ? "accepted-not-proof-of-indexing"
        : response.status === 202
          ? "received-key-validation-pending"
          : "rejected-review-before-retry",
    response: (await response.text()).slice(0, 2000),
  };
}

export async function main(args) {
  if (
    args.length < 1 ||
    args.length > 2 ||
    (args[1] && args[1] !== "--apply")
  ) {
    throw new Error(
      "Usage: node scripts/search/indexnow.mjs batch.json [--apply]",
    );
  }
  const batch = validateBatch(
    JSON.parse(await readFile(resolve(args[0]), "utf8")),
  );
  if (args[1] !== "--apply") {
    console.log(
      JSON.stringify(
        { mode: "dry-run-no-network", endpoint, ...batch },
        null,
        2,
      ),
    );
    return;
  }
  if (process.env.CI || process.env.NETLIFY)
    throw new Error("Run only after a verified release, never during a build.");
  const digest = createHash("sha256")
    .update(JSON.stringify(batch))
    .digest("hex");
  const directory = resolve(root, ".release-private/indexnow");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const receiptPath = resolve(directory, `${batch.id}.json`);
  // Exclusive creation prevents concurrent or repeated submissions, including unknown outcomes.
  const receipt = {
    ...batch,
    digest,
    startedAt: new Date().toISOString(),
    result: "started-outcome-unknown",
  };
  await writeFile(receiptPath, JSON.stringify(receipt, null, 2), {
    flag: "wx",
    mode: 0o600,
  });
  try {
    Object.assign(receipt, await submitBatch(batch));
  } catch (error) {
    receipt.error = error instanceof Error ? error.message : String(error);
    receipt.result = "failed-or-unknown-review-before-retry";
  }
  receipt.finishedAt = new Date().toISOString();
  await writeFile(receiptPath, JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify({ ...receipt, receiptPath }, null, 2));
  if (![200, 202].includes(receipt.status)) process.exitCode = 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
