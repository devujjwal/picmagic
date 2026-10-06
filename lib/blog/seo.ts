import { metadata, breadcrumbs } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import {
  articlePath,
  isArticleDiscoverable,
  type Article,
  type BlogAuthor,
} from "./schema";
export function articleMetadata(a: Article, author?: BlogAuthor) {
  const base = metadata(
    a.seo_title,
    a.meta_description,
    articlePath(a),
    isArticleDiscoverable(a),
    [
      {
        url: a.featured_image.url,
        width: a.featured_image.width,
        height: a.featured_image.height,
        alt: a.featured_image.alt,
      },
    ],
  );
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article" as const,
      publishedTime: a.date_published || undefined,
      modifiedTime: a.date_modified,
      authors: [
        site.url + (author?.profile_path || "/about#picmagic-editorial"),
      ],
    },
  };
}
export function articleStructuredData(a: Article, author: BlogAuthor) {
  const url = site.url + articlePath(a);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url + "#article",
        headline: a.title,
        description: a.excerpt,
        image: new URL(a.featured_image.url, site.url).href,
        ...(a.date_published ? { datePublished: a.date_published } : {}),
        dateModified: a.date_modified,
        author: {
          "@type": "Organization",
          "@id": site.url + author.profile_path,
          name: author.name,
          url: site.url + author.profile_path,
        },
        publisher: { "@id": site.url + "#organization" },
        isPartOf: { "@id": site.url + "#website" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: a.title, path: articlePath(a) },
      ]),
    ],
  };
}
export function articleSitemapEntries(articles: Article[]) {
  return !site.indexing
    ? []
    : articles
        .filter((a) => isArticleDiscoverable(a))
        .map((a) => ({
          url: site.url + articlePath(a),
          lastModified: a.date_modified,
          images: [new URL(a.featured_image.url, site.url).href],
        }));
}
