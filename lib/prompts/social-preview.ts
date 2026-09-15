import socialPrompts from "@/content/additions/social-prompts.json";
import genZPrompts from "@/content/additions/gen-z-prompts.json";
import genZMemberships from "@/content/additions/gen-z-memberships.json";
/** Explicit local review only. Hosted contexts and indexable builds must not expose drafts. */
export function socialPreviewEnabled(
  env: Record<string, string | undefined> = process.env,
) {
  return (
    env.CONTENT_SOURCE === "seed" &&
    env.PICMAGIC_SOCIAL_PREVIEW === "true" &&
    env.NEXT_PUBLIC_INDEXING_ENABLED === "false" &&
    !env.NETLIFY &&
    !env.CONTEXT &&
    !env.CI
  );
}
export const socialPreviewIds = new Set(
  [...socialPrompts, ...genZPrompts].map((p) => p.id),
);
export const socialPreviewMemberships: Record<string, string[]> =
  genZMemberships;
export const socialProfileIds = socialPrompts
  .filter((p) => p.aspect_ratio === "1:1")
  .map((p) => p.id);
