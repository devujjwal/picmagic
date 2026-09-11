import fs from "node:fs";
import {
  allPrompts as prompts,
  allCollections as collections,
} from "../content/catalog";
import categories from "../content/categories.json";

import {
  promptSchema,
  categorySchema,
  collectionSchema,
  promptPath,
} from "../types/content";
import { editorialIssues } from "../lib/prompts/editorial";
import { personaIssues } from "../lib/prompts/persona";
const paths = new Set<string>();
let missing = 0;
for (const raw of prompts) {
  const p = promptSchema.parse(raw);
  if (paths.has(promptPath(p))) throw new Error("Duplicate canonical path");
  paths.add(promptPath(p));
  if (!categories.some((c) => c.id === p.category_id))
    throw new Error("Unknown category");
  if (p.is_published && !p.published_at)
    throw new Error(
      `${p.slug}: published content needs a publication timestamp`,
    );
  const issues = [...personaIssues(p), ...editorialIssues(p)];
  if (issues.length) throw new Error(`${p.slug}: ${issues.join("; ")}`);
  for (const path of [p.preview_image_url, p.thumbnail_url])
    if (p.is_published && !fs.existsSync(`public${path}`)) {
      console.log(`Missing ${path}`);
      missing++;
    }
}
categories.forEach((c) => categorySchema.parse(c));
collections.forEach((c) => collectionSchema.parse(c));
if (prompts.length < 50) throw new Error("Existing library must not disappear");
console.log(
  `${prompts.filter((p) => !p.is_published).length} drafts excluded from public discovery; draft assets are NOT counted as ready.`,
);
console.log(
  `Validated ${prompts.length} prompts, ${categories.length} categories, ${collections.length} collections; ${missing} missing image files.`,
);
if (missing) process.exitCode = 1;
