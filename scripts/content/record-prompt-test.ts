import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import { basename } from "node:path";
import sharp from "sharp";

const [slug, kind, file, reference, conversationUrl, observedDate, review] = process.argv.slice(2);
if (!slug || !["baseline", "variation", "repair"].includes(kind) || !file || basename(file) !== file ||
    !["reference-01.png", "reference-02.jpg"].includes(reference) ||
    !/^https:\/\/chatgpt\.com\/c\/[a-z0-9-]+$/.test(conversationUrl) ||
    !/^2026-10-05$/.test(observedDate) || !review) {
  throw new Error("Required: slug baseline|variation|repair output-basename reference-basename conversation-url observed-date review");
}
const directory = ".release-private/adsense-evidence-2026-10-05";
const plan = JSON.parse(readFileSync(`${directory}/planned-inputs.json`, "utf8"));
const record = plan.records.find((r: { slug: string }) => r.slug === slug);
if (!record) throw new Error("Unknown test plan");
const path = `${directory}/executed-runs.json`;
const evidence = JSON.parse(readFileSync(path, "utf8"));
if (evidence.runs.some((r: { slug: string; kind: string }) => r.slug === slug && r.kind === kind)) {
  throw new Error("Run already recorded; do not overwrite evidence");
}
const bytes = readFileSync(`${directory}/${file}`);
const metadata = await sharp(bytes).metadata();
const inputText = kind === "baseline" ? record.inputText : kind === "variation" ? record.variation : record.repairIfNeeded;
evidence.runs.push({
  slug, kind, inputText,
  inputSha256: createHash("sha256").update(inputText).digest("hex"),
  promptSha256: record.promptSha256,
  reference: `../identity-references/${reference}`,
  conversationUrl, observedDate, output: file,
  outputSha256: createHash("sha256").update(bytes).digest("hex"),
  originalDimensions: [metadata.width, metadata.height], review,
  referenceCondition: kind === "baseline" ? "original portrait attached" : "same chat original portrait and earlier generated outputs",
});
writeFileSync(path, JSON.stringify(evidence, null, 2) + "\n");
chmodSync(path, 0o600);
chmodSync(`${directory}/${file}`, 0o600);
console.log(`Recorded ${slug} ${kind}; local evidence only, no publication.`);
