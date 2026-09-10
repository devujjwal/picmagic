// Google's AdSense CSP contract: https://support.google.com/adsense/answer/16283098
// Ad infrastructure can change hosts. Authorize trusted script descendants with
// an unpredictable response nonce, rather than maintaining a script host list.
export function contentSecurityPolicy(nonce: string, advertising: boolean) {
  if (!/^[A-Za-z0-9+/=]+$/.test(nonce)) throw new Error("Invalid CSP nonce");
  const development = process.env.NODE_ENV === "development";
  return [
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'${advertising || development ? " 'unsafe-eval'" : ""} https:`,
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    advertising
      ? "connect-src 'self' https:"
      : "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    advertising ? "frame-src https:" : "frame-src 'none'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}
