import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  assertSitemapMembership,
  endpoint,
  key,
  origin,
  submitBatch,
  validateBatch,
} from "./indexnow.mjs";

const url = `${origin}/festival-poster-maker`;
const batch = { id: "festival-release-20261010", urls: [url] };
const sitemap = `<urlset><url><loc>${url}</loc></url></urlset>`;
test("public key file matches submission ownership proof", async () => {
  assert.equal(
    (
      await readFile(
        new URL(`../../public/${key}.txt`, import.meta.url),
        "utf8",
      )
    ).trim(),
    key,
  );
  assert.match(key, /^[a-f0-9]{32}$/);
});
test("batch validation deduplicates canonical URLs", () => {
  assert.deepEqual(validateBatch({ ...batch, urls: [url, url] }), batch);
});
test("reject private, foreign, query, encoded, noncanonical and empty inputs", () => {
  for (const value of [
    "https://agentgrid.me/",
    `${origin}/admin`,
    `${origin}/api/test`,
    `${url}?name=private`,
    `${url}#test`,
    `${origin}/blog/%61`,
    `http://picmagic.in/`,
    `${origin}/blog/../festival-poster-maker`,
    `${url}/`,
  ]) {
    assert.throws(() => validateBatch({ ...batch, urls: [value] }));
  }
  assert.throws(() => validateBatch({ ...batch, urls: [] }));
  assert.throws(() => validateBatch({ ...batch, id: "../bad" }));
  assert.throws(() => validateBatch({ ...batch, urls: Array(101).fill(url) }));
});
test("sitemap membership rejects unpublished or absent pages", () => {
  assert.doesNotThrow(() => assertSitemapMembership([url], sitemap));
  assert.throws(() =>
    assertSitemapMembership([`${origin}/blog/draft`], sitemap),
  );
  assert.throws(() => assertSitemapMembership([url], "<html>error</html>"));
});
for (const status of [200, 202, 403, 429]) {
  test(`submission records HTTP ${status} without retrying`, async () => {
    const calls = [];
    const result = await submitBatch(batch, async (address, options) => {
      calls.push(address);
      assert.equal(options.redirect, "error");
      if (address.endsWith(".txt")) return new Response(key);
      if (address.endsWith(".xml")) return new Response(sitemap);
      assert.equal(address, endpoint);
      assert.deepEqual(JSON.parse(options.body).urlList, [url]);
      return new Response("", { status });
    });
    assert.equal(calls.length, 3);
    assert.equal(result.status, status);
    assert.notEqual(result.result, "indexed");
  });
}
test("failed live key verification prevents POST", async () => {
  let calls = 0;
  await assert.rejects(
    submitBatch(batch, async () => {
      calls++;
      return new Response("wrong");
    }),
  );
  assert.equal(calls, 1);
});
