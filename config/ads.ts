export function validAdSenseClient(value: string | undefined) {
  return value && /^ca-pub-\d{16}$/.test(value) ? value : undefined;
}

export const adsenseClient = validAdSenseClient(
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
);

export function isAdvertisingPage(pathname: string) {
  return (
    pathname === "/" ||
    /^\/ai-prompts(?:\/[a-z0-9-]+){0,2}\/?$/.test(pathname) ||
    /^\/collections\/[a-z0-9-]+\/?$/.test(pathname) ||
    /^\/reel-prompts(?:\/[a-z0-9-]+)?\/?$/.test(pathname)
  );
}

export function adSlotId(placement: string) {
  try {
    const slots: unknown = JSON.parse(process.env.NEXT_PUBLIC_AD_SLOTS || "{}");
    if (!slots || typeof slots !== "object" || Array.isArray(slots)) return;
    const value = (slots as Record<string, unknown>)[placement];
    return typeof value === "string" && /^\d{10}$/.test(value)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

export function adsTxt(client: string | undefined) {
  const valid = validAdSenseClient(client);
  return valid
    ? `google.com, ${valid.slice(3)}, DIRECT, f08c47fec0942fa0\n`
    : "";
}

export function advertisingConfigured() {
  return (
    process.env.NEXT_PUBLIC_ADS_ENABLED === "true" && Boolean(adsenseClient)
  );
}
