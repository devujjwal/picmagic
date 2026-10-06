import Image from "next/image";
import Link from "@/components/ui/site-link";
import { getDiscoverableArticles } from "@/lib/blog/repository";
import { articlePath, type Article } from "@/lib/blog/schema";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export async function generateMetadata() {
  return makeMetadata(
    "PicMagic Blog: AI Photo Guides, Ideas & Lab",
    "Choose AI photo concepts, understand reference photos and learn how to adapt PicMagic prompts with practical guides and honest visual examples.",
    "/blog",
    (await getDiscoverableArticles()).length > 0,
  );
}
function Card({ article: a }: { article: Article }) {
  return (
    <article className="blog-index-card">
      <Link href={articlePath(a)}>
        <Image
          src={a.featured_image.url}
          alt={a.featured_image.alt}
          width={a.featured_image.width}
          height={a.featured_image.height}
          sizes="(max-width: 767px) 90vw, 400px"
        />
        <div>
          <p className="eyebrow">{a.primary_topic}</p>
          <h3>{a.title}</h3>
          <p>{a.excerpt}</p>
          <span>Read guide →</span>
        </div>
      </Link>
    </article>
  );
}
export default async function Blog() {
  const articles = (await getDiscoverableArticles()).sort((a, b) =>
    (b.date_published || "").localeCompare(a.date_published || ""),
  );
  const featured = articles.find((a) => a.is_featured) || articles[0];
  const guides = articles.filter(
    (a) => a.article_type === "guide" && a.id !== featured?.id,
  );
  const ideas = articles.filter(
    (a) => a.article_type === "ideas" && a.id !== featured?.id,
  );
  const lab = articles.filter((a) => a.article_type === "lab");
  return (
    <div className="container blog-index">
      <header className="blog-index-header">
        <p className="eyebrow">PicMagic Blog</p>
        <h1>A better photo starts with a better idea.</h1>
        <p>
          Learn to choose a visual concept, separate your identity from its
          styling and adapt a prompt without losing what makes the look
          interesting. PicMagic is a visual discovery and prompt platform; you
          generate images in the external tool you choose.
        </p>
        <nav aria-label="Editorial sections">
          <a href="#guides">Guides</a>
          <a href="#ideas">Ideas</a>
          <a href="#lab">PicMagic Lab</a>
        </nav>
      </header>
      <section className="blog-featured">
        <h2>Featured guide</h2>
        {featured ? (
          <Card article={featured} />
        ) : (
          <div className="blog-empty">
            <p>
              Our first guides are being prepared and reviewed. Start with the
              existing practical guide to references and scene instructions.
            </p>
            <Link
              className="button secondary"
              href="/guides/reference-photo-prompts"
            >
              Use a reference photo well
            </Link>
          </div>
        )}
      </section>
      <section id="guides">
        <h2>Latest guides</h2>
        <p>
          Practical workflows and explanations, with the important answer first.
        </p>
        <div className="blog-card-grid">
          {guides.map((a) => (
            <Card key={a.id} article={a} />
          ))}
        </div>
        {!guides.length && (
          <p>
            New guides will appear here after editorial review and publication.
          </p>
        )}
      </section>
      <section id="ideas">
        <h2>Ideas worth trying</h2>
        <p>
          Original PicMagic previews, selection advice and links to the complete
          prompts.
        </p>
        <div className="blog-card-grid">
          {ideas.map((a) => (
            <Card key={a.id} article={a} />
          ))}
        </div>
        {!ideas.length && (
          <Link href="/collections">
            Explore the existing curated collections →
          </Link>
        )}
      </section>
      <section id="lab" className="blog-lab">
        <p className="eyebrow">PicMagic Lab</p>
        <h2>Evidence before conclusions.</h2>
        <p>
          Lab articles will document original tests with exact inputs, reference
          conditions, tool details and reviewed outputs. Planned experiments
          stay private until that evidence exists.{" "}
        </p>
        {!lab.length && <p>No new Lab experiments are published yet.</p>}
        {lab.length ? (
          <div className="blog-card-grid">
            {lab.map((a) => (
              <Card key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <Link href="/guides/prompt-trial">
            Read our existing two-prompt fictional-person walkthrough →
          </Link>
        )}
      </section>
      <section>
        <h2>Explore by interest</h2>
        <p>These are editorial starting points, not a popularity ranking.</p>
        <div className="blog-topics">
          <Link href="/guides/reference-photo-prompts">
            Identity & references
          </Link>
          <Link href="/ai-prompts/men">Men’s ideas</Link>
          <Link href="/ai-prompts/women">Women’s ideas</Link>
          <Link href="/ai-prompts/couple">Couples</Link>
          <Link href="/collections/instagram-profile-picture">
            Profile pictures
          </Link>
        </div>
      </section>
    </div>
  );
}
