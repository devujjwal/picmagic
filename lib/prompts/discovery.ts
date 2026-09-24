import type { Prompt, Collection } from "@/types/content";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
export function searchPrompts(prompts: Prompt[], query: string) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return prompts
    .filter((p) => {
      const text = [
        p.title,
        p.description,
        p.category_id,
        p.subject,
        p.occasion,
        ...p.style,
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => text.includes(t));
    })
    .sort(
      (a, b) =>
        Number(b.title.toLowerCase().includes(query.toLowerCase())) -
        Number(a.title.toLowerCase().includes(query.toLowerCase())),
    );
}
export function relatedPrompts(current: Prompt, all: Prompt[], limit = 8) {
  const currentIsReel = ["reel", "video"].includes(current.prompt_type);
  const score = (p: Prompt) => {
    const sharedStyles = p.style.filter((x) =>
      current.style.includes(x),
    ).length;
    const sharedTags = p.tags.filter((x) => current.tags.includes(x)).length;
    return (
      Number(p.subject === current.subject) * 4 +
      Number(p.category_id === current.category_id) * 3 +
      sharedStyles * 2 +
      Math.min(sharedTags, 3) +
      Number(p.occasion === current.occasion && p.occasion !== "Everyday") * 2 +
      Number(p.content_intent === current.content_intent)
    );
  };
  return (
    Array.from(new Map(all.map((p) => [p.id, p])).values())
      .filter(
        (p) =>
          p.id !== current.id &&
          isPromptSeoEligible(p) &&
          ["reel", "video"].includes(p.prompt_type) === currentIsReel &&
          p.preview_image_url !== current.preview_image_url &&
          score(p) >= 4,
      )
      .sort((a, b) => score(b) - score(a) || a.trending_rank - b.trending_rank)
      // Avoid filling a whole rail with repeated posters or the same visual style.
      .reduce<Prompt[]>((selected, candidate) => {
        if (selected.length >= Math.max(0, limit)) return selected;
        if (
          selected.some(
            (p) => p.preview_image_url === candidate.preview_image_url,
          )
        )
          return selected;
        const style = candidate.style[0];
        if (selected.filter((p) => p.style[0] === style).length >= 3)
          return selected;
        return [...selected, candidate];
      }, [])
  );
}
export function activeCollection(c: Collection, now = new Date()) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return (
    c.active &&
    (c.kind !== "seasonal" ||
      Boolean(
        c.start_date &&
        c.end_date &&
        c.start_date <= date &&
        c.end_date >= date,
      ))
  );
}
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function pageNumber(value: unknown) {
  const n = Number(value ?? 1);
  return Number.isSafeInteger(n) && n > 0 ? n : 1;
}
