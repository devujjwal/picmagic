import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClientShell } from "@/components/layout/client-shell";
import { site } from "@/config/site";
import { adsenseClient } from "@/config/ads";
import { StructuredData } from "@/components/ui/structured-data";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  robots: { index: site.indexing, follow: true },
  other: adsenseClient ? { "google-adsense-account": adsenseClient } : {},
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ClientShell nonce={nonce}>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${site.url}#organization`,
                  name: site.name,
                  url: site.url,
                  sameAs: site.social.map(({ href }) => href),
                },
                {
                  "@type": "WebSite",
                  "@id": `${site.url}#website`,
                  name: site.name,
                  url: site.url,
                  description: site.description,
                  publisher: { "@id": `${site.url}#organization` },
                },
              ],
            }}
          />
        </ClientShell>
      </body>
    </html>
  );
}
