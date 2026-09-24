import { site } from "@/config/site";
import type { MetadataRoute } from "next";

export const sitemapPaths = ["/sitemap-pages.xml", "/sitemap-images.xml"];
export function escapeXml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
}
const declaration = '<?xml version="1.0" encoding="UTF-8"?>';
export function sitemapIndexXml() {
  return (
    declaration +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    (site.indexing
      ? sitemapPaths
          .map((path) => `<sitemap><loc>${site.url}${path}</loc></sitemap>`)
          .join("")
      : "") +
    "</sitemapindex>"
  );
}
export function sitemapXml(entries: MetadataRoute.Sitemap, images = false) {
  return (
    declaration +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
    entries
      .filter((entry) => !images || entry.images?.length)
      .map((entry) => {
        const modified =
          entry.lastModified instanceof Date
            ? entry.lastModified.toISOString()
            : entry.lastModified;
        return `<url><loc>${escapeXml(entry.url)}</loc>${modified ? `<lastmod>${escapeXml(modified)}</lastmod>` : ""}${images ? (entry.images || []).map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join("") : ""}</url>`;
      })
      .join("") +
    "</urlset>"
  );
}
export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
