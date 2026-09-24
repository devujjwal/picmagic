import { ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/content";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import {
  collectionSeoMembers,
  isCollectionSeoEligible,
} from "@/lib/seo/eligibility";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { PreviewImage } from "@/components/prompts/preview-image";
import Link from "@/components/ui/site-link";
import { site } from "@/config/site";

export const metadata = makeMetadata(
  "Curated AI Photo and Reel Prompt Collections | PicMagic",
  "Explore curated PicMagic collections for portraits, profile pictures, cinematic transformations, Indian celebrations, dating profiles and reels.",
  "/collections",
);

export default async function Collections() {
  const catalog = await getCatalog();
  const collections = catalog.collections
    .filter((collection) =>
      isCollectionSeoEligible(collection, catalog.prompts),
    )
    .map((collection) => ({
      collection,
      members: collectionSeoMembers(collection, catalog.prompts),
    }))
    .sort(
      (a, b) =>
        b.collection.priority - a.collection.priority ||
        a.collection.name.localeCompare(b.collection.name),
    );

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
        ]}
      />
      <header className="page-heading">
        <div className="eyebrow">Curated ways to explore</div>
        <h1>Find a collection for the moment.</h1>
        <p>
          Browse focused groups of photo and reel ideas, each chosen around a
          clear mood, purpose or occasion.
        </p>
      </header>
      <section className="collection-hub" aria-labelledby="collection-list">
        <div className="section-head">
          <div>
            <h2 id="collection-list">Explore curated collections</h2>
            <p>{collections.length} useful paths into the PicMagic library.</p>
          </div>
        </div>
        <div className="collection-hub-grid">
          {collections.map(({ collection, members }) => {
            const image = collection.featured_image || members[0].thumbnail_url;
            return (
              <article className="collection-hub-card" key={collection.id}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="collection-hub-image"
                  aria-label={`Explore ${collection.name}`}
                >
                  <PreviewImage
                    src={image}
                    alt={`${collection.name} AI prompt collection preview`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <div className="collection-hub-copy">
                  <p className="card-meta">
                    {members.length} {members.length === 1 ? "idea" : "ideas"}
                  </p>
                  <h3>
                    <Link href={`/collections/${collection.slug}`}>
                      {collection.name}
                    </Link>
                  </h3>
                  <p>{collection.description}</p>
                  <Link
                    className="text-link"
                    href={`/collections/${collection.slug}`}
                  >
                    Explore collection <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "PicMagic prompt collections",
          description:
            "Curated AI photo and reel prompt collections for clear moods, purposes and occasions.",
          url: `${site.url}/collections`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: collections.map(({ collection }, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: collection.name,
              url: `${site.url}/collections/${collection.slug}`,
            })),
          },
        }}
      />
    </div>
  );
}
