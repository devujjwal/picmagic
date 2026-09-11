/** Exact origins only: proxy headers and wildcard subdomains are not trusted. */
export function isTrustedOrigin(
  request: Request,
  configuredOrigins: (string | undefined)[],
) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  const allowed = [new URL(request.url).origin];
  for (const entry of configuredOrigins) {
    for (const value of (entry || "").split(",")) {
      try {
        const url = new URL(value.trim());
        if (
          (url.protocol === "https:" ||
            (process.env.NEXT_PUBLIC_SUPABASE_URL ===
              "http://127.0.0.1:54421" &&
              url.protocol === "http:" &&
              ["localhost", "127.0.0.1"].includes(url.hostname))) &&
          !url.username &&
          !url.password
        )
          allowed.push(url.origin);
      } catch {
        // Unconfigured or malformed origins never grant access.
      }
    }
  }
  return allowed.includes(origin);
}
