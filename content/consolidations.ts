/** Approved editorial consolidations, without changing stored publication flags. */
export const doubleExposureGuidePath = "/guides/double-exposure-fashion";
export const doubleExposureIds = [
  "6727215b-f9ae-5474-bd60-3794b6d315d8",
  "3aff6d60-6a50-5e55-a405-fdcf55529787",
] as const;
export const editorialRedirects = [
  {
    source: "/ai-prompts/men/double-exposure-fashion-men",
    destination: doubleExposureGuidePath,
    permanent: true,
  },
  {
    source: "/ai-prompts/women/double-exposure-fashion-women",
    destination: doubleExposureGuidePath,
    permanent: true,
  },
  {
    source: "/ai-prompts/cinematic",
    destination: "/collections/cinematic",
    permanent: true,
  },
];
export function isConsolidatedPrompt(prompt: { id: string }) {
  return doubleExposureIds.some((id) => id === prompt.id);
}
export function consolidatedPath(path: string) {
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? "" : path.slice(boundary);
  return (
    (editorialRedirects.find((r) => r.source === pathname)?.destination ??
      pathname) + suffix
  );
}
