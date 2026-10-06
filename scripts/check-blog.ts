import fs from "node:fs";
import articles from "../content/blog/articles.json";
import authors from "../content/blog/authors.json";
import { allPrompts, allCollections } from "../content/catalog";
import categories from "../content/categories.json";
import { articleSchema, authorSchema } from "../lib/blog/schema";
import { articleContentIssues } from "../lib/blog/validation";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "../types/content";
const catalog = {
  prompts: allPrompts.map((p) => promptSchema.parse(p)),
  categories: categories.map((c) => categorySchema.parse(c)),
  collections: allCollections.map((c) => collectionSchema.parse(c)),
};
const authorIds = new Set(authors.map((a) => authorSchema.parse(a).id));
const rows = articles.map((a) => articleSchema.parse(a));
const errors: string[] = [];
if (new Set(rows.map((a) => a.slug)).size !== rows.length)
  errors.push("Duplicate blog slugs");
for (const a of rows) {
  errors.push(
    ...articleContentIssues(a, catalog).map((i) => `${a.slug}: ${i}`),
  );
  if (!authorIds.has(a.author_id)) errors.push(`${a.slug}: Unknown author`);
  if (
    a.related_articles.some(
      (slug) => slug === a.slug || !rows.some((r) => r.slug === slug),
    )
  )
    errors.push(`${a.slug}: Invalid related article`);
  for (const img of [
    a.featured_image,
    ...a.body.flatMap((b) => (b.type === "image" ? [b.image] : [])),
  ]) {
    if (img.url.startsWith("/") && !fs.existsSync(`public${img.url}`))
      errors.push(`${a.slug}: Missing asset ${img.url}`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Blog validation passed: ${rows.length} drafts, known authors, eligible conversions and public assets.`,
  );
