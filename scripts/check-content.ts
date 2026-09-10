import fs from "node:fs";
import prompts from "../content/prompts.json";
import categories from "../content/categories.json";
import collections from "../content/collections.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
  promptPath,
} from "../types/content";
const paths = new Set<string>();
let missing = 0;
for (const raw of prompts) {
  const p = promptSchema.parse(raw);
  if (paths.has(promptPath(p))) throw new Error("Duplicate canonical path");
  paths.add(promptPath(p));
  if (!categories.some((c) => c.id === p.category_id))
    throw new Error("Unknown category");
  for (const path of [p.preview_image_url, p.thumbnail_url])
    if (!fs.existsSync(`public${path}`)) {
      console.log(`Missing ${path}`);
      missing++;
    }
}
categories.forEach((c) => categorySchema.parse(c));
collections.forEach((c) => collectionSchema.parse(c));
if (prompts.length !== 50) throw new Error("Expected 50 prompts");
console.log(
  `Validated ${prompts.length} prompts, ${categories.length} categories, ${collections.length} collections; ${missing} missing image files.`,
);
if (missing) process.exitCode = 1;
