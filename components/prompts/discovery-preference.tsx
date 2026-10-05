import { Shuffle } from "lucide-react";
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
      className="discovery-preference"
      aria-label="Discovery preference"
    >
      <div className="discovery-preference-copy">
        <div className="discovery-preference-title">
          <Shuffle size={18} aria-hidden="true" />
          <strong>Fresh mix on return visits</strong>
          <span className="discovery-preference-state">
            {context.enabled ? "On" : "Off"}
          </span>
        </div>
        <p>
          {context.enabled
            ? "Discover a different selection when you return. This browser remembers your visits."
            : "Showing the regular selection. Turn on for a fresh mix when you return."}
        </p>
      </div>
      <input type="hidden" name="returnPath" value={path} />
      <input
        type="hidden"
        name="enabled"
        value={context.enabled ? "off" : "on"}
      />
      <div className="discovery-preference-actions">
        <button
          type="submit"
          className="button secondary"
          aria-label={`Turn ${context.enabled ? "off" : "on"} fresh mix on return visits`}
        >
          Turn {context.enabled ? "off" : "on"}
        </button>
        <a href="/privacy#discovery-memory" className="text-link">
          How it works
        </a>
      </div>
    </form>
  );
}
