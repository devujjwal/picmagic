import type { NextConfig } from "next";
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
const config: NextConfig = {
  distDir: process.env.PICMAGIC_DIST_DIR || ".next",
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
