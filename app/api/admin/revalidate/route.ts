import { revalidatePath, revalidateTag } from "next/cache";
import { serverClient, hasSupabase } from "@/lib/supabase/server";
import { isTrustedOrigin } from "@/lib/request-origin";
/** Authenticated bulk-import handoff; accepts no arbitrary paths, tags or shared secrets. */
export async function POST(request: Request) {
  if (!hasSupabase())
    return Response.json({ error: "Unavailable" }, { status: 503 });
  if (
    !isTrustedOrigin(request, [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.ADMIN_ALLOWED_ORIGINS,
    ])
  )
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const db = await serverClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data: role, error } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !role)
    return Response.json({ error: "Forbidden" }, { status: 403 });
  revalidateTag("catalog", { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/sitemap-images.xml");
  revalidatePath("/api/search");
  return Response.json({ revalidated: true });
}
