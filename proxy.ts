import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { contentSecurityPolicy } from "@/lib/security/csp";
import { advertisingConfigured } from "@/config/ads";
export async function proxy(request: NextRequest) {
  const admin = /^\/(?:admin(?:\/|$)|api\/admin(?:\/|$))/.test(
    request.nextUrl.pathname,
  );
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce, advertisingConfigured() && !admin);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  const next = () => {
    const response = NextResponse.next({ request: { headers } });
    response.headers.set("Content-Security-Policy", csp);
    // Nonces must never be shared through a cached HTML response.
    response.headers.set("Cache-Control", "private, no-store");
    if (admin) response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  };
  let response = next();
  if (!admin) return response;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        headers.set("cookie", request.headers.get("cookie") || "");
        response = next();
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  await db.auth.getUser();
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|previews/|icon.svg|opengraph-image|robots.txt|sitemap(?:-pages|-images)?.xml|ads.txt|api/og|api/search).*)",
  ],
};
