import Link from "@/components/ui/site-link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  Bookmark,
  Heart,
  Clapperboard,
  Camera,
} from "lucide-react";
import { getCatalog } from "@/lib/content";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import { PreviewImage } from "@/components/prompts/preview-image";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { LocalDiscovery } from "@/components/prompts/local-discovery";
import { StructuredData } from "@/components/ui/structured-data";
import { AdSlot } from "@/components/ads/ad-slot";
import { activeCollection } from "@/lib/prompts/discovery";
import { promptPath } from "@/lib/routes";
export const metadata = makeMetadata(site.title, site.description, "/");
export default async function Home() {
  const { prompts, categories, collections } = await getCatalog();
  if (!prompts.length)
    return (
      <div className="container">
        <section className="empty-state">
          <h1>A new wave of inspiration is on its way.</h1>
          <p>Create a photo idea of your own while we prepare the library.</p>
          <Link className="button" href="/create">
            Create a prompt
          </Link>
        </section>
      </div>
    );
  const photo = prompts.filter(
    (p) => p.prompt_type === "photo" || p.prompt_type === "photo_edit",
  );
  const featured = photo.filter((p) => p.is_featured);
  const heroA = featured[0] || photo[0] || prompts[0],
    heroB = featured[1] || photo[1];
  const audiences = [
    ["Man", "men"],
    ["Woman", "women"],
    ["Couple", "couple"],
    ["Kid", "kids"],
    ["Family", "family"],
    ["Product", "product-photography"],
    ["Wedding", "wedding"],
    ["Travel", "travel"],
  ];
  const seasonal = collections
    .filter((c) => c.kind === "seasonal" && activeCollection(c))
    .sort((a, b) => b.priority - a.priority);
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
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> A little inspiration. Endless possibilities.
          </div>
          <h1>
            Turn your photos
            <br />
            into something
            <br />
            <em>magical.</em>
          </h1>
          <p>
            Discover beautiful AI photo ideas, enhancement prompts and reel
            concepts. Find a look that feels like you.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/ai-prompts">
              Explore photo ideas <ArrowUpRight size={17} />
            </Link>
            <Link className="button secondary" href="/enhance-photo">
              Enhance my photo
            </Link>
          </div>
          <p className="hero-note">
            <Check size={13} /> Free to explore. No sign-up. Just your
            imagination.
          </p>
        </div>
        <div className="hero-art">
          {heroA && (
            <Link
              href={promptPath(heroA)}
              className="hero-photo"
              aria-label={heroA.title}
            >
              <PreviewImage
                src={heroA.thumbnail_url}
                alt={heroA.image_alt}
                priority
                preoptimized
                sizes="(max-width:550px) 160px, 250px"
              />
            </Link>
          )}
          {heroB && (
            <Link
              href={promptPath(heroB)}
              className="hero-photo second"
              aria-label={heroB.title}
            >
              <PreviewImage
                src={heroB.thumbnail_url}
                alt={heroB.image_alt}
                priority
                preoptimized
                sizes="(max-width:550px) 160px, 250px"
              />
            </Link>
          )}
          <Sparkles size={42} className="floating-spark" />
          <div className="hero-caption">
            <span className="brand-mark">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>Your photo. A whole new story.</strong>
              <small>Choose a look. Get the magic prompt.</small>
            </div>
          </div>
        </div>
      </section>
      <div className="benefit-strip">
        <span>
          <Camera size={16} /> Beautiful ideas for every you
        </span>
        <span>
          <Bookmark size={16} /> Save the looks you love
        </span>
        <span>
          <Heart size={16} /> Always free to explore
        </span>
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>A little inspiration to start</h2>
            <p>Fresh looks worth making your own.</p>
          </div>
          <Link className="text-link" href="/ai-prompts">
            Explore all <ArrowRight size={15} />
          </Link>
        </div>
        <PromptGrid prompts={photo.filter((p) => p.is_trending).slice(0, 4)} />
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Who’s the inspiration?</h2>
            <p>A look for you. And everyone you love.</p>
          </div>
        </div>
        <div className="audience-grid">
          {audiences.map(([label, slug]) => {
            const p = photo.find((p) => p.category_id === slug);
            return (
              <Link
                className="audience-card"
                key={slug}
                href={`/ai-prompts/${slug}`}
              >
                <div className="audience-image">
                  {p && (
                    <PreviewImage
                      src={p.thumbnail_url}
                      alt={`${label} photo ideas`}
                      sizes="(max-width:550px) 70px, 120px"
                    />
                  )}
                </div>
                {label}
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Find your kind of beautiful</h2>
            <p>A mood, a moment, a completely new look.</p>
          </div>
        </div>
        <div className="collection-links">
          {collections
            .filter((c) => c.kind !== "seasonal")
            .map((c) => (
              <Link className="chip" href={`/collections/${c.slug}`} key={c.id}>
                {c.name} <ArrowUpRight size={13} />
              </Link>
            ))}
        </div>
      </section>
      <section className="enhance-banner">
        <div className="enhance-copy">
          <div className="eyebrow">
            <Sparkles size={13} /> A little polish. Still completely you.
          </div>
          <h2>
            Your best photo
            <br />
            is already yours.
          </h2>
          <p>
            Better light. A fresh background. A professional finish. Create a
            prompt that keeps you looking like you.
          </p>
          <Link className="button" href="/enhance-photo">
            Enhance my photo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="enhance-art">
          <PreviewImage
            src={
              photo.find((p) => p.category_id === "professional")
                ?.preview_image_url || heroA.preview_image_url
            }
            alt="Natural professional portrait with soft studio lighting"
            sizes="(max-width:550px) 180px, 500px"
          />
          <span className="enhance-label">
            Professional portrait inspiration
          </span>
        </div>
      </section>
      <AdSlot placement="home-feed-1" />
      {seasonal.map((c) => (
        <section className="section" key={c.id}>
          <div className="section-head">
            <div>
              <div className="eyebrow">In season</div>
              <h2>{c.name}</h2>
            </div>
            <Link className="text-link" href={`/collections/${c.slug}`}>
              Explore collection <ArrowRight size={14} />
            </Link>
          </div>
          {c.featured_image && (
            <Link
              className="seasonal-cover"
              href={`/collections/${c.slug}`}
              aria-label={`Explore ${c.name}`}
            >
              <PreviewImage
                src={c.featured_image}
                alt={`${c.name} collection inspiration`}
                sizes="(max-width: 760px) 100vw, 1200px"
              />
            </Link>
          )}
          <PromptGrid
            prompts={prompts
              .filter((p) => c.prompt_ids.includes(p.id))
              .slice(0, 4)}
          />
        </section>
      ))}
      {[
        [
          "couple",
          "Better, together",
          "Romantic ideas for your favourite person.",
        ],
        [
          "women",
          "Every shade of you",
          "From everyday beautiful to something extraordinary.",
        ],
        [
          "men",
          "Make it your own",
          "Portraits with character. Looks with confidence.",
        ],
        [
          "kids",
          "Small people. Big imaginations.",
          "A little wonder for their next favourite memory.",
        ],
        [
          "festival",
          "Moments worth celebrating",
          "Colour, tradition, and the people who make it special.",
        ],
      ].map(([slug, title, description]) => (
        <section className="section" key={slug}>
          <div className="section-head">
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <Link className="text-link" href={`/ai-prompts/${slug}`}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <PromptGrid
            prompts={photo.filter((p) => p.category_id === slug).slice(0, 4)}
          />
        </section>
      ))}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <Clapperboard size={13} /> A story in motion
            </div>
            <h2>Some moments deserve a reel</h2>
            <p>Scene-by-scene ideas, ready for your next creation.</p>
          </div>
          <Link className="text-link" href="/reel-prompts">
            Explore reels <ArrowRight size={14} />
          </Link>
        </div>
        <PromptGrid
          prompts={prompts.filter((p) => p.prompt_type === "reel").slice(0, 4)}
        />
      </section>
      <LocalDiscovery prompts={prompts} mode="recent" />
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Fresh from the inspiration board</h2>
            <p>Your next favourite might be right here.</p>
          </div>
        </div>
        <PromptGrid
          prompts={[...photo]
            .sort(
              (a, b) =>
                b.created_at.localeCompare(a.created_at) ||
                b.trending_rank - a.trending_rank,
            )
            .slice(0, 4)}
        />
      </section>
      <section className="how-strip" aria-label="How PicMagic works">
        {[
          ["01", "Choose a look", "Find an idea that catches your eye."],
          ["02", "Get the magic prompt", "Copy the ready-to-use instructions."],
          ["03", "Make it yours", "Paste into your favourite AI tool."],
        ].map(([n, title, description]) => (
          <div key={n}>
            <span className="step-number">{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="section">
        <div className="section-head">
          <h2>There’s more to explore</h2>
        </div>
        <div className="all-categories">
          {categories
            .filter((c) => c.slug !== "reels")
            .map((c) => (
              <Link key={c.id} href={`/ai-prompts/${c.slug}`}>
                {c.name}
                <ArrowUpRight size={15} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
