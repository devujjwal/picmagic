import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
const prompts = JSON.parse(readFileSync("content/prompts.json", "utf8"));
const origin = process.env.E2E_BASE_URL || "https://picmagic.in";
const results = [];
for (let offset = 0; offset < prompts.length; offset += 4) {
  const batch = await Promise.all(
    prompts.slice(offset, offset + 4).map(async (p) => {
      const path =
        p.prompt_type === "reel" || p.prompt_type === "video"
          ? `/reel-prompts/${p.slug}`
          : `/ai-prompts/${p.category_id}/${p.slug}`;
      const response = await fetch(origin + path);
      const dom = new JSDOM(await response.text());
      const document = dom.window.document;
      const text = document.querySelector(".prompt-text")?.textContent;
      const canonical = document
        .querySelector('head link[rel="canonical"]')
        ?.getAttribute("href");
      const faqs = [...document.querySelectorAll("details summary")].map(
        (e) => e.textContent,
      );
      const result = {
        path,
        status: response.status,
        prompt_matches: text === p.prompt_text,
        canonical_matches: canonical === "https://picmagic.in" + path,
        all_faq_questions_present: p.faqs.every((f) =>
          faqs.includes(f.question),
        ),
        prompt_sha256: createHash("sha256")
          .update(text || "")
          .digest("hex"),
      };
      dom.window.close();
      return result;
    }),
  );
  results.push(...batch);
}
const failures = results.filter(
  (r) =>
    r.status !== 200 ||
    !r.prompt_matches ||
    !r.canonical_matches ||
    !r.all_faq_questions_present,
);
writeFileSync(
  "docs/qa/prompt-review-live.json",
  JSON.stringify(
    {
      verified_at: new Date().toISOString(),
      origin,
      checked: results.length,
      failed: failures.length,
      method:
        "Fresh HTTP fetch and inert HTML parsing of all 50 public canonical detail pages; no ad impressions or external image-model generation.",
      results,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    { checked: results.length, failed: failures.length, failures },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
