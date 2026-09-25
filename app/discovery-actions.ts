"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DISCOVERY_COOKIE, discoveryRotationEnabled } from "@/config/discovery";
import {
  discoveryCookieOptions,
  discoveryReturnPath,
  minuteNow,
  serializeDiscoverySession,
} from "@/lib/prompts/discovery-session";

export async function setDiscoveryPreference(data: FormData) {
  const path = discoveryReturnPath(data.get("returnPath"));
  const enabled = data.get("enabled");
  if (!path || (enabled !== "on" && enabled !== "off"))
    throw new Error("Invalid discovery preference");
  if (discoveryRotationEnabled()) {
    (await cookies()).set(
      DISCOVERY_COOKIE,
      serializeDiscoverySession({
        enabled: enabled === "on",
        counter: 0,
        minute: minuteNow(),
      }),
      discoveryCookieOptions(),
    );
  }
  redirect(path);
}
