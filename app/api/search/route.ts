import { getCatalog } from "@/lib/content";
export async function GET() {
  const { prompts } = await getCatalog();
  return Response.json(
    prompts.map(
      ({
        id,
        title,
        description,
        category_id,
        style,
        occasion,
        tags,
        subject,
        slug,
        prompt_type,
        thumbnail_url,
        image_alt,
      }) => ({
        id,
        title,
        description,
        category_id,
        style,
        occasion,
        tags,
        subject,
        slug,
        prompt_type,
        thumbnail_url,
        image_alt,
      }),
    ),
    {
      headers: {
        // The catalog itself is cached and invalidated on publish. Avoid a
        // separate CDN TTL that could expose stale, unpublished records.
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
