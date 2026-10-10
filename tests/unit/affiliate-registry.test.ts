import { describe, it, expect, vi, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
import {
  getAffiliateProviders,
  getRecommendedTools,
} from "@/lib/affiliate/registry";
import { affiliateProviderSeeds } from "@/content/affiliate/providers";
import { publicProvider } from "@/lib/affiliate/recommendations";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("affiliate registry failure boundaries", () => {
  it("uses local ordinary fixtures without fetching when seed mode is explicit", async () => {
    vi.stubEnv("CONTENT_SOURCE", "seed");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const rows = await getAffiliateProviders();
    expect(rows).toHaveLength(8);
    expect(rows.every((r) => !r.affiliate_url && !r.monetization_ready)).toBe(
      true,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(["failure", "malformed", "throw"])(
    "never falls back to monetized seeds on %s",
    async (mode) => {
      vi.stubEnv("CONTENT_SOURCE", "supabase");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54421");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-fixture");
      vi.stubGlobal(
        "fetch",
        mode === "throw"
          ? vi.fn().mockRejectedValue(new Error("timeout"))
          : vi.fn().mockResolvedValue({
              ok: mode !== "failure",
              json: async () => ({ untrusted: true }),
            }),
      );
      expect(await getAffiliateProviders()).toEqual([]);
      expect(await getRecommendedTools("portrait")).toEqual([]);
    },
  );
  it("accepts offset timestamps and uses the tagged public projection only", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54421");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-fixture");
    const row = {
      ...publicProvider(affiliateProviderSeeds[0]),
      last_verified_at: "2026-10-09T00:00:00+00:00",
    };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [row, { id: "broken" }],
    });
    vi.stubGlobal("fetch", fetcher);
    expect(await getAffiliateProviders()).toEqual([row]);
    expect(fetcher).toHaveBeenCalledWith(
      "http://127.0.0.1:54421/rest/v1/rpc/affiliate_public_providers",
      expect.objectContaining({
        method: "GET",
        next: { revalidate: 300, tags: ["affiliate-providers"] },
      }),
    );
  });
});
