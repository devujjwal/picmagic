import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/server";
import { promptSchema, categorySchema } from "@/types/content";
import { PromptDetail } from "@/components/prompts/prompt-detail";
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data, error } = await db
    .from("prompts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load preview");
  if (!data) notFound();
  const { data: categories, error: cError } = await db
    .from("categories")
    .select("*");
  if (cError) throw new Error("Unable to load categories");
  return (
    <PromptDetail
      prompt={promptSchema.parse(data)}
      catalog={{
        prompts: [],
        categories: categories!.map((c) => categorySchema.parse(c)),
        collections: [],
      }}
      preview
    />
  );
}
