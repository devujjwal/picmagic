import type { Collection, Prompt } from "@/types/content";
import { activeCollection } from "./discovery";
import { orderForDiscovery } from "./editorial";
export type CollectionMedium = "photo" | "reel";
const isReel = (p: Prompt) =>
  p.prompt_type === "reel" || p.prompt_type === "video";
/** Recommend only real, useful destinations; never infer routes from tags or names. */
export function discoverCollections({
  collections,
  prompts,
  medium,
  contextIds,
  excludePath,
  limit = 4,
  now = new Date(),
}: {
  collections: Collection[];
  prompts: Prompt[];
  medium: CollectionMedium;
  contextIds?: string[];
  excludePath?: string;
  limit?: number;
  now?: Date;
}) {
  const available = new Map(
    prompts
      .filter(
        (p) =>
          p.is_published &&
          p.preview_review_status === "approved" &&
          (medium === "reel" ? isReel(p) : !isReel(p)),
      )
      .map((p) => [p.id, p]),
  );
  const context = contextIds && new Set(contextIds);
  const seen = new Set<string>();
  return collections
    .flatMap((collection) => {
      if (
        !activeCollection(collection, now) ||
        collection.description.trim().length < 100 ||
        `/collections/${collection.slug}` === excludePath ||
        seen.has(collection.slug)
      )
        return [];
      const members = orderForDiscovery(
        [...new Set(collection.prompt_ids)].flatMap((id) =>
          available.has(id) ? [available.get(id)!] : [],
        ),
      );
      // Do not mistake four duplicate IDs, drafts or dangling references for four looks.
      if (members.length < 4) return [];
      const overlap = context
        ? members.filter((p) => context.has(p.id)).length
        : 0;
      if (context && !overlap) return [];
      seen.add(collection.slug);
      return [{ collection, members, overlap }];
    })
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        (b.members[0].distinctiveness_score || 0) -
          (a.members[0].distinctiveness_score || 0) ||
        b.collection.priority - a.collection.priority ||
        a.collection.slug.localeCompare(b.collection.slug),
    )
    .slice(0, Math.min(4, Math.max(0, limit)));
}
