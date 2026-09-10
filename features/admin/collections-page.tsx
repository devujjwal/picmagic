import { requireAdmin } from "@/lib/supabase/server";
import { collectionSchema } from "@/types/content";
import { CollectionForm } from "./collection-form";
export async function CollectionsAdmin({
  seasonal = false,
}: {
  seasonal?: boolean;
}) {
  const { db } = await requireAdmin();
  const [collections, prompts] = await Promise.all([
    db
      .from("collections")
      .select("*,collection_prompts(prompt_id)")
      .order("name"),
    db.from("prompts").select("id,title,is_published").order("title"),
  ]);
  if (collections.error || prompts.error)
    throw new Error("Unable to load collections");
  return (
    <>
      <div className="admin-title">
        <h1>{seasonal ? "Seasonal collections" : "Curated collections"}</h1>
      </div>
      <details className="mb-6">
        <summary>Add a collection</summary>
        <CollectionForm prompts={prompts.data} seasonal={seasonal} />
      </details>
      {collections.data
        .filter((c) =>
          seasonal ? c.kind === "seasonal" : c.kind !== "seasonal",
        )
        .map((c) => (
          <details className="mb-5" key={c.id}>
            <summary className="py-3 cursor-pointer">
              {c.name} · {c.active ? "Active" : "Inactive"}
            </summary>
            <CollectionForm
              initial={collectionSchema.parse({
                ...c,
                prompt_ids: (
                  c.collection_prompts as { prompt_id: string }[]
                ).map((x) => x.prompt_id),
              })}
              prompts={prompts.data}
            />
          </details>
        ))}
    </>
  );
}
