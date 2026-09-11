import type { Prompt } from "@/types/content";

export const EDITORIAL_VERSION = "why-ai-2026-09-v1";
/** Scores describe an editor's judgment, not an automatically measured model quality. */
export function editorialIssues(
  p: Pick<
    Prompt,
    | "distinctiveness_score"
    | "why_ai"
    | "content_intent"
    | "editorial_review_version"
    | "is_featured"
    | "is_trending"
    | "prompt_type"
    | "reel"
  >,
) {
  const issues: string[] = [];
  if (p.editorial_review_version !== EDITORIAL_VERSION)
    issues.push("Complete the Why AI editorial review before publishing.");
  if (!p.why_ai || p.why_ai.trim().length < 40)
    issues.push(
      "Explain the specific visual production or practical utility that AI makes possible.",
    );
  if (!p.content_intent)
    issues.push("Choose creative inspiration or practical utility.");
  if (!p.distinctiveness_score || p.distinctiveness_score < 3)
    issues.push("Rework or merge scores 1–2 before publication.");
  if (p.content_intent === "creative" && (p.distinctiveness_score || 0) < 4)
    issues.push(
      "Creative discovery needs a distinctive idea scoring 4–5, not just style adjectives.",
    );
  if (
    (p.is_featured || p.is_trending) &&
    (p.content_intent !== "creative" || (p.distinctiveness_score || 0) < 4)
  )
    issues.push(
      "Feature only creative concepts scoring 4–5; keep utility in its own discovery lane.",
    );
  if (
    ["reel", "video"].includes(p.prompt_type) &&
    (!p.reel?.hook?.trim() ||
      !p.reel?.progression?.trim() ||
      !p.reel?.payoff?.trim())
  )
    issues.push("Reels need an explicit hook, progression and payoff.");
  return issues;
}
export function isHomepageEligible(p: Prompt) {
  return (
    p.is_published &&
    p.preview_review_status === "approved" &&
    p.editorial_review_version === EDITORIAL_VERSION &&
    p.content_intent === "creative" &&
    (p.distinctiveness_score || 0) >= 4 &&
    editorialIssues(p).length === 0
  );
}
export function orderForDiscovery(prompts: Prompt[]) {
  return [...prompts].sort(
    (a, b) =>
      Number(a.content_intent === "utility") -
        Number(b.content_intent === "utility") ||
      (b.distinctiveness_score || 0) - (a.distinctiveness_score || 0) ||
      a.trending_rank - b.trending_rank ||
      a.slug.localeCompare(b.slug),
  );
}

/** First-screen variety: do not let a run of one category crowd out other transformations. */
export function homepageHighlights(prompts: Prompt[], limit: number) {
  const ranked = orderForDiscovery(prompts.filter(isHomepageEligible));
  const picked: Prompt[] = [];
  const groups = new Set<string>();
  for (const p of ranked) {
    const group =
      p.prompt_type === "reel" || p.prompt_type === "video"
        ? p.subject
        : p.category_id;
    if (!groups.has(group)) {
      picked.push(p);
      groups.add(group);
    }
    if (picked.length === limit) return picked;
  }
  for (const p of ranked) {
    if (!picked.some((x) => x.id === p.id)) picked.push(p);
    if (picked.length === limit) break;
  }
  return picked;
}
