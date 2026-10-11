// Preserve the website's original vector logo on a reviewed generated poster.
// Usage: node scripts/content/finish-festival-brand-preview.mjs source.png output.png left top width
// This does not generate artwork or alter the source. Coordinates are source pixels.
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const [source, output, leftArg, topArg, widthArg] = process.argv.slice(2);
const [left, top, width] = [leftArg, topArg, widthArg].map(Number);
if (!source || !output || source === output || ![left, top, width].every(Number.isInteger) || left < 0 || top < 0 || width < 100) {
  throw new Error('Provide separate source/output and integer left, top, width (>=100).');
}
const wordmark = JSON.parse(await fs.readFile('config/brand-wordmark.json', 'utf8')).compact;
const component = await fs.readFile('components/ui/brand-logo.tsx', 'utf8');
const markPaths = [...component.split('/** Outlined')[0].matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
if (markPaths.length !== 2) throw new Error('Original brand mark structure changed; review before exporting.');
const logoWidth = 64 + 12 + wordmark.width * 44 / wordmark.height;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * 64 / logoWidth)}" viewBox="0 0 ${logoWidth} 64"><g fill="#c94839">${markPaths.map((d) => `<path d="${d}"/>`).join('')}</g><svg x="76" y="10" width="${wordmark.width * 44 / wordmark.height}" height="44" viewBox="${wordmark.viewBox}"><path fill="#232522" d="${wordmark.paths[0]}"/><path fill="#c94839" d="${wordmark.paths[1]}"/></svg></svg>`;
const bytes = await fs.readFile(source);
const meta = await sharp(bytes).metadata();
const logoHeight = Math.round(width * 64 / logoWidth);
if (left + width > meta.width || top + logoHeight > meta.height) throw new Error('Logo outside source.');
await sharp(bytes).composite([{ input: Buffer.from(logo), left, top }]).png().toFile(output);
console.log(JSON.stringify({ source, output, sourceSha256: createHash('sha256').update(bytes).digest('hex'), sourceWidth: meta.width, sourceHeight: meta.height, logo: { left, top, width, height: logoHeight }, outputSha256: createHash('sha256').update(await fs.readFile(output)).digest('hex') }));
