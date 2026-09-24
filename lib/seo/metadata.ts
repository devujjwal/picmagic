import type { Metadata } from "next";
import { site } from "@/config/site";
import { promptPath, type Prompt } from "@/types/content";
import { isPromptSeoEligible } from "./eligibility";

type SocialImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

const defaultSocialImage: SocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "PicMagic AI photo and reel prompt ideas",
};

export function brandedTitle(title: string) {
  return /\|\s*PicMagic\s*$/i.test(title.trim())
    ? title.trim()
    : `${title.trim()} | PicMagic`;
}

export function metadata(
  title: string,
  description: string,
  path: string,
  indexable = true,
  images: SocialImage[] = [defaultSocialImage],
): Metadata {
  const socialImages = images.map((image) => ({
    ...image,
    url: new URL(image.url, site.url).href,
  }));
  return {
    title,
    description,
    alternates: { canonical: new URL(path, site.url).href },
    robots: {
      index: site.indexing && indexable,
      follow: true,
      googleBot: {
        index: site.indexing && indexable,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: new URL(path, site.url).href,
      images: socialImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImages.map((image) => image.url),
    },
  };
}
export function promptMetadata(p: Prompt) {
  return metadata(
    p.seo_title || `${p.title} AI Prompt | PicMagic`,
    p.seo_description || p.description,
    promptPath(p),
    isPromptSeoEligible(p),
    [
      {
        url: p.preview_image_url,
        width: p.image_width,
        height: p.image_height,
        alt: p.image_alt,
      },
      {
        url: `/api/og/${p.id}`,
        width: 1200,
        height: 630,
        alt: `${p.title} on PicMagic`,
      },
    ],
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
