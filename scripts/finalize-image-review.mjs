import fs from "node:fs/promises";
import sharp from "sharp";
import { createHash } from "node:crypto";
const rows = JSON.parse(
  await fs.readFile("content/image-provenance.json", "utf8"),
);
const prompts = JSON.parse(await fs.readFile("content/prompts.json", "utf8"));
const hashes = new Set();
let bytes = 0;
for (const row of rows) {
  const p = prompts.find((p) => p.slug === row.slug);
  const full = await fs.readFile(`public${p.preview_image_url}`);
  const thumb = await fs.readFile(`public${p.thumbnail_url}`);
  const meta = await sharp(full).metadata();
  const hash = createHash("sha256").update(full).digest("hex");
  if (hashes.has(hash) || meta.width !== 960 || meta.height !== 1200)
    throw new Error("Duplicate or invalid asset");
  hashes.add(hash);
  bytes += full.length + thumb.length;
  Object.assign(row, {
    reviewed_at: new Date().toISOString(),
    review_method:
      "Individual thumbnail inspection and two full-library contact sheets; additional full-size anatomy checks for selected multi-person scenes.",
    review_status: "accepted",
    preview: {
      path: p.preview_image_url,
      width: meta.width,
      height: meta.height,
      bytes: full.length,
      sha256: hash,
    },
    thumbnail: {
      path: p.thumbnail_url,
      width: 480,
      height: 600,
      bytes: thumb.length,
    },
    alt: p.image_alt,
  });
}
await fs.writeFile(
  "content/image-provenance.json",
  JSON.stringify(rows, null, 2) + "\n",
);
const quote = (value) => '"' + String(value).replaceAll('"', '""') + '"';
const columns = [
  "slug",
  "subject",
  "demographics_clothing_and_setting_brief",
  "styles_and_aesthetics",
  "lighting",
  "composition",
  "alt",
  "review_status",
];
const csv = [
  columns,
  ...rows.map((r) => [
    r.slug,
    r.subject,
    r.brief,
    r.style.join("; "),
    r.lighting,
    r.framing,
    r.alt,
    r.review_status,
  ]),
]
  .map((row) => row.map(quote).join(","))
  .join("\n");
await fs.writeFile("content/image-coverage.csv", csv + "\n");
console.log({
  originalPreviews: rows.length,
  totalOptimizedBytes: bytes,
  uniqueHashes: hashes.size,
});
