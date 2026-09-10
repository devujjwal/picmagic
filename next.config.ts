import type { NextConfig } from "next";
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "") +
    " https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://adservice.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googlesyndication.com https://*.doubleclick.net https://www.googletagmanager.com",
  "frame-src https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");
const config: NextConfig = {
  // Keep canonical and description tags in the initial head for every client.
  htmlLimitedBots: /.*/,
  // The small Tailwind stylesheet can arrive with HTML on slow mobile networks.
  experimental: { inlineCss: true },
  images: {
    // Only the disposable local Supabase test instance may serve local images.
    // Hosted builds retain Next.js private-network protection.
    dangerouslyAllowLocalIP:
      process.env.CONTEXT !== "production" &&
      supabase === "http://127.0.0.1:54421",
    remotePatterns: supabase
      ? [
          {
            protocol: new URL(supabase).protocol.slice(0, -1) as
              "http" | "https",
            port: new URL(supabase).port,
            hostname: new URL(supabase).hostname,
            pathname: "/storage/v1/object/public/previews/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/ai-prompts/reels",
        destination: "/reel-prompts",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.picmagic.in" }],
        destination: "https://picmagic.in/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
