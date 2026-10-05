import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import sharp from "sharp";

const directory = ".release-private/adsense-evidence-2026-10-05";
const evidence = JSON.parse(readFileSync(`${directory}/executed-runs.json`, "utf8"));
const plan = JSON.parse(readFileSync(`${directory}/planned-inputs.json`, "utf8"));
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
for (const run of evidence.runs) {
  const bytes = readFileSync(`${directory}/${run.output}`);
  if (createHash("sha256").update(bytes).digest("hex") !== run.outputSha256) throw new Error(`Changed original: ${run.output}`);
  const record = plan.records.find((p: { slug: string }) => p.slug === run.slug);
  if (!run.inputText) run.inputText = record.inputText;
  run.inputSha256 = createHash("sha256").update(run.inputText).digest("hex");
  const name = run.output.replace(/\.png$/, ".webp");
  await sharp(bytes).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`${directory}/${name}`);
  chmodSync(`${directory}/${name}`, 0o600);
  run.reviewExport = name;
  chmodSync(`${directory}/${run.output}`, 0o600);
}
evidence.status = "executed-awaiting-owner-review";
evidence.publicationAuthorized = false;
writeFileSync(`${directory}/executed-runs.json`, JSON.stringify(evidence, null, 2) + "\n");
const sections = plan.records.map((record: { slug: string; title: string; focus: string }) => {
  const runs = evidence.runs.filter((r: { slug: string }) => r.slug === record.slug);
  if (!runs.some((r: { kind: string }) => r.kind === "baseline") || !runs.some((r: { kind: string }) => r.kind === "variation")) throw new Error(`Incomplete ${record.slug}`);
  return `<section><h2>${escape(record.title)}</h2><p>${escape(record.focus)}</p><div class="results">${runs.map((run: { kind: string; reviewExport: string; review: string; originalDimensions: number[]; inputText: string }) => `<figure><h3>${escape(run.kind)}</h3><a href="${escape(run.reviewExport.replace(/\.webp$/, ".png"))}"><img class="result" src="${escape(run.reviewExport)}" alt="${escape(record.title)} ${escape(run.kind)} result"></a><figcaption>${run.originalDimensions.join(" x ")} original. ${escape(run.review)}</figcaption>${record.slug.includes("profile") ? `<div class="avatars">${[40, 64, 128].map((size) => `<img src="${escape(run.reviewExport)}" width="${size}" height="${size}" alt="${size}px circular crop">`).join("")}</div>` : ""}<details><summary>Exact submitted input</summary><pre>${escape(run.inputText)}</pre></details></figure>`).join("")}</div></section>`;
}).join("\n");
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PicMagic private prompt test review</title><style>*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui;color:#202526;background:#fff}main{max-width:1440px;margin:auto;padding:24px}h1{font-size:28px}h2{font-size:22px}h3{text-transform:capitalize;font-size:18px}section{border-top:1px solid #bbb;padding:24px 0}.results{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:24px}figure{margin:0;min-width:0}.result{width:100%;max-height:540px;object-fit:contain;background:#f4f5f6}figcaption{margin-top:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.5 monospace}.avatars{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:16px 0}.avatars img{border-radius:50%;object-fit:cover}summary{cursor:pointer;margin-top:12px}p{max-width:90ch}</style><main><h1>PicMagic: Private Prompt Tests</h1><p>5 October 2026. Eight baselines, eight same-chat variations and two focused repairs through ChatGPT web, visible mode Instant. Image model version undisclosed. Generated results are not guaranteed to preserve exact identity or original pixels. No reference originals are embedded here.</p><p>Local review only. All originals and exact inputs are retained privately. No production publication or AdSense review request has occurred. The staircase mechanism remains unresolved; the headshot repair is not evidence of exact conservative editing. Owner likeness and public-output consent are still required.</p>${sections}</main></html>`;
writeFileSync(`${directory}/review.html`, html);
chmodSync(`${directory}/review.html`, 0o600);
console.log(`Prepared local review of ${evidence.runs.length} verified originals; no public assets or network writes.`);
