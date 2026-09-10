import { requireAdmin } from "@/lib/supabase/server";
import { categorySchema } from "@/types/content";
import { CategoryForm } from "@/features/admin/category-form";
export default async function Categories() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("categories").select("*").order("name");
  if (error) throw new Error("Unable to load categories");
  return (
    <>
      <div className="admin-title">
        <h1>Categories</h1>
      </div>
      <details className="mb-6">
        <summary>Add a category</summary>
        <CategoryForm />
      </details>
      {data.map((c) => (
        <details key={c.id} className="mb-4">
          <summary className="py-3 cursor-pointer">{c.name}</summary>
          <CategoryForm category={categorySchema.parse(c)} />
        </details>
      ))}
    </>
  );
}
