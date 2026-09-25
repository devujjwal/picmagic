import { setDiscoveryPreference } from "@/app/discovery-actions";
import type { DiscoveryContext } from "@/lib/prompts/discovery-request";

/** Native form remains usable without JavaScript; selection stays server-side. */
export function DiscoveryPreference({
  context,
  path,
}: {
  context?: DiscoveryContext;
  path: string;
}) {
  if (!context) return null;
  return (
    <form
      action={setDiscoveryPreference}
      className="filter-bar items-center text-sm"
      aria-label="Discovery preference"
    >
      <span>
        Fresh mix on return visits:{" "}
        <strong>{context.enabled ? "On" : "Off"}</strong>
      </span>
      <input type="hidden" name="returnPath" value={path} />
      <input
        type="hidden"
        name="enabled"
        value={context.enabled ? "off" : "on"}
      />
      <button
        type="submit"
        className="chip"
        aria-label={`Turn ${context.enabled ? "off" : "on"} fresh mix on return visits`}
      >
        Turn {context.enabled ? "off" : "on"}
      </button>
      <a href="/privacy#discovery-memory" className="text-link">
        How it works
      </a>
    </form>
  );
}
