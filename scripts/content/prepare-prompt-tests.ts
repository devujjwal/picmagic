import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { allPrompts } from "../../content/catalog";
import { promptTestPlan } from "../../content/prompt-test-plan";
import { isPromptSeoEligible } from "../../lib/seo/eligibility";
import { promptPath, promptSchema } from "../../types/content";

const directory = ".release-private/adsense-evidence-2026-10-05";
if (existsSync(`${directory}/planned-inputs.json`) || existsSync(`${directory}/executed-runs.json`)) {
  throw new Error("Existing evidence must not be overwritten. Use the retained snapshot.");
}
const records = promptTestPlan.map((plan) => {
  const prompt = promptSchema.parse(allPrompts.find((p) => p.slug === plan.slug));
  if (!isPromptSeoEligible(prompt)) throw new Error(`Unavailable test candidate ${plan.slug}`);
  return {
    ...plan,
    path: promptPath(prompt),
    title: prompt.title,
    status: "awaiting-authorized-reference",
    promptText: prompt.prompt_text,
    promptSha256: createHash("sha256").update(prompt.prompt_text).digest("hex"),
    inputText: `The attached authorized portrait is the identity reference. Apply this complete prompt:\n\n${prompt.prompt_text}`,
    referenceAsset: null,
    runs: [],
  };
});
mkdirSync(directory, { recursive: true });
writeFileSync(`${directory}/planned-inputs.json`, JSON.stringify({
  createdAt: "2026-10-05",
  status: "planned-not-executed",
  provider: "ChatGPT web, existing accessible workflow only",
  uploadConsent: "required before transmitting a supplied portrait",
  publicationConsent: "separate explicit permission required for reference and recognizable outputs",
  records,
}, null, 2) + "\n");
console.log(`Prepared ${records.length} unexecuted input snapshots in ${directory}. No generation or publication performed.`);
