import type { Category, Collection, Prompt } from "@/types/content";
import { editorialIssues } from "@/lib/prompts/editorial";
import { isConsolidatedPrompt } from "@/content/consolidations";

const isReel = (prompt: Prompt) =>
  prompt.prompt_type === "reel" || prompt.prompt_type === "video";

function activeSeoCollection(collection: Collection, now: Date) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return (
    collection.active &&
    (collection.kind !== "seasonal" ||
      Boolean(
        collection.start_date &&
        collection.end_date &&
        collection.start_date <= date &&
        collection.end_date >= date,
      ))
  );
}

/** One SEO publication gate shared by metadata, sitemaps and discovery. */
export function isPromptSeoEligible(prompt: Prompt) {
  return (
    prompt.is_published &&
    !isConsolidatedPrompt(prompt) &&
    prompt.is_indexable &&
    prompt.preview_review_status === "approved" &&
    editorialIssues(prompt).length === 0
  );
}

export function categorySeoMembers(category: Category, prompts: Prompt[]) {
  return prompts.filter(
    (prompt) =>
      !isReel(prompt) &&
      prompt.category_id === category.id &&
      isPromptSeoEligible(prompt),
  );
}

export function isCategorySeoEligible(category: Category, prompts: Prompt[]) {
  return (
    category.is_indexable &&
    category.slug !== "cinematic" &&
    category.slug !== "reels" &&
    category.description.trim().length >= 120 &&
    categorySeoMembers(category, prompts).length >= 4
  );
}

export function collectionSeoMembers(
  collection: Collection,
  prompts: Prompt[],
) {
  const ids = new Set(collection.prompt_ids);
  return prompts.filter(
    (prompt) => ids.has(prompt.id) && isPromptSeoEligible(prompt),
  );
}

export function isCollectionSeoEligible(
  collection: Collection,
  prompts: Prompt[],
  now = new Date(),
) {
  if (
    !collection.is_indexable ||
    !activeSeoCollection(collection, now) ||
    collection.description.trim().length < 120
  )
    return false;
  const members = collectionSeoMembers(collection, prompts);
  return (
    members.length >= 4 &&
    new Set(members.map((prompt) => prompt.preview_image_url)).size >= 4
  );
}
