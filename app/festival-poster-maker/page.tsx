import Link from "@/components/ui/site-link";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { PosterEditor } from "@/features/poster-maker/editor";
import { getDesign, posterDesigns } from "@/features/poster-maker/designs";
import { getCatalog } from "@/lib/content";
import { getRelatedGuideLinks } from "@/lib/blog/repository";
import { RelatedGuides } from "@/components/blog/related-guides";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import { promptPath } from "@/types/content";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import "./poster.css";
export const metadata = makeMetadata(
  "Free Festival Poster Maker — Diwali, Durga Puja & Dussehra | PicMagic",
  "Make English or Hindi festival greetings with your logo, photo and message. Download a free PNG in square, portrait or story size. Uploads stay on your device.",
  "/festival-poster-maker",
);
export default async function FestivalPosterPage({
  searchParams,
}: {
  searchParams: Promise<{ design?: string }>;
}) {
  const design = getDesign((await searchParams).design);
  // Optional discovery links must not take the on-device editor offline.
  const catalog = await getCatalog().catch(() => null);
  const templates = (catalog?.prompts ?? []).filter(
    (p) =>
      isPromptSeoEligible(p) &&
      posterDesigns.some((d) => d.templateId === p.id),
  );
  const guides = [
    ...new Map(
      (
        await Promise.all(
          templates.map((p) =>
            getRelatedGuideLinks({ promptId: p.id }).catch(() => []),
          ),
        )
      )
        .flat()
        .map((g) => [g.id, g]),
    ).values(),
  ].slice(0, 3);
  return (
    <div className="container poster-page">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Festival poster maker", path: "/festival-poster-maker" },
        ]}
      />
      <header className="section poster-intro">
        <div className="eyebrow">A little celebration. A lot of you.</div>
        <h1>
          Free festival poster maker.
          <br />
          <em>Beautifully framed.</em>
        </h1>
        <p>
          Make a festival greeting for your people or your business. Choose a
          design, add your words and download—no account, watermark or payment.
        </p>
        <div className="poster-badges">
          <span>English + हिन्दी</span>
          <span>3 social-ready sizes</span>
          <span>Private, on-device editing</span>
        </div>
      </header>
      <PosterEditor designId={design.id} />
      <RelatedGuides guides={guides} />
      <section className="section poster-guide">
        <h2>From a thought to a thoughtful greeting.</h2>
        <div>
          <article>
            <h3>Choose a celebration</h3>
            <p>
              Start with Diwali, Durga Puja or Dussehra artwork. The artwork is
              AI-generated; your text and logo are placed precisely by the
              editor.
            </p>
          </article>
          <article>
            <h3>Add your own voice</h3>
            <p>
              Use an English or Hindi preset, or write a personal message. Add
              your name, website, email, phone or other details—or leave them
              blank. Only include information you want visible when you share
              the downloaded poster. Add only a logo or photo you have
              permission to use. Photo placement does not generate a new scene
              or remove its background.
            </p>
          </article>
          <article>
            <h3>Download and share</h3>
            <p>
              Export a square post, portrait post or story PNG. Review spelling
              and cropping before sharing. Nothing is automatically posted, and
              your edits are not stored online.
            </p>
          </article>
        </div>
        <p>
          Want a completely new AI scene instead?{" "}
          <Link href="/create">Build a photo prompt</Link> or{" "}
          <Link href="/ai-prompts">browse photo ideas</Link>, generate it in
          your chosen image tool, then bring the result here.
        </p>
        {templates.length > 0 && (
          <nav aria-label="Festival artwork prompts">
            <h2>Explore the artwork and complete prompts</h2>
            <p>
              Review each festival’s example, customization guidance and
              limitations before creating your own artwork.
            </p>
            <ul>
              {templates.map((p) => (
                <li key={p.id}>
                  <Link href={promptPath(p)}>{p.title}</Link>
                </li>
              ))}
            </ul>
            <p>
              <Link href="/collections/indian-festivals">
                Explore festival portraits and celebrations →
              </Link>
            </p>
          </nav>
        )}
      </section>
      <noscript>
        <p>
          This private editor needs JavaScript. You can still{" "}
          <Link href="/ai-prompts">browse our copyable photo prompts</Link>.
        </p>
      </noscript>
    </div>
  );
}
