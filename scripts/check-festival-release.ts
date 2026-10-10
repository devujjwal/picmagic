/** A production gate, not a content mutation or a generator. */
import fs from "node:fs";
import path from "node:path";
import { allPrompts } from "../content/catalog";
import { festivalReleaseDrafts } from "../content/releases/festival-2026-10";
import { posterDesigns } from "../features/poster-maker/designs";
import { promptSchema } from "../types/content";
import { personaIssues } from "../lib/prompts/persona";

const errors: string[] = [];
for (const staged of festivalReleaseDrafts) {
  const raw = allPrompts.find(
    (p) => p.id === staged.id && p.slug === staged.slug,
  );
  if (!raw) {
    errors.push(`${staged.slug}: not integrated`);
    continue;
  }
  const p = promptSchema.parse(raw);
  if (
    !p.is_published ||
    !p.is_indexable ||
    p.preview_review_status !== "approved" ||
    !p.editorial_review_version
  )
    errors.push(`${p.slug}: publication/review gate incomplete`);
  errors.push(...personaIssues(p).map((message) => `${p.slug}: ${message}`));
  for (const url of [p.preview_image_url, p.thumbnail_url]) {
    if (
      !url.startsWith("/previews/") ||
      !fs.existsSync(path.join(process.cwd(), "public", url))
    )
      errors.push(`${p.slug}: reviewed local asset missing`);
  }
}
for (const d of posterDesigns)
  if (!fs.existsSync(path.join(process.cwd(), "public", d.artwork)))
    errors.push(`${d.id}: editor artwork missing`);
if (errors.length) {
  console.error(
    "Festival production release blocked. Do not substitute test fixtures or original reference photographs.\n" +
      errors.join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Festival local integration and asset presence gates passed. Production backup, allowance, guarded transaction, visual review and live verification are still required.",
  );
