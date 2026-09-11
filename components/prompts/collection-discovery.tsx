import Link from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import type { Collection, Prompt } from "@/types/content";
import {
  discoverCollections,
  type CollectionMedium,
} from "@/lib/prompts/collections";
import { PreviewImage } from "./preview-image";
export function CollectionDiscovery({
  collections,
  prompts,
  contextPrompts,
  medium,
  path,
}: {
  collections: Collection[];
  prompts: Prompt[];
  contextPrompts?: Prompt[];
  medium: CollectionMedium;
  path: string;
}) {
  const picks = discoverCollections({
    collections,
    prompts,
    medium,
    contextIds: contextPrompts?.map((p) => p.id),
    excludePath: path,
  });
  if (!picks.length) return null;
  return (
    <section className="section" aria-label="Explore collections">
      <div className="section-head">
        <div>
          <h2>Explore collections</h2>
          <p>A few more ways to find your next idea.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {picks.map(({ collection, members }) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="flex items-center gap-4 rounded-xl border border-[var(--line)] p-3 hover:bg-[var(--soft)]"
          >
            <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
              <PreviewImage
                src={members[0].thumbnail_url}
                alt=""
                sizes="64px"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                {collection.name.replace(/ — reel ideas$/, "")}
              </span>
              <span className="mt-1 block text-xs text-muted">
                {members.length}{" "}
                {medium === "reel" ? "reel concepts" : "photo ideas"}
              </span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
