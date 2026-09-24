import { getCatalog } from "@/lib/content";
import { sitemapEntries } from "@/lib/seo/sitemap";
import { sitemapXml, xmlResponse } from "@/lib/seo/sitemap-xml";
export async function GET() {
  return xmlResponse(sitemapXml(sitemapEntries(await getCatalog())));
}
