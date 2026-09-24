import { sitemapIndexXml, xmlResponse } from "@/lib/seo/sitemap-xml";
export function GET() {
  return xmlResponse(sitemapIndexXml());
}
