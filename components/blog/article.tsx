import Image from "next/image";
import Link from "@/components/ui/site-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { articleStructuredData } from "@/lib/blog/seo";
import {
  articlePath,
  type Article,
  type ArticleBlock,
  type BlogAuthor,
} from "@/lib/blog/schema";
import { promptPath } from "@/lib/routes";
import type { Catalog } from "@/types/content";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import { BlogLink, BlogTracking, BlogShare } from "./tracking";
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
export function ArticleView({
  article: a,
  author,
  catalog,
  related = [],
  preview = false,
}: {
  article: Article;
  author: BlogAuthor;
  catalog: Catalog;
  related?: Article[];
  preview?: boolean;
}) {
  const headings = a.body.filter((b) => b.type === "heading");
  function destinationLink(
    destination: Article["primary_conversion"],
    role: "primary" | "secondary" = "secondary",
  ) {
    return preview ? (
      <Link className="button" href={destination.path}>
        {destination.label}
      </Link>
    ) : (
      <BlogLink
        className="button"
        slug={a.slug}
        destination={destination}
        role={role}
      >
        {destination.label}
      </BlogLink>
    );
  }
  function inlineLink(text: string, href: string) {
    if (
      !preview &&
      /^\/(ai-prompts|collections)\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(href)
    ) {
      const type = href.startsWith("/collections/")
        ? "collection"
        : href.split("/").length === 4
          ? "prompt"
          : "category";
      return (
        <BlogLink slug={a.slug} destination={{ type, path: href, label: text }}>
          {text}
        </BlogLink>
      );
    }
    return <a href={href}>{text}</a>;
  }
  function promptCard(b: Extract<ArticleBlock, { type: "prompt_card" }>) {
    const p = catalog.prompts.find(
      (p) => p.id === b.prompt_id && isPromptSeoEligible(p),
    );
    if (!p || p.poster_role === "source-reference")
      return preview ? (
        <p className="notice">
          An example is unavailable or no longer eligible. Replace it before
          publication.
        </p>
      ) : null;
    return (
      <section className="blog-prompt-example">
        <figure>
          <Image
            src={p.preview_image_url}
            alt={p.image_alt}
            width={p.image_width}
            height={p.image_height}
            sizes="(max-width: 767px) 90vw, 340px"
          />
          <figcaption>
            Original PicMagic AI-generated preview. Illustrative; your result
            may differ.
          </figcaption>
        </figure>
        <div>
          <h3>{p.title}</h3>
          <p>{b.why}</p>
          <dl>
            <dt>Best use</dt>
            <dd>{b.best_use}</dd>
            <dt>Style / source ratio</dt>
            <dd>
              {p.style.join(" · ")} / {p.aspect_ratio}
            </dd>
          </dl>
          <p>{b.guidance}</p>
          {destinationLink({
            type: "prompt",
            path: promptPath(p),
            label: "Try This Look",
          })}
        </div>
      </section>
    );
  }
  function block(b: ArticleBlock, index: number): React.ReactNode {
    switch (b.type) {
      case "paragraph":
        return (
          <p key={index}>
            {b.content.map((s, i) => (
              <span key={i}>
                {s.href ? inlineLink(s.text, s.href) : s.text}
              </span>
            ))}
          </p>
        );
      case "heading":
        return b.level === 2 ? (
          <h2 key={index} id={b.id}>
            {b.text}
          </h2>
        ) : (
          <h3 key={index} id={b.id}>
            {b.text}
          </h3>
        );
      case "image":
        return (
          <figure key={index}>
            <Image
              src={b.image.url}
              alt={b.image.alt}
              width={b.image.width}
              height={b.image.height}
              sizes="(max-width: 767px) 90vw, 760px"
            />
            <figcaption>{b.image.caption}</figcaption>
          </figure>
        );
      case "quick_answer":
        return (
          <aside key={index} className="blog-answer" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>{b.text}</p>
          </aside>
        );
      case "callout":
        return (
          <aside key={index} className="blog-callout">
            <strong>{b.title}</strong>
            <p>{b.text}</p>
          </aside>
        );
      case "steps":
        return (
          <ol key={index} className="blog-steps">
            {b.items.map((s, i) => (
              <li key={i}>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        );
      case "table":
        return (
          <div
            key={index}
            className="blog-table"
            tabIndex={0}
            role="region"
            aria-label={b.caption}
          >
            <table>
              <caption>{b.caption}</caption>
              <thead>
                <tr>
                  {b.columns.map((c, i) => (
                    <th key={i} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "faq":
        return (
          <section
            key={index}
            aria-label="Frequently asked questions"
            className="blog-faq"
          >
            <h2>Frequently asked questions</h2>
            {b.items.map((item, i) => (
              <div key={i}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>
        );
      case "prompt_card":
        return <div key={index}>{promptCard(b)}</div>;
      case "prompt_grid":
        return (
          <div key={index} className="blog-example-grid">
            {b.items.map((item, i) => (
              <div key={i}>{promptCard({ ...item, type: "prompt_card" })}</div>
            ))}
          </div>
        );
      case "cta":
        return <div key={index}>{destinationLink(b.destination)}</div>;
    }
  }
  const toc = (
    <ul>
      {headings.map((b) => (
        <li key={b.id}>
          <a href={`#${b.id}`}>{b.text}</a>
        </li>
      ))}
    </ul>
  );
  return (
    <article className="container blog-article">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: a.title, path: articlePath(a) },
        ]}
      />
      {preview && (
        <p className="notice">
          Private draft preview. Not published or indexable. Analytics and
          sharing are disabled.
        </p>
      )}
      <header className="blog-article-header">
        <p className="eyebrow">
          {a.article_type === "lab" ? "PicMagic Lab" : a.primary_topic}
        </p>
        <h1>{a.title}</h1>
        <p className="description">{a.excerpt}</p>
        <p className="blog-byline">
          <a href={author.profile_path}>{author.name}</a> ·{" "}
          {a.date_published ? (
            <>
              Published{" "}
              <time dateTime={a.date_published}>
                {formatDate(a.date_published)}
              </time>{" "}
              ·{" "}
            </>
          ) : (
            "Draft · "
          )}
          Updated{" "}
          <time dateTime={a.date_modified}>{formatDate(a.date_modified)}</time>
          {a.reviewed_by ? ` · Reviewed by ${a.reviewed_by}` : ""}
        </p>
      </header>
      <div className="blog-reading-layout">
        <aside className="blog-desktop-toc">
          <nav aria-label="On this page">
            <strong>On this page</strong>
            {toc}
          </nav>
        </aside>
        <div className="blog-body" data-blog-body>
          <details className="blog-mobile-toc">
            <summary>On this page</summary>
            <nav aria-label="Article contents">{toc}</nav>
          </details>
          {a.body.map(block)}
          <section className="blog-primary">
            <h2>Try a PicMagic look</h2>
            <p>
              Choose the concept here, then use your own permitted reference in
              your preferred external image tool.
            </p>
            {destinationLink(a.primary_conversion, "primary")}
          </section>
          <section className="blog-provenance">
            <h2>Editorial context and sources</h2>
            <p>{a.evidence_note}</p>
            <ul>
              {a.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url}>{s.title}</a> — {s.note}{" "}
                  <span>Checked {formatDate(s.checked_at)}.</span>
                </li>
              ))}
            </ul>
            <p>
              Found a misleading explanation?{" "}
              <a href="/contact">Contact PicMagic</a> with the page address and
              issue; do not send private photographs.
            </p>
          </section>
          {!preview && <BlogShare slug={a.slug} title={a.title} />}
          {related.length > 0 && (
            <section>
              <h2>Related reading</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={articlePath(r)}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      {!preview && (
        <>
          <BlogTracking slug={a.slug} />
          <StructuredData data={articleStructuredData(a, author)} />
        </>
      )}
    </article>
  );
}
