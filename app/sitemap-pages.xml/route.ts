import { getDiscoverableArticles } from "@/lib/blog/repository";
import { getCatalog } from "@/lib/content";
import { sitemapEntries } from "@/lib/seo/sitemap";
import { sitemapXml, xmlResponse } from "@/lib/seo/sitemap-xml";
export async function GET() {
  const [catalog, articles] = await Promise.all([
    getCatalog(),
    getDiscoverableArticles(),
  ]);
  return xmlResponse(sitemapXml(sitemapEntries(catalog, articles)));
}
