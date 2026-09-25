// Deliberately off until the owner approves rollout and default-on storage.
export function discoveryRotationEnabled() {
  return process.env.PICMAGIC_DISCOVERY_ROTATION_ENABLED === "true";
}
export const DISCOVERY_COOKIE = "picmagic-discovery";
export const DISCOVERY_HEADER = "x-picmagic-discovery";
export const DISCOVERY_VERSION = 1;
export const DISCOVERY_IDLE_MINUTES = 30;
export const DISCOVERY_MAX_AGE = 30 * 24 * 60 * 60;
export const DISCOVERY_MAX_COUNTER = 4095;
