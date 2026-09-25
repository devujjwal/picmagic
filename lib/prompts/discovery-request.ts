import "server-only";
import { cookies } from "next/headers";
import { DISCOVERY_COOKIE, discoveryRotationEnabled } from "@/config/discovery";
import { minuteNow, parseDiscoverySession } from "./discovery-session";

export async function getDiscoveryContext() {
  if (!discoveryRotationEnabled()) return undefined;
  // Proxy forwards the validated, updated cookie before rendering. Read cookies
  // rather than a stale header so a Server Action's cookie update is visible too.
  const state = parseDiscoverySession(
    (await cookies()).get(DISCOVERY_COOKIE)?.value,
    minuteNow(),
  );
  return {
    enabled: state?.enabled ?? true,
    counter: state?.enabled ? state.counter : 0,
  };
}
export type DiscoveryContext = NonNullable<
  Awaited<ReturnType<typeof getDiscoveryContext>>
>;
