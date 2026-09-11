import { toPromptCard } from "@/lib/prompts/card-data";
import Link from "@/components/ui/site-link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCatalog } from "@/lib/content";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import { PreviewImage } from "@/components/prompts/preview-image";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { LocalDiscovery } from "@/components/prompts/local-discovery";
import { CollectionDiscovery } from "@/components/prompts/collection-discovery";
import { StructuredData } from "@/components/ui/structured-data";
import { AdSlot } from "@/components/ads/ad-slot";
import { isHomepageEligible } from "@/lib/prompts/editorial";
import { promptPath } from "@/lib/routes";
export const metadata = makeMetadata(site.title, site.description, "/");
export default async function Home() {
  const { prompts, categories, collections } = await getCatalog();
  if (!prompts.length)
    return (
      <div className="container">
        <section className="empty-state">
          <h1>A new wave of inspiration is on its way.</h1>
          <p>Create a photo idea while we prepare the library.</p>
          <Link className="button" href="/create">
            Create a prompt
          </Link>
        </section>
      </div>
    );
  const approved = prompts
    .filter((p) => isHomepageEligible(p) && p.is_featured)
    .sort((a, b) => a.trending_rank - b.trending_rank);
  const seen = new Set<string>();
  const creative = approved.filter((p) => {
    if (seen.has(p.preview_image_url)) return false;
    seen.add(p.preview_image_url);
    return true;
  });
  const hero = creative[0];
  const next = creative.slice(1, 5);
  const more = creative.slice(5, 12);
  return (
    <div className="container home-bottom">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
        }}
      />
      <section className="creative-hero">
        <div className="creative-hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} /> Your photo. Another possibility.
          </div>
          <h1>See yourself in a story worth creating.</h1>
          <p>
            Try a miniature world, a paper portrait or a campaign built around
            your product.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/ai-prompts">
              Explore photo ideas <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" href="/create">
              Create a prompt
            </Link>
          </div>
          <p className="creative-how">
            Choose a look → Copy the prompt → Add your references in your image
            tool.
          </p>
          <small>Prompts here. Create images in your chosen tool.</small>
        </div>
        {hero && (
          <figure className="creative-hero-figure">
            <Link
              className="creative-hero-image"
              href={promptPath(hero)}
              aria-label={hero.title}
            >
              <PreviewImage
                src={hero.preview_image_url}
                alt={hero.image_alt}
                priority
                sizes="(max-width:760px) 90vw, 480px"
              />
            </Link>
            <figcaption>
              <Link href={promptPath(hero)}>
                {hero.title} <ArrowRight size={14} />
              </Link>
              <span>AI-generated example</span>
            </figcaption>
          </figure>
        )}
      </section>
      {next.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <h2>Ordinary references. Unexpected worlds.</h2>
              <p>Creative treatments that keep your identity at the centre.</p>
            </div>
            <Link
              className="text-link"
              href="/collections/creative-transformations"
            >
              Explore transformations <ArrowRight size={15} />
            </Link>
          </div>
          <PromptGrid prompts={next} />
        </section>
      )}
      <AdSlot placement="home-feed-1" />
      {more.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <h2>A different way to picture it</h2>
              <p>
                From paper portraits to fashion campaigns and family memories.
              </p>
            </div>
          </div>
          <PromptGrid prompts={more} />
        </section>
      )}
      <CollectionDiscovery
        collections={collections}
        prompts={prompts}
        medium="photo"
        path="/"
      />
      <section className="creative-tools section">
        <div>
          <div className="eyebrow">Useful, every day</div>
          <h2>Give a good photo a little care.</h2>
          <p>
            Write focused instructions for lighting, restoration, backgrounds or
            professional portraits. Keep the details that make it yours.
          </p>
          <Link className="button" href="/enhance-photo">
            Enhance photo <ArrowRight size={16} />
          </Link>
        </div>
        <div>
          <div className="eyebrow">Plan the next scene</div>
          <h2>Turn an idea into a reel.</h2>
          <p>
            Explore concepts and timed scenes. Still previews are labelled
            clearly; video generation happens in your chosen tool.
          </p>
          <Link className="button secondary" href="/reel-prompts">
            Explore reels <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <LocalDiscovery prompts={prompts.map(toPromptCard)} mode="recent" />
      <section className="section">
        <div className="section-head">
          <h2>Find your next idea</h2>
        </div>
        <div className="all-categories">
          {categories
            .filter(
              (c) =>
                c.slug !== "reels" &&
                prompts.some((p) => p.category_id === c.id),
            )
            .map((c) => (
              <Link key={c.id} href={`/ai-prompts/${c.slug}`}>
                {c.name}
                <ArrowRight size={14} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
