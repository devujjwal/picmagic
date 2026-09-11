"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin, serverClient } from "@/lib/supabase/server";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "@/types/content";
import { editorialIssues } from "@/lib/prompts/editorial";
import { personaIssues } from "@/lib/prompts/persona";
export type ActionState = { error?: string; success?: string; id?: string };
function message(error: unknown) {
  console.error(
    "[admin] mutation failed",
    error instanceof Error ? error.message : "Database rejected mutation",
  );
  return "Unable to save. Check required fields, unique URLs and your connection, then try again.";
}
function invalidate() {
  updateTag("catalog");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/api/search");
}
export async function login(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  try {
    const db = await serverClient();
    const { error } = await db.auth.signInWithPassword(parsed.data);
    if (error)
      return { error: "Unable to sign in. Check your details and try again." };
    const {
      data: { user },
    } = await db.auth.getUser();
    const { data: role } = await db
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user?.id || "")
      .maybeSingle();
    if (!role) {
      await db.auth.signOut();
      return { error: "This account does not have administrator access." };
    }
  } catch {
    return { error: "Sign-in is temporarily unavailable." };
  }
  redirect("/admin");
}
export async function logout() {
  const { db } = await requireAdmin();
  await db.auth.signOut();
  redirect("/admin/login");
}
export async function savePrompt(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db } = await requireAdmin();
  try {
    const input = JSON.parse(String(form.get("payload")));
    const now = new Date().toISOString();
    const id = z.uuid().parse(input.id);
    const { data: existing, error: readError } = await db
      .from("prompts")
      .select("created_at,published_at")
      .eq("id", id)
      .maybeSingle();
    if (readError) return { error: message(readError) };
    const parsed = promptSchema.safeParse({
      ...input,
      created_at: existing?.created_at || now,
      updated_at: now,
      // Preserve first publication history even when the editor unpublishes
      // without reloading the form. Redirect history depends on this value.
      published_at: existing?.published_at || (input.is_published ? now : null),
    });
    if (!parsed.success)
      return {
        error: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .slice(0, 4)
          .join(" · "),
      };
    if (parsed.data.is_published) {
      const issues = [
        ...personaIssues(parsed.data),
        ...editorialIssues(parsed.data),
      ];
      if (parsed.data.preview_review_status !== "approved")
        issues.push(
          "Review the preview against the current concept before publishing.",
        );
      if (issues.length) return { error: issues.join(" · ") };
    }
    const { error } = await db.from("prompts").upsert(parsed.data);
    if (error) return { error: message(error) };
    invalidate();
    return { success: "Prompt saved.", id: parsed.data.id };
  } catch (error) {
    return { error: message(error) };
  }
}
export async function duplicatePrompt(form: FormData) {
  const { db } = await requireAdmin();
  const id = z.uuid().parse(form.get("id"));
  const { data, error } = await db
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error("Unable to duplicate this prompt.");
  const newId = crypto.randomUUID();
  const row = promptSchema.parse({
    ...data,
    id: newId,
    slug: `${data.slug.slice(0, 100)}-copy-${newId.slice(0, 8)}`,
    title: `${data.title.slice(0, 145)} (copy)`,
    editorial_review_version: null,
    is_published: false,
    is_indexable: false,
    is_featured: false,
    is_trending: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: null,
  });
  const { error: insertError } = await db.from("prompts").insert(row);
  if (insertError) throw new Error("Unable to duplicate this prompt.");
  redirect(`/admin/prompts/${newId}`);
}
export async function saveCategory(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db } = await requireAdmin();
  const parsed = categorySchema.safeParse({
    id: form.get("id"),
    slug: form.get("id"),
    name: form.get("name"),
    description: form.get("description"),
    seo_title: form.get("seo_title"),
    is_indexable: form.get("is_indexable") === "on",
  });
  if (!parsed.success)
    return { error: "Add a valid URL slug, name and useful description." };
  const { error } = await db.from("categories").upsert(parsed.data);
  if (error) return { error: message(error) };
  invalidate();
  return { success: "Category saved." };
}
export async function saveCollection(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db } = await requireAdmin();
  try {
    const parsed = collectionSchema.safeParse(
      JSON.parse(String(form.get("payload"))),
    );
    if (!parsed.success)
      return { error: parsed.error.issues.map((i) => i.message).join(" · ") };
    const record = parsed.data;
    if (record.is_indexable) {
      const { count } = await db
        .from("prompts")
        .select("id", { count: "exact", head: true })
        .in("id", record.prompt_ids)
        .eq("is_published", true);
      if ((count || 0) < 4 || record.description.length < 100)
        return {
          error:
            "Indexable collections need at least four published prompts and a substantive introduction.",
        };
    }
    if (
      record.start_date &&
      record.end_date &&
      record.end_date < record.start_date
    )
      return { error: "The end date must follow the start date." };
    const { prompt_ids, ...rest } = record;
    const { error } = await db.rpc("save_collection", {
      record: rest,
      members: prompt_ids,
    });
    if (error) return { error: message(error) };
    invalidate();
    return { success: "Collection saved." };
  } catch (error) {
    return { error: message(error) };
  }
}
