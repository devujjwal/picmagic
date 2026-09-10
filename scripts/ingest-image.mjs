import fs from "node:fs/promises";
import sharp from "sharp";
const [slug, source] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(slug || "") || !source)
  throw new Error("Provide slug and generated source path");
await fs.mkdir("public/previews", { recursive: true });
await sharp(source)
  .resize(960, 1200, { fit: "cover" })
  .webp({ quality: 85 })
  .toFile(`public/previews/${slug}.webp`);
await sharp(source)
  .resize(480, 600, { fit: "cover" })
  .webp({ quality: 80 })
  .toFile(`public/previews/${slug}-thumb.webp`);
const path = "content/image-provenance.json";
const records = JSON.parse(await fs.readFile(path, "utf8"));
const row = records.find((p) => p.slug === slug);
if (!row) throw new Error("Unknown slug");
row.status = "generated";
row.review_status = "pending";
delete row.reviewed_at;
delete row.review_method;
row.source_path = source;
row.generated_at = new Date().toISOString();
await fs.writeFile(path, JSON.stringify(records, null, 2) + "\n");
console.log(`Saved ${slug}`);
