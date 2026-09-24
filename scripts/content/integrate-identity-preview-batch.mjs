import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const sourceMapPath = process.argv[2];
if (!sourceMapPath) throw new Error("Usage: node scripts/content/integrate-identity-preview-batch.mjs <private-source-map.json>");

const sourceMap = JSON.parse(await fs.readFile(sourceMapPath, "utf8"));
if (sourceMap.policy_version !== "identity-expression-age-v2") throw new Error("Unexpected policy version");
if (!Array.isArray(sourceMap.items) || sourceMap.items.length === 0) throw new Error("No preview items supplied");

const catalogFiles = [
  "content/prompts.json",
  "content/expansion/prompts.json",
  "content/additions/creative-prompts.json",
];
const collectionFiles = [
  "content/collections.json",
  "content/expansion/collections.json",
  "content/additions/creative-collections.json",
];
const catalogs = await Promise.all(catalogFiles.map(async (file) => JSON.parse(await fs.readFile(file, "utf8"))));
const collections = await Promise.all(collectionFiles.map(async (file) => JSON.parse(await fs.readFile(file, "utf8"))));
const provenance = JSON.parse(await fs.readFile("content/image-provenance.json", "utf8"));
const publicManifest = [];
const integrated = [];

for (const item of sourceMap.items) {
  for (const field of ["slug", "source", "age_directive", "expression_directive", "alt"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) throw new Error(`${item.slug || "Unknown item"}: missing ${field}`);
  }
  if (!Array.isArray(item.identity_reference_ids) || item.identity_reference_ids.length === 0) {
    throw new Error(`${item.slug}: missing logical identity references`);
  }

  const matches = [];
  catalogs.forEach((catalog, catalogIndex) => {
    const promptIndex = catalog.findIndex((prompt) => prompt.slug === item.slug);
    if (promptIndex >= 0) matches.push({ catalogIndex, promptIndex, prompt: catalog[promptIndex] });
  });
  if (matches.length !== 1) throw new Error(`${item.slug}: expected exactly one catalog record, found ${matches.length}`);
  const match = matches[0];
  const prompt = match.prompt;
  const width = prompt.image_width;
  const height = prompt.image_height;
  if (!Number.isInteger(width) || !Number.isInteger(height)) throw new Error(`${item.slug}: missing target dimensions`);

  const bytes = await fs.readFile(item.source);
  const sourceHash = createHash("sha256").update(bytes).digest("hex");
  const metadata = await sharp(bytes).metadata();
  if (!["png", "jpeg", "webp"].includes(metadata.format) || metadata.width < width || metadata.height < height) {
    throw new Error(`${item.slug}: source is too small or unsupported`);
  }

  const stem = `${item.slug}-identity-v2-${sourceHash.slice(0, 10)}`;
  const previewPath = `/previews/${stem}.webp`;
  const thumbnailPath = `/previews/${stem}-thumb.webp`;
  const preview = await sharp(bytes).rotate().resize(width, height, { fit: "cover" }).webp({ quality: 86 }).toBuffer();
  const thumbnail = await sharp(bytes).rotate().resize(Math.round(width / 2), Math.round(height / 2), { fit: "cover" }).webp({ quality: 80 }).toBuffer();
  await fs.mkdir("public/previews", { recursive: true });
  await fs.writeFile(path.join("public", previewPath), preview);
  await fs.writeFile(path.join("public", thumbnailPath), thumbnail);

  const previous = provenance.find((entry) => entry.slug === item.slug);
  const originalAsset = previous?.source_sha256 === sourceHash ? previous.previous_asset : previous;
  const record = {
    slug: item.slug,
    brief: prompt.image_brief,
    tool: "Codex built-in image generation",
    identity_policy_version: sourceMap.policy_version,
    identity_reference_ids: item.identity_reference_ids,
    age_directive: item.age_directive,
    expression_directive: item.expression_directive,
    reference_binding: "Private reference binding is intentionally excluded from production data.",
    source_sha256: sourceHash,
    source_width: metadata.width,
    source_height: metadata.height,
    reviewed_at: sourceMap.reviewed_at,
    review_status: "accepted",
    review_method: sourceMap.review_method,
    status: "generated",
    alt: item.alt,
    preview: {
      path: previewPath,
      width,
      height,
      bytes: preview.length,
      sha256: createHash("sha256").update(preview).digest("hex"),
    },
    thumbnail: {
      path: thumbnailPath,
      width: Math.round(width / 2),
      height: Math.round(height / 2),
      bytes: thumbnail.length,
      sha256: createHash("sha256").update(thumbnail).digest("hex"),
    },
    ...(originalAsset ? { previous_asset: originalAsset } : {}),
  };

  if (previous) provenance[provenance.indexOf(previous)] = record;
  else provenance.push(record);
  Object.assign(prompt, {
    preview_image_url: previewPath,
    thumbnail_url: thumbnailPath,
    preview_review_status: "approved",
    image_alt: item.alt,
  });
  if (originalAsset?.preview?.path) {
    for (const collectionCatalog of collections) {
      for (const collection of collectionCatalog) {
        if (collection.featured_image === originalAsset.preview.path) {
          collection.featured_image = previewPath;
        }
      }
    }
  }

  publicManifest.push({
    slug: item.slug,
    title: prompt.title,
    catalog: catalogFiles[match.catalogIndex],
    identity_policy_version: sourceMap.policy_version,
    identity_reference_ids: item.identity_reference_ids,
    age_directive: item.age_directive,
    expression_directive: item.expression_directive,
    scene_prompt: prompt.image_brief,
    precedence: "The identity policy, logical identity references, age directive and expression directive override any legacy fictional-persona details inside the scene prompt; the scene prompt controls composition, styling and creative mechanism.",
    preview_image_url: previewPath,
    thumbnail_url: thumbnailPath,
    image_alt: item.alt,
    source_sha256: sourceHash,
  });
  integrated.push({ slug: item.slug, previewPath, thumbnailPath, width, height });
}

for (const [index, file] of catalogFiles.entries()) {
  await fs.writeFile(file, `${JSON.stringify(catalogs[index], null, 2)}\n`);
}
for (const [index, file] of collectionFiles.entries()) {
  await fs.writeFile(file, `${JSON.stringify(collections[index], null, 2)}\n`);
}
await fs.writeFile("content/image-provenance.json", `${JSON.stringify(provenance, null, 2)}\n`);
const auditDirectory = "docs/audits/identity-expression-policy-2026-09-24";
await fs.mkdir(auditDirectory, { recursive: true });
await fs.writeFile(path.join(auditDirectory, "selected-preview-generation-manifest.json"), `${JSON.stringify({
  generated_at: sourceMap.reviewed_at,
  policy_version: sourceMap.policy_version,
  private_reference_paths_committed: false,
  items: publicManifest,
}, null, 2)}\n`);

console.log(JSON.stringify({ integrated }, null, 2));
