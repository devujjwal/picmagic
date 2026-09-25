import type { Prompt } from "@/types/content";
import { isHomepageEligible, orderForDiscovery } from "./editorial";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import { DISCOVERY_MAX_COUNTER } from "@/config/discovery";

const bounded = (counter: number) =>
  Number.isInteger(counter) && counter > 0 && counter <= DISCOVERY_MAX_COUNTER
    ? counter
    : 0;
const compare = (a: Prompt, b: Prompt) =>
  a.trending_rank - b.trending_rank || a.id.localeCompare(b.id);
const unique = (prompts: Prompt[]) =>
  Array.from(new Map(prompts.map((p) => [p.id, p])).values());
export function eligibleDiscoveryPhotos(prompts: Prompt[]) {
  return unique(
    prompts.filter(
      (p) =>
        (p.prompt_type === "photo" || p.prompt_type === "photo_edit") &&
        isPromptSeoEligible(p),
    ),
  );
}
export function declaredSubjectGroup(subject: string) {
  const label = subject.trim().toLowerCase();
  const groups: Record<string, string> = {
    man: "man",
    men: "man",
    "young man": "man",
    woman: "woman",
    women: "woman",
    "young woman": "woman",
    kid: "child",
    kids: "child",
    child: "child",
    children: "child",
    couple: "couple",
    family: "family",
    product: "product",
  };
  return groups[label] || "unknown";
}

/** Greedy balanced deck, not probabilistic ranking. Every record occurs once. */
export function diversityDeck(prompts: Prompt[]) {
  const remaining = [...prompts].sort(compare);
  const counts = new Map<string, number>();
  const keys = (p: Prompt) => [
    `category:${p.category_id}`,
    `subject:${declaredSubjectGroup(p.subject)}`,
    `style:${p.style[0]?.trim().toLowerCase() || "unknown"}`,
  ];
  const score = (p: Prompt) =>
    keys(p).reduce((sum, key) => sum + (counts.get(key) || 0), 0);
  const deck: Prompt[] = [];
  while (remaining.length) {
    let best = 0;
    for (let i = 1; i < remaining.length; i++)
      if (score(remaining[i]) < score(remaining[best])) best = i;
    const [selected] = remaining.splice(best, 1);
    deck.push(selected);
    for (const key of keys(selected))
      counts.set(key, (counts.get(key) || 0) + 1);
  }
  return deck;
}
function cycle<T>(items: T[], offset: number) {
  const start = items.length ? offset % items.length : 0;
  return [...items.slice(start), ...items.slice(0, start)];
}

export function selectHomepage(prompts: Prompt[], counter = 0) {
  counter = bounded(counter);
  const pool = eligibleDiscoveryPhotos(prompts).filter(isHomepageEligible);
  const featured = pool.filter((p) => p.is_featured).sort(compare);
  const chosen: Prompt[] = [];
  const assets = new Set<string>();
  const take = (deck: Prompt[], count: number) => {
    const result: Prompt[] = [];
    for (const p of deck) {
      if (result.length === count) break;
      if (chosen.some((q) => q.id === p.id) || assets.has(p.preview_image_url))
        continue;
      chosen.push(p);
      assets.add(p.preview_image_url);
      result.push(p);
    }
    return result;
  };
  const hero = take(cycle(featured, counter), 1)[0];
  const next = take(
    counter ? cycle(diversityDeck(featured), counter * 4) : featured,
    4,
  );
  const more = take(
    counter ? cycle(diversityDeck(pool), counter * 7) : featured,
    7,
  );
  return { hero, next, more, ids: chosen.map((p) => p.id) };
}

/** Partition first. No record ever crosses a numbered page or intent lane. */
export function orderExplore(prompts: Prompt[], counter = 0) {
  const baseline = orderForDiscovery(eligibleDiscoveryPhotos(prompts));
  counter = bounded(counter);
  if (!counter) return baseline;
  const result: Prompt[] = [];
  for (let start = 0; start < baseline.length; start += 24) {
    const page = baseline.slice(start, start + 24);
    for (const utility of [false, true]) {
      const lane = page.filter(
        (p) => (p.content_intent === "utility") === utility,
      );
      // Anchor the first returning deck outside the default leading eight.
      // Subsequent eight-card steps retain freshness even in a twelve-card lane.
      const deck = [
        ...diversityDeck(lane.slice(8)),
        ...diversityDeck(lane.slice(0, 8)),
      ];
      result.push(...cycle(deck, (counter - 1) * (lane.length > 8 ? 8 : 1)));
    }
  }
  return result;
}
