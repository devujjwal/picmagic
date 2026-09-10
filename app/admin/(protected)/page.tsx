import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
export default async function Admin() {
  const { db } = await requireAdmin();
  const { count, error } = await db
    .from("prompts")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error("Unable to load the studio.");
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Welcome to your studio.</h1>
          <p>{count || 0} ideas in your library.</p>
        </div>
        <Link className="button" href="/admin/prompts/new">
          Add a prompt
        </Link>
      </div>
      <div className="all-categories">
        <Link href="/admin/prompts">Manage prompts →</Link>
        <Link href="/admin/categories">Edit categories →</Link>
        <Link href="/admin/collections">Curate collections →</Link>
        <Link href="/admin/seasonal">Plan seasonal content →</Link>
      </div>
    </>
  );
}
