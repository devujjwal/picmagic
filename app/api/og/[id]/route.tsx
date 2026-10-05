/* eslint-disable @next/next/no-img-element -- ImageResponse requires native img elements. */
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { getCatalog } from "@/lib/content";
import { BrandMark, BrandWordmark } from "@/components/ui/brand-logo";
export const runtime = "nodejs";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return new Response("Not found", { status: 404 });
  const p = (await getCatalog()).prompts.find((p) => p.id === id);
  if (!p) return new Response("Not found", { status: 404 });
  let image: string;
  try {
    const bytes = p.preview_image_url.startsWith("/previews/")
      ? await readFile(join(process.cwd(), "public", p.preview_image_url))
      : Buffer.from(
          await (
            await fetch(p.preview_image_url, {
              signal: AbortSignal.timeout(8000),
            })
          ).arrayBuffer(),
        );
    image = `data:image/png;base64,${(await sharp(bytes).resize(504, 630, { fit: "cover" }).png().toBuffer()).toString("base64")}`;
  } catch {
    return new Response("Preview unavailable", { status: 503 });
  }
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fff",
        color: "#232522",
      }}
    >
      <img
        src={image}
        width={504}
        height={630}
        alt=""
        style={{ objectFit: "cover" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 55,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <BrandMark size={44} />
          <BrandWordmark height={34} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 17,
              color: "#696c66",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {p.style.slice(0, 2).join(" · ")}
          </div>
          <div style={{ fontSize: 54, lineHeight: 1.13, letterSpacing: -1 }}>
            {p.title}
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#696c66" }}>
          Get the magic prompt · picmagic.in
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3600",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
