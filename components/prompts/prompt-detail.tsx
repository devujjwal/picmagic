import { discoverCollections } from "@/lib/prompts/collections";
import { FriendsTripCreator } from "@/features/generator/friends-trip-creator";
import Link from "@/components/ui/site-link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { promptPath, type Prompt, type Catalog } from "@/types/content";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PreviewMedia } from "./preview-media";
import { DetailActions } from "@/components/share/detail-actions";
import { PromptGrid } from "./prompt-grid";
import { relatedPrompts } from "@/lib/prompts/discovery";
import { AdSlot } from "@/components/ads/ad-slot";
import { StructuredData } from "@/components/ui/structured-data";
import { site } from "@/config/site";
export function PromptDetail({
  prompt: p,
  catalog,
  preview = false,
}: {
  prompt: Prompt;
  catalog: Catalog;
  preview?: boolean;
}) {
  const category = catalog.categories.find((c) => c.id === p.category_id);
  const isReel = p.prompt_type === "reel" || p.prompt_type === "video";
  const parent = isReel ? "/reel-prompts" : `/ai-prompts/${p.category_id}`;
  const collections = discoverCollections({
    collections: catalog.collections,
    prompts: catalog.prompts,
    medium: isReel ? "reel" : "photo",
    contextIds: [p.id],
  }).map((pick) => pick.collection);
  const canonical = site.url + promptPath(p);
  const imageUrl = new URL(p.preview_image_url, site.url).href;
  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: category?.name || "Photo ideas", path: parent },
          { name: p.title, path: promptPath(p) },
        ]}
      />
      {preview && (
        <p className="notice">
          Private draft preview. This page is not published or indexable.
        </p>
      )}
      <AdSlot placement="prompt-detail-top" />
      <div className="detail-grid">
        <div>
          <div
            className="detail-visual"
            style={{ aspectRatio: `${p.image_width} / ${p.image_height}` }}
          >
            <PreviewMedia prompt={p} priority detail />
          </div>
          <p className="detail-visual-note">
            {p.poster_role === "source-reference"
              ? `Original reference photograph of ${p.people_count ?? "the supplied"} friends. A ${p.place_name || "travel"} concept poster and video are awaiting generation and review. `
              : isReel && !p.preview_video
                ? "Still concept image, not a video preview. "
                : p.preview_video
                  ? `${Math.round(p.preview_video.duration)}-second AI-generated preview excerpt. `
                  : "AI-generated inspiration. "}
            Your results may look different.
          </p>
        </div>
        <div className="detail-copy">
          <div className="eyebrow">{p.style.slice(0, 3).join(" · ")}</div>
          <h1>{p.title}</h1>
          <p className="description">{p.description}</p>
          <div className="prompt-box">
            <h2>
              <Sparkles size={16} />{" "}
              {isReel ? "Your video prompt" : "The magic prompt"}
            </h2>
            <p className="prompt-text">{p.prompt_text}</p>
          </div>
          {!preview && (
            <DetailActions
              id={p.id}
              title={p.title}
              text={p.prompt_text}
              path={promptPath(p)}
            />
          )}
          <dl className="detail-facts">
            {[
              ["Aspect ratio", p.aspect_ratio],
              ["Subject", p.subject],
              ["Framing", p.framing],
              ["Lighting", p.lighting],
              ["Camera direction", p.camera],
              ["Occasion", p.occasion],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <h2 className="text-sm font-semibold">Suggested for</h2>
          <div className="tool-list">
            {p.suggested_tools.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="fine-print">
            Tool support and results vary. A suggestion is not a compatibility
            guarantee.
          </p>
          {p.prompt_type === "photo_edit" && (
            <p className="notice">
              Use a photo you have permission to edit. These instructions ask
              the AI tool to retain your appearance; exact identity preservation
              cannot be guaranteed.
            </p>
          )}
          <div className="collection-links mt-5">
            {collections.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="chip">
                {c.name}
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      {p.why_ai && (
        <section className="detail-insight" aria-labelledby="concept-heading">
          <div className="eyebrow">Why this concept works</div>
          <h2 id="concept-heading">A look built for AI, not a stock filter.</h2>
          <p>{p.why_ai}</p>
        </section>
      )}
      {p.reel_template && (
        <FriendsTripCreator initial={p.reel_template.variables} />
      )}
      {p.reel && (
        <section className="section">
          <div className="section-head">
            <div>
              <h2>Your reel, scene by scene</h2>
              <p>
                {p.reel.duration} seconds · {p.reel.concept}
              </p>
            </div>
          </div>
          <div className="reel-scenes">
            {p.reel.scenes.map((s, i) => (
              <div className="reel-scene" key={i}>
                <h3>
                  Scene {i + 1} · {s.start}–{s.end}s
                </h3>
                <p>{s.action}</p>
                <p>
                  <strong>Transition:</strong> {s.transition}
                </p>
              </div>
            ))}
          </div>
          <div className="prompt-box">
            <h2>Make it ready to post</h2>
            <p>{p.reel.caption}</p>
            <p className="mt-3">{p.reel.hashtags.join(" ")}</p>
            <p className="mt-3">Music mood: {p.reel.music_mood}</p>
          </div>
        </section>
      )}
      <AdSlot placement="prompt-detail-inline" />
      {p.faqs.length > 0 && (
        <section className="faq">
          <h2>A little help getting started</h2>
          {p.faqs.map((f) => (
            <details key={f.question}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: p.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }}
          />
        </section>
      )}
      <section className="section">
        <div className="section-head">
          <div>
            <h2>A little more like this</h2>
            <p>Keep the inspiration going.</p>
          </div>
          <Link className="text-link" href={parent}>
            Explore {category?.name.toLowerCase()} <ArrowUpRight size={15} />
          </Link>
        </div>
        <PromptGrid
          prompts={relatedPrompts(p, catalog.prompts)}
          source="related"
        />
        <AdSlot placement="prompt-related-feed" />
      </section>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: p.title,
          description: p.description,
          datePublished: p.published_at || p.created_at,
          dateModified: p.updated_at,
          primaryImageOfPage: {
            "@type": "ImageObject",
            "@id": `${canonical}#primaryimage`,
            url: imageUrl,
            contentUrl: imageUrl,
            caption: p.image_alt,
            width: p.image_width,
            height: p.image_height,
          },
          mainEntity: {
            "@type": "CreativeWork",
            "@id": `${canonical}#prompt`,
            name: p.title,
            description: p.description,
            image: { "@id": `${canonical}#primaryimage` },
            dateCreated: p.created_at,
            dateModified: p.updated_at,
            keywords: [...new Set([...p.style, ...p.tags])].join(", "),
            creator: {
              "@type": "Organization",
              name: site.name,
              url: site.url,
            },
          },
        }}
      />
    </div>
  );
}
