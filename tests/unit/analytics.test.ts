import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import {
  safeAnalyticsPath,
  safeReferrer,
  cleanProperties,
} from "@/lib/analytics";
describe("analytics privacy", () => {
  it("removes query strings and fragments and rejects private routes", () => {
    expect(
      safeAnalyticsPath("/search?q=private-email%40example.com#secret"),
    ).toBe("/search");
    expect(safeAnalyticsPath("/admin/preview/123")).toBeNull();
    expect(safeAnalyticsPath("/unknown")).toBeNull();
    expect(safeReferrer("https://example.com/private?email=secret#token")).toBe(
      "https://example.com/",
    );
    expect(safeReferrer("https://picmagic.in/admin/login?token=secret")).toBe(
      "",
    );
  });
  it("drops arbitrary properties and private text at runtime", () => {
    expect(
      cleanProperties({
        method: "whatsapp",
        query_length: 12,
        result_count: 3,
        prompt_text: "private",
        email: "person@example.com",
      } as never),
    ).toEqual({ method: "whatsapp", query_length: 12, result_count: 3 });
    expect(
      cleanProperties({
        category: "person@example.com",
        prompt_id: "secret",
        method: "private message",
        generator_type: "private text",
        query_length: -1,
      }),
    ).toEqual({});
  });
});
describe("analytics consent and SPA measurement", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST12345");
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
    delete window.gtag;
    window.dataLayer = [];
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
  it("measures successful poster exports only with consent and fixed properties", async () => {
    const m = await import("@/lib/analytics");
    window.history.replaceState(
      {},
      "",
      "/festival-poster-maker?email=private@example.test",
    );
    m.track("poster_export", {
      poster_design: "diwali",
      poster_format: "square",
      poster_language: "en",
    });
    expect(window.dataLayer).toEqual([]);
    localStorage.setItem("picmagic:analytics-consent", "yes");
    m.track("poster_export", {
      poster_design: "diwali",
      poster_format: "square",
      poster_language: "en",
    });
    const commands = window.dataLayer!.map((x) =>
      Array.from(x as ArrayLike<unknown>),
    );
    expect(commands.filter((x) => x[1] === "poster_export")).toHaveLength(1);
    expect(JSON.stringify(commands)).not.toContain("private@example.test");
    localStorage.setItem("picmagic:analytics-consent", "no");
    m.track("poster_export");
    expect(
      window
        .dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>))
        .filter((x) => x[1] === "poster_export"),
    ).toHaveLength(1);
  });
  it("queues nothing before consent and once per route after consent", async () => {
    const m = await import("@/lib/analytics");
    m.track("prompt_copy");
    expect(window.dataLayer).toEqual([]);
    localStorage.setItem("picmagic:analytics-consent", "yes");
    m.trackPageView("/");
    m.trackPageView("/");
    const commands = () =>
      window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
    expect(commands().filter((x) => x[1] === "page_view")).toHaveLength(1);
    window.history.pushState({}, "", "/search?q=private");
    m.trackPageView("/search");
    expect(JSON.stringify(commands())).not.toContain("?q=");
    expect(commands().filter((x) => x[1] === "page_view")).toHaveLength(2);
    window.history.pushState({}, "", "/admin");
    m.track("prompt_copy");
    m.trackPageView("/admin");
    expect(commands().filter((x) => x[1] === "prompt_copy")).toHaveLength(0);
  });
  it("validates session storage and deduplicates depth milestones", async () => {
    const m = await import("@/lib/analytics");
    localStorage.setItem("picmagic:analytics-consent", "yes");
    sessionStorage.setItem("picmagic:session-pages:v2", '{"unexpected":true}');
    for (const path of ["/", "/create", "/enhance-photo", "/enhance-photo"]) {
      window.history.replaceState({}, "", path);
      m.trackPageView(path);
    }
    const commands = window.dataLayer!.map((x) =>
      Array.from(x as ArrayLike<unknown>),
    );
    expect(commands.filter((x) => x[1] === "session_depth_3")).toHaveLength(1);
  });
  it("continues functioning with storage blocked without sending events", async () => {
    const m = await import("@/lib/analytics");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw Error("blocked");
    });
    expect(() => m.trackPageView("/")).not.toThrow();
    expect(window.dataLayer).toEqual([]);
  });
  it("sends sanitized web-vital measurements only after consent", async () => {
    const m = await import("@/lib/analytics");
    m.trackWebVital({
      id: "v4-123",
      name: "LCP",
      rating: "good",
      value: 2184.4,
    });
    expect(window.dataLayer).toEqual([]);
    localStorage.setItem("picmagic:analytics-consent", "yes");
    m.trackWebVital({
      id: "v4-123",
      name: "LCP",
      rating: "good",
      value: 2184.4,
    });
    const commands = window.dataLayer!.map((x) =>
      Array.from(x as ArrayLike<unknown>),
    );
    expect(commands).toContainEqual([
      "event",
      "web_vital",
      expect.objectContaining({
        metric_name: "LCP",
        metric_id: "v4-123",
        metric_value: 2184,
        metric_rating: "good",
      }),
    ]);
  });
});
