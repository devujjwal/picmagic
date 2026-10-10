import { posterDesigns } from "./designs";
export function posterMakerPath(
  templateId: string,
  slug: string,
): string | null {
  const design = posterDesigns.find(
    (d) => d.templateId === templateId && d.slug === slug,
  );
  if (design) return `/festival-poster-maker?design=${design.id}`;
  if (
    [
      "durga-puja-pandal-portrait",
      "navratri-dandiya-portrait",
      "diwali-courtyard-celebration",
    ].includes(slug)
  )
    return "/festival-poster-maker";
  return null;
}
export function isFestivalCollection(path: string) {
  return ["/collections/diwali", "/collections/indian-festivals"].includes(
    path,
  );
}
