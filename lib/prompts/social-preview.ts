import doubleExposurePrompts from "@/content/additions/double-exposure-fashion-prompts.json";
import katanaPrompts from "@/content/additions/katana-streetwear-prompts.json";
import playlistPrompts from "@/content/additions/giant-playlist-prompts.json";
import referenceImpactPrompts from "@/content/additions/reference-impact-prompts.json";
import referenceImpactMemberships from "@/content/additions/reference-impact-memberships.json";
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
  [
    ...socialPrompts,
    ...genZPrompts,
    ...referenceImpactPrompts,
    ...doubleExposurePrompts,
    ...katanaPrompts,
    ...playlistPrompts,
  ].map((p) => p.id),
);
export const socialPreviewMemberships: Record<string, string[]> =
  Object.fromEntries(
    [
      ...new Set([
        ...Object.keys(genZMemberships),
        ...Object.keys(referenceImpactMemberships),
      ]),
    ].map((slug) => [
      slug,
      [
        ...(genZMemberships[slug as keyof typeof genZMemberships] || []),
        ...(referenceImpactMemberships[
          slug as keyof typeof referenceImpactMemberships
        ] || []),
      ],
    ]),
  );
export const socialProfileIds = socialPrompts
  .filter((p) => p.aspect_ratio === "1:1")
  .map((p) => p.id);
