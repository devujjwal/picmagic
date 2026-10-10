import { describe, it, expect, vi, afterEach } from "vitest";
import { affiliateProviderSeeds } from "@/content/affiliate/providers";
import { providerSchema } from "@/lib/affiliate/schema";
import { allowedProviderUrl } from "@/lib/affiliate/url-policy";
import {
  recommendTools,
  publicProvider,
  monetizedProvider,
  promptToolIntent,
  articleToolIntents,
} from "@/lib/affiliate/recommendations";
import { cleanProperties } from "@/lib/analytics";
const now = Date.parse("2026-10-10T00:00:00Z");
const seed = (id: string) =>
  structuredClone(affiliateProviderSeeds.find((p) => p.id === id)!);
const records = () => affiliateProviderSeeds.map((p) => publicProvider(p, now));
describe("affiliate recommendation safety", () => {
  it("validates all editorial fixtures without referral URLs", () => {
    for (const p of affiliateProviderSeeds) {
      expect(providerSchema.safeParse(p).success).toBe(true);
      expect(p.affiliate_url).toBeNull();
      expect(monetizedProvider(p, true, now)).toBeFalsy();
    }
  });
  it("accepts Supabase timestamptz offsets in real public and admin rows", () => {
    const p = seed("fotor");
    p.last_verified_at = "2026-10-09T00:00:00+00:00";
    expect(providerSchema.safeParse(p).success).toBe(true);
    expect(
      recommendTools([publicProvider(p, now)], "portrait", false, now),
    ).toHaveLength(1);
  });
  it("matches portraits, groups, products and videos instead of commission", () => {
    expect(
      recommendTools(records(), "portrait", false, now).map((t) => t.id),
    ).toEqual(["chatgpt", "gemini", "fotor"]);
    expect(
      recommendTools(records(), "group", false, now).map((t) => t.id),
    ).not.toContain("photoroom");
    expect(
      recommendTools(records(), "product", false, now).map((t) => t.id),
    ).toEqual(["photoroom", "getimg"]);
    expect(
      recommendTools(records(), "video", false, now).map((t) => t.id),
    ).toEqual(["runway", "invideo"]);
    for (const t of recommendTools(records(), "video", false, now))
      expect(t.access_note).not.toMatch(/Free plan available/);
  });
  it("recognizes group, product, animal and reel metadata", () => {
    const base = {
      prompt_type: "photo" as const,
      persona_policy: "person" as const,
      people_count: null,
      category_id: "men",
      generation_mode: "reference-required" as const,
    };
    expect(promptToolIntent({ ...base, category_id: "family" })).toBe("group");
    expect(promptToolIntent({ ...base, people_count: 3 })).toBe("group");
    expect(
      promptToolIntent({ ...base, persona_policy: "person-and-product" }),
    ).toBe("product");
    expect(promptToolIntent({ ...base, persona_policy: "animal" })).toBe(
      "image",
    );
    expect(promptToolIntent({ ...base, prompt_type: "reel" })).toBe("video");
    expect(Object.values(articleToolIntents)).not.toContain("video");
  });
  it("honors priority within equally suitable options", () => {
    const p = seed("gemini");
    p.priority = 0;
    expect(
      recommendTools(
        [publicProvider(seed("chatgpt"), now), publicProvider(p, now)],
        "portrait",
        false,
        now,
      )[0].id,
    ).toBe("gemini");
  });
  it("does not call required paid editing free when references are free", () => {
    const p = seed("chatgpt");
    p.capabilities.find((c) => c.capability === "photo_editing")!.access =
      "paid";
    expect(
      recommendTools([publicProvider(p, now)], "portrait", false, now)[0]
        .access_note,
    ).toMatch(/^Paid access required/);
  });
  it("omits disabled, stale, future, malformed or unsuitable providers", () => {
    const p = seed("fotor");
    p.is_enabled = false;
    expect(
      recommendTools([publicProvider(p, now)], "portrait", false, now),
    ).toEqual([]);
    p.is_enabled = true;
    p.last_verified_at = "2026-08-01T00:00:00Z";
    expect(
      recommendTools([publicProvider(p, now)], "portrait", false, now),
    ).toEqual([]);
    p.last_verified_at = "2027-01-01T00:00:00Z";
    expect(
      recommendTools([publicProvider(p, now)], "portrait", false, now),
    ).toEqual([]);
    expect(recommendTools([{ id: "broken" }], "portrait", false, now)).toEqual(
      [],
    );
  });
  it("requires all commercial gates and an explicit release switch", () => {
    const p = seed("fotor");
    // Synthetic test-only token; never persisted, navigated or presented to visitors.
    p.affiliate_url = "https://www.fotor.com/ai-photo-editor/?ref=unit-fixture";
    expect(publicProvider(p, now).affiliate_url).toBeNull();
    p.affiliate_status = "Approved";
    p.approval_evidence = "Synthetic unit-test approval";
    p.payout_confirmed = true;
    p.placement_confirmed = true;
    p.verified_affiliate_url = p.affiliate_url;
    p.affiliate_url_verified_at = "2026-10-09T00:00:00Z";
    expect(monetizedProvider(p, false, now)).toBe(false);
    expect(monetizedProvider(p, true, now)).toBe(true);
    const projected = publicProvider(p, now);
    expect(projected).not.toHaveProperty("approval_evidence");
    expect(projected).not.toHaveProperty("verified_affiliate_url");
    expect(recommendTools([projected], "portrait", false, now)[0].href).toBe(
      p.official_url,
    );
    expect(
      recommendTools([projected], "portrait", true, now)[0].affiliate_enabled,
    ).toBe(true);
    p.affiliate_url_verified_at = "2026-08-01T00:00:00Z";
    expect(publicProvider(p, now).affiliate_url).toBeNull();
    p.affiliate_url_verified_at = "2026-10-09T00:00:00Z";
    p.verified_affiliate_url = p.official_url;
    expect(monetizedProvider(p, true, now)).toBe(false);
  });
  it.each([
    "Researching",
    "Application required",
    "Applied",
    "Rejected",
    "Unavailable",
  ] as const)("never monetizes %s", (status) => {
    const p = seed("fotor");
    p.affiliate_status = status;
    expect(monetizedProvider(p, true, now)).toBeFalsy();
  });
  it("rejects unsupported approval claims", () => {
    const p = seed("fotor");
    p.affiliate_status = "Approved";
    expect(providerSchema.safeParse(p).success).toBe(false);
  });
});
describe("provider URLs", () => {
  it.each([
    "https://www.fotor.com.evil.test/",
    "https://evil.test/?host=fotor.com",
    "http://www.fotor.com/",
    "https://user:pass@www.fotor.com/",
    "https://127.0.0.1/",
    "https://www.fotor.com:8443/",
    "https://www.fotor.com/?url=https%3A%2F%2Fevil.test",
    "https://www.fotor.com/?prompt=personal",
    "https://www.fotor.com/redirect",
    "https://www.fotor.com/ai-photo-editor/#private",
    "https://www.fotor.com/?ref=a%40b.test",
    "https://www.fotor.com/?ref=unit&next=evil",
  ])("rejects unsafe URL %s", (url) =>
    expect(allowedProviderUrl("fotor", url, true)).toBe(false),
  );
  it("accepts official links but requires reviewed policies for shared networks", () => {
    expect(
      allowedProviderUrl("fotor", "https://www.fotor.com/ai-photo-editor/"),
    ).toBe(true);
    expect(
      allowedProviderUrl("fotor", "https://www.fotor.com/?ref=unit", false),
    ).toBe(false);
    expect(
      allowedProviderUrl(
        "fotor",
        "https://shared-network.example/campaign",
        true,
      ),
    ).toBe(false);
    expect(
      allowedProviderUrl("new-provider", "https://new-provider.example/"),
    ).toBe(false);
  });
});
describe("affiliate measurement privacy", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("sanitizes dimensions and drops raw URLs and private payloads", () => {
    expect(
      cleanProperties({
        provider: "fotor",
        prompt_type: "photo",
        placement: "photo_copy",
        content_slug: "public-look",
        destination_type: "official",
        affiliate_enabled: false,
        href: "https://provider/?ref=secret",
        prompt_text: "private",
        photo: "private",
        email: "private",
      } as never),
    ).toEqual({
      provider: "fotor",
      prompt_type: "photo",
      placement: "photo_copy",
      content_slug: "public-look",
      destination_type: "official",
      affiliate_enabled: false,
    });
    expect(
      cleanProperties({
        provider: "private@example.test",
        content_slug: "prompt?secret",
        placement: "unknown",
        prompt_type: "private",
        destination_type: "https://example.test",
        affiliate_enabled: "yes",
      } as never),
    ).toEqual({});
  });
  it("queues no clicks before consent or after withdrawal", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-AFFQA12345");
    delete window.gtag;
    window.dataLayer = [];
    window.history.replaceState({}, "", "/ai-prompts/men/public-look");
    const { trackAffiliate } = await import("@/lib/affiliate/tracking");
    const tool = recommendTools(records(), "portrait", false, now)[0];
    const context = {
      prompt_type: "photo" as const,
      placement: "photo_detail" as const,
      content_slug: "public-look",
    };
    trackAffiliate("affiliate_tool_click", tool, context);
    expect(window.dataLayer).toEqual([]);
    localStorage.setItem("picmagic:analytics-consent", "yes");
    trackAffiliate("affiliate_tool_click", tool, context);
    const commands = () =>
      window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
    expect(
      commands().filter((x) => x[1] === "affiliate_tool_click"),
    ).toHaveLength(1);
    localStorage.setItem("picmagic:analytics-consent", "no");
    trackAffiliate("affiliate_tool_click", tool, context);
    expect(
      commands().filter((x) => x[1] === "affiliate_tool_click"),
    ).toHaveLength(1);
    expect(JSON.stringify(commands())).not.toContain(tool.href);
  });
});
