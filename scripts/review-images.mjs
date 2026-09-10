import sharp from "sharp";
import fs from "node:fs/promises";
const prompts = JSON.parse(await fs.readFile("content/prompts.json", "utf8"));
for (let batch = 0; batch < 2; batch++) {
  const layers = [];
  for (let i = 0; i < 25; i++) {
    const p = prompts[batch * 25 + i];
    try {
      const input = await sharp(`public${p.preview_image_url}`)
        .resize(250, 312)
        .toBuffer();
      layers.push({ input, top: Math.floor(i / 5) * 344, left: (i % 5) * 260 });
      const label = Buffer.from(
        `<svg width="250" height="30"><rect width="100%" height="100%" fill="white"/><text x="5" y="20" font-size="12" fill="#202020">${batch * 25 + i + 1}. ${p.title.slice(0, 31).replaceAll("&", "&amp;")}</text></svg>`,
      );
      layers.push({
        input: label,
        top: Math.floor(i / 5) * 344 + 312,
        left: (i % 5) * 260,
      });
    } catch {
      console.log(`Pending ${p.slug}`);
    }
  }
  await sharp({
    create: { width: 1300, height: 1720, channels: 3, background: "#eeeeee" },
  })
    .composite(layers)
    .jpeg({ quality: 88 })
    .toFile(`docs/qa/image-library-${batch + 1}.jpg`);
}
