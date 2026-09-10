import type { Metadata } from "next";
import { site } from "@/config/site";
import { promptPath, type Prompt } from "@/types/content";
export function metadata(
  title: string,
  description: string,
  path: string,
  indexable = true,
  image = "/opengraph-image",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: new URL(path, site.url).href },
    robots: { index: site.indexing && indexable, follow: true },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: new URL(path, site.url).href,
      images: [
        { url: new URL(image, site.url).href, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL(image, site.url).href],
    },
  };
}
export function promptMetadata(p: Prompt) {
  return metadata(
    p.seo_title || `${p.title} AI Prompt | PicMagic`,
    p.seo_description || p.description,
    promptPath(p),
    p.is_indexable,
    `/api/og/${p.id}`,
  );
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
