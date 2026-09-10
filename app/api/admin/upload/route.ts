import { serverClient, hasSupabase } from "@/lib/supabase/server";
import sharp from "sharp";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!hasSupabase())
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const db = await serverClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data: role } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!role) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 10 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type,
      )
    )
      return Response.json(
        { error: "Choose a JPEG, PNG, WebP or AVIF image under 10 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const processor = sharp(bytes, { limitInputPixels: 40000000 });
    const meta = await processor.metadata();
    if (
      !meta.width ||
      !meta.height ||
      meta.width < 400 ||
      meta.height < 400 ||
      !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format || "")
    )
      return Response.json(
        { error: "Use a valid image at least 400 × 400 pixels." },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    const full = await processor
      .rotate()
      .resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
    const thumb = await sharp(full.data)
      .resize(480, 600, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();
    for (const [name, data] of [
      [`${id}.webp`, full.data],
      [`${id}-thumb.webp`, thumb],
    ] as const) {
      const { error } = await db.storage.from("previews").upload(name, data, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error("Storage write failed");
    }
    return Response.json({
      preview_image_url: db.storage.from("previews").getPublicUrl(`${id}.webp`)
        .data.publicUrl,
      thumbnail_url: db.storage
        .from("previews")
        .getPublicUrl(`${id}-thumb.webp`).data.publicUrl,
      image_width: full.info.width,
      image_height: full.info.height,
    });
  } catch {
    return Response.json(
      { error: "Unable to process this image. Try another file." },
      { status: 400 },
    );
  }
}
