import sharp from "sharp";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt = "PicMagic — Turn your photos into something magical";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const bytes = await sharp(
    await readFile(
      join(
        process.cwd(),
        "public/previews/golden-hour-draped-in-tradition.webp",
      ),
    ),
  )
    .resize(400, 500)
    .png()
    .toBuffer();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fff",
        color: "#232522",
        padding: 55,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "62%",
        }}
      >
        <div style={{ fontSize: 35, fontWeight: 700, color: "#c94839" }}>
          PicMagic.
        </div>
        <div
          style={{
            fontSize: 66,
            lineHeight: 1.08,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          Turn your photos into something magical.
        </div>
        <div style={{ fontSize: 23, color: "#696c66" }}>
          Choose a look. Get the magic prompt. · picmagic.in
        </div>
      </div>

      <img
        src={`data:image/png;base64,${bytes.toString("base64")}`}
        width={360}
        height={520}
        alt=""
        style={{ objectFit: "cover", borderRadius: 18 }}
      />
    </div>,
    size,
  );
}
