import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { duplicatePrompt } from "@/features/admin/actions";
export default async function Prompts() {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from("prompts")
    .select("id,title,is_published,category_id")
    .order("updated_at", { ascending: false });
  if (error) throw new Error("Unable to load prompts.");
  return (
    <>
      <div className="admin-title">
        <h1>Your prompt library</h1>
        <Link className="button" href="/admin/prompts/new">
          New prompt
        </Link>
      </div>
      <div className="admin-list">
        {data.map((p) => (
          <div className="admin-list-item" key={p.id}>
            <Link href={`/admin/prompts/${p.id}`}>
              <strong>{p.title}</strong>
              <small>
                {p.category_id} · {p.is_published ? "Published" : "Draft"}
              </small>
            </Link>
            <form action={duplicatePrompt}>
              <input type="hidden" name="id" value={p.id} />
              <button className="button secondary small">Duplicate</button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
