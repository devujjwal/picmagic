/** Release gate for reviewed published content; deferred drafts cannot become accidental release requirements. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { allPrompts, allCollections } from "../content/catalog";
import scope from "../docs/releases/2026-09-11/content-review.json";
import baseline from "../docs/audits/creative-upgrade-2026-09-11/production-public-snapshot.json";
import { editorialIssues } from "../lib/prompts/editorial";
import { personaIssues } from "../lib/prompts/persona";
import { promptPath, promptSchema } from "../types/content";
import provenance from "../content/image-provenance.json";
const failures: string[] = [];
const paths = new Set<string>();
const ids = new Set<string>();
const published = new Set(
  allPrompts.filter((p) => p.is_published).map((p) => p.id),
);
for (const raw of allPrompts) {
  const p = promptSchema.parse(raw);
  if (ids.has(p.id) || paths.has(promptPath(p)))
    failures.push(`${p.slug}: duplicate identity/canonical`);
  ids.add(p.id);
  paths.add(promptPath(p));
  const review = scope.records.filter((r) => r.id === p.id);
  const hash = createHash("sha256").update(p.prompt_text).digest("hex");
  if (review.length !== 1 || review[0].sha256 !== hash)
    failures.push(`${p.slug}: missing or stale release review`);
  for (const issue of [...personaIssues(p), ...editorialIssues(p)])
    failures.push(`${p.slug}: ${issue}`);
  if (!p.is_published) continue;
  if (p.preview_review_status !== "approved")
    failures.push(`${p.slug}: unapproved preview`);
  for (const path of [p.preview_image_url, p.thumbnail_url]) {
    if (!fs.existsSync(`public${path}`)) {
      failures.push(`${p.slug}: missing asset ${path}`);
      continue;
    }
    const m = await sharp(`public${path}`).metadata();
    if (m.format !== "webp") failures.push(`${p.slug}: unoptimized asset`);
    if (
      path === p.preview_image_url &&
      (m.width !== p.image_width || m.height !== p.image_height)
    )
      failures.push(`${p.slug}: incorrect dimensions`);
  }
  if (!provenance.some((r) => r.preview.path === p.preview_image_url))
    failures.push(`${p.slug}: missing exact asset provenance`);
  if (
    p.preview_video &&
    (!fs.existsSync(`public${p.preview_video.url}`) ||
      fs.statSync(`public${p.preview_video.url}`).size !==
        p.preview_video.bytes)
  )
    failures.push(`${p.slug}: video asset mismatch`);
}
for (const p of baseline.prompts) {
  const current = allPrompts.find((x) => x.id === p.id);
  if (!current?.is_published || promptPath(promptSchema.parse(current)) !== p.canonical_path)
    failures.push(`${p.slug}: existing public canonical lost`);
}
for (const c of allCollections) {
  if (c.prompt_ids.some((id) => !ids.has(id)))
    failures.push(`${c.slug}: dangling member`);
  if (
    c.active &&
    c.is_indexable &&
    (new Set(c.prompt_ids.filter((id) => published.has(id))).size < 4 ||
      c.description.length < 100)
  )
    failures.push(`${c.slug}: thin indexable collection`);
}
if (scope.records.length !== allPrompts.length)
  failures.push("Release audit count mismatch");
if (new Set(allCollections.map((c) => c.slug)).size !== allCollections.length)
  failures.push("Duplicate collection namespace");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Release content passed: ${published.size} published, ${allPrompts.length - published.size} explicitly deferred drafts; ${baseline.prompts.length} existing canonical owners preserved.`,
  );
