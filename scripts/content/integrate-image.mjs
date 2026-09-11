// Integrate a visually reviewed ChatGPT export. Input is a JSON review record.
// Does not publish content, rewrite prompts, or generate/edit creative imagery.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const spec = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
for (const field of ['slug', 'source', 'prompt', 'alt', 'review']) {
  if (typeof spec[field] !== 'string' || !spec[field].trim()) throw new Error(`Missing ${field}`);
}
const codex = spec.provider === 'codex-built-in';
if (codex) {
  if (!spec.fallbackReason || !spec.source.includes('/.codex/generated_images/')) throw new Error('Codex fallback needs the owner-authorized limit reason and generated source path.');
} else if (!spec.conversation?.startsWith('https://chatgpt.com/c/')) throw new Error('A ChatGPT source conversation is required.');
if (spec.approved !== true) throw new Error('Visual review must be explicitly approved.');
const files = ['content/prompts.json', 'content/expansion/prompts.json'];
const catalogs = await Promise.all(files.map(async file => JSON.parse(await fs.readFile(file, 'utf8'))));
const matches = catalogs.flat().filter(p => [spec.slug, ...(spec.relatedSlugs || [])].includes(p.slug));
if (!matches.some(p => p.slug === spec.slug)) throw new Error('Unknown prompt slug');
for (const p of matches) {
  const hash = createHash('sha256').update(p.prompt_text).digest('hex');
  if (p.editorial_review_version === 'why-ai-2026-09-v1' && (spec.editorialReviewVersion !== p.editorial_review_version || spec.reviewedPromptHashes?.[p.slug] !== hash)) throw new Error(`Review must explicitly cover the current editorial concept: ${p.slug}`);
}
const bytes = await fs.readFile(spec.source);
const sourceHash = createHash('sha256').update(bytes).digest('hex');
const source = await sharp(bytes).metadata();
const width = spec.aspect_ratio === '9:16' ? 720 : 960;
const height = spec.aspect_ratio === '9:16' ? 1280 : 1200;
if (!['png', 'jpeg', 'webp'].includes(source.format) || source.width < width || source.height < height) throw new Error('Source is too small or unsupported.');
const stem = `${spec.slug}-${sourceHash.slice(0, 10)}`;
const preview = await sharp(bytes).rotate().resize(width, height, { fit: 'cover' }).webp({ quality: 84 }).toBuffer();
const thumbnail = await sharp(bytes).rotate().resize(width / 2, height / 2, { fit: 'cover' }).webp({ quality: 78 }).toBuffer();
await fs.mkdir('public/previews', { recursive: true });
await fs.writeFile(path.join('public/previews', `${stem}.webp`), preview);
await fs.writeFile(path.join('public/previews', `${stem}-thumb.webp`), thumbnail);
const rows = JSON.parse(await fs.readFile('content/image-provenance.json', 'utf8'));
for (const p of matches) {
  const previous = rows.find(r => r.slug === p.slug);
  const record = {
    slug: p.slug, brief: spec.prompt, ...(spec.exactPrompt !== false ? { exact_generation_prompt: spec.prompt } : {}),
    tool: codex ? 'Codex built-in image generation' : 'ChatGPT web image generation', source_path: spec.source,
    ...(codex ? { fallback_reason: spec.fallbackReason, owner_authorization: '2026-09-10: use Codex when ChatGPT limits are exhausted' } : {}),
    ...(Array.isArray(spec.editPrompts) ? { exact_edit_prompts: spec.editPrompts } : {}),
    source_conversation: spec.conversation || null, source_sha256: sourceHash,
    source_width: source.width, source_height: source.height,
    reviewed_at: new Date().toISOString(), review_status: 'accepted', review_method: spec.review,
    status: 'generated', alt: spec.alt, editorial_review_version: p.editorial_review_version, reviewed_prompt_sha256: createHash('sha256').update(p.prompt_text).digest('hex'),
    preview: { path: `/previews/${stem}.webp`, width, height, bytes: preview.length, sha256: createHash('sha256').update(preview).digest('hex') },
    thumbnail: { path: `/previews/${stem}-thumb.webp`, width: width / 2, height: height / 2, bytes: thumbnail.length },
    ...(previous?.source_sha256 === sourceHash ? {} : previous ? { previous_asset: previous } : {}),
  };
  if (previous?.source_sha256 !== sourceHash) {
    if (previous) rows[rows.indexOf(previous)] = record;
    else rows.push(record);
  }
  Object.assign(p, { preview_image_url: record.preview.path, thumbnail_url: record.thumbnail.path,
    preview_review_status: "approved", image_alt: spec.alt, image_brief: spec.prompt, image_width: width, image_height: height });
}
for (const [i, file] of files.entries()) await fs.writeFile(file, JSON.stringify(catalogs[i], null, 2) + '\n');
await fs.writeFile('content/image-provenance.json', JSON.stringify(rows, null, 2) + '\n');
console.log(JSON.stringify({ slugs: matches.map(p => p.slug), previewBytes: preview.length, thumbnailBytes: thumbnail.length, sourceHash }));
