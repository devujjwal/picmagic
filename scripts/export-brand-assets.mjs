// Offline artwork export. Uses the font parser already bundled with Next.js.
// node scripts/export-brand-assets.mjs /path/to/Manrope[wght].ttf
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import fontkitModule from "next/dist/compiled/@next/font/dist/fontkit/index.js";
import sharp from "sharp";

const fontBytes = await readFile(process.argv[2]);
const font = fontkitModule.default(fontBytes).getVariation({ wght: 700 });
function outline(text) {
  const run = font.layout(text);
  let x = 0;
  const paths = ["", ""];
  const bounds = [];
  run.glyphs.forEach((glyph, index) => {
    const position = run.positions[index];
    const path = glyph.path
      .scale(100 / font.unitsPerEm, -100 / font.unitsPerEm)
      .translate(x + (position.xOffset * 100) / font.unitsPerEm, 80);
    if (path.toSVG()) {
      paths[index < 3 ? 0 : 1] += path.toSVG();
      bounds.push(path.bbox);
    }
    x += (position.xAdvance * 100) / font.unitsPerEm - 2;
  });
  const minX = Math.min(...bounds.map((b) => b.minX));
  const minY = Math.min(...bounds.map((b) => b.minY));
  const width = Math.max(...bounds.map((b) => b.maxX)) - minX;
  const height = Math.max(...bounds.map((b) => b.maxY)) - minY;
  return {
    viewBox: `${minX} ${minY} ${width} ${height}`,
    width,
    height,
    paths,
  };
}
const artwork = {
  font: "Manrope Bold (700)",
  source: "https://github.com/google/fonts/tree/main/ofl/manrope",
  sourceSha256: createHash("sha256").update(fontBytes).digest("hex"),
  compact: outline("PicMagic"),
  spaced: outline("Pic Magic"),
};
await writeFile(
  "config/brand-wordmark.json",
  JSON.stringify(artwork, null, 2) + "\n",
);
const dir = "brand-assets/PicMagic-Final-Social-Logo";
const icon = await readFile("app/icon.svg", "utf8");
const symbol = [...icon.matchAll(/<path d="([^"]+)"/g)]
  .map((match) => `<path d="${match[1]}"/>`)
  .join("\n");
const wordmark = artwork.spaced;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <title>Pic Magic — Magic Frame</title>
  <rect width="1080" height="1080" fill="#ffffff"/>
  <g transform="translate(277.5 195) scale(7.5)" fill="#c94839">${symbol}</g>
  <svg x="275" y="738" width="530" height="${(530 * wordmark.height) / wordmark.width}" viewBox="${wordmark.viewBox}">
    <path fill="#232522" d="${wordmark.paths[0]}"/>
    <path fill="#c94839" d="${wordmark.paths[1]}"/>
  </svg>
</svg>\n`;
await writeFile(`${dir}/picmagic-magic-frame-master.svg`, svg);
for (const platform of ["instagram", "x", "facebook"]) {
  await sharp(Buffer.from(svg))
    .flatten({ background: "#fff" })
    .png()
    .toFile(`${dir}/picmagic-${platform}-profile.png`);
}
console.log("Exported consistent outlined wordmarks and three social PNGs.");
