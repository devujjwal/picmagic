import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/server";
import { PromptForm } from "@/features/admin/prompt-form";
import { promptSchema, categorySchema } from "@/types/content";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [{ data: p, error }, { data: categories, error: cError }] =
    await Promise.all([
      db.from("prompts").select("*").eq("id", id).maybeSingle(),
      db.from("categories").select("*"),
    ]);
  if (error || cError) throw new Error("Unable to load prompt");
  if (!p) notFound();
  return (
    <>
      <div className="admin-title">
        <h1>Edit your idea.</h1>
      </div>
      <PromptForm
        initial={promptSchema.parse(p)}
        categories={categories!.map((c) => categorySchema.parse(c))}
      />
    </>
  );
}
