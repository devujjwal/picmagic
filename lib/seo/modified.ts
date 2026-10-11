import type { Prompt } from "@/types/content";
import { promptGuides } from "@/content/seo-guides";
import { promptWorkflows } from "@/content/prompt-workflows";
import {
  remainingGuidanceDate,
  remainingPromptFaqs,
} from "@/content/remaining-guidance";

/** Compare instants, not mixed ISO strings (offsets/date-only values can differ). */
export function latestModified(...values: (string | undefined)[]) {
  return values
    .filter(
      (value): value is string =>
        Boolean(value) && Number.isFinite(Date.parse(value!)),
    )
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .at(-1);
}

/** Keep the sitemap and visible-page schema aligned with maintained guidance. */
export function promptModified(prompt: Prompt) {
  return latestModified(
    prompt.updated_at,
    promptGuides[prompt.slug]?.updatedAt,
    promptWorkflows[prompt.slug]?.updatedAt,
    remainingPromptFaqs[prompt.slug] ? remainingGuidanceDate : undefined,
  );
}
