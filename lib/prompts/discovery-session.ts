import {
  DISCOVERY_VERSION,
  DISCOVERY_IDLE_MINUTES,
  DISCOVERY_MAX_AGE,
  DISCOVERY_MAX_COUNTER,
} from "@/config/discovery";

export type DiscoverySession = {
  enabled: boolean;
  counter: number;
  minute: number;
};
export const minuteNow = () => Math.floor(Date.now() / 60_000);

export function parseDiscoverySession(
  value: string | undefined,
  minute: number,
): DiscoverySession | null {
  if (!value || value.length > 48) return null;
  const match = /^(\d+)\.([01])\.(\d+)\.(\d+)$/.exec(value);
  if (!match) return null;
  const [version, enabled, counter, last] = match.slice(1).map(Number);
  if (
    version !== DISCOVERY_VERSION ||
    !Number.isSafeInteger(counter) ||
    counter < 0 ||
    counter > DISCOVERY_MAX_COUNTER ||
    !Number.isSafeInteger(last) ||
    last < 0 ||
    last > minute + 1 ||
    minute - last >= DISCOVERY_MAX_AGE / 60
  )
    return null;
  return {
    enabled: enabled === 1,
    counter: enabled ? counter : 0,
    minute: last,
  };
}

export function serializeDiscoverySession(state: DiscoverySession) {
  return `${DISCOVERY_VERSION}.${state.enabled ? 1 : 0}.${state.enabled ? state.counter : 0}.${state.minute}`;
}

/** Only navigations to public page routes count. Never assets, API, HEAD or prefetch. */
export function isDiscoveryNavigation(
  method: string,
  url: URL,
  headers: Headers,
) {
  if (
    method !== "GET" ||
    headers.has("next-router-prefetch") ||
    headers.has("next-router-segment-prefetch") ||
    headers.has("x-middleware-prefetch") ||
    /prefetch/i.test(
      `${headers.get("purpose") || ""} ${headers.get("sec-purpose") || ""}`,
    )
  )
    return false;
  const destination = headers.get("sec-fetch-dest");
  if (destination && destination !== "document" && destination !== "empty")
    return false;
  if (destination === "empty" && headers.get("rsc") !== "1") return false;
  return /^(?:\/|\/(?:about|contact|privacy|terms|create|enhance-photo|saved|search)|\/ai-prompts(?:\/[a-z0-9-]+){0,2}|\/(?:reel-prompts|collections)(?:\/[a-z0-9-]+)?|\/guides\/[a-z0-9-]+)$/.test(
    url.pathname,
  );
}

export function isDiscoveryEntry(url: URL) {
  const page = url.searchParams.get("page");
  return (
    url.pathname === "/" ||
    (url.pathname === "/ai-prompts" && (!page || page === "1"))
  );
}

/** Pure transition; active navigation does not select a new deck. */
export function advanceDiscoverySession(
  previous: DiscoverySession | null,
  minute: number,
  entry: boolean,
): DiscoverySession {
  if (!previous) return { enabled: true, counter: 0, minute };
  const advance =
    previous.enabled &&
    entry &&
    minute - previous.minute >= DISCOVERY_IDLE_MINUTES;
  return {
    enabled: previous.enabled,
    // Counter zero is reserved for the editorial default, including after expiry.
    counter: advance
      ? (previous.counter % DISCOVERY_MAX_COUNTER) + 1
      : previous.counter,
    minute,
  };
}

export function discoveryCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DISCOVERY_MAX_AGE,
  };
}

/** A Server Action must never turn an untrusted hidden input into an open redirect. */
export function discoveryReturnPath(value: FormDataEntryValue | null) {
  return typeof value === "string" &&
    /^(?:\/|\/ai-prompts(?:\?page=[1-9]\d{0,5})?)$/.test(value)
    ? value
    : null;
}
