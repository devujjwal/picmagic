import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: async () => ({ data: null, error: { code: "unavailable" } }),
      }),
    }),
  }),
}));
import {
  localBlogPreviewEnabled,
  getPublicArticles,
  getLocalDraft,
} from "@/lib/blog/repository";
afterEach(() => vi.unstubAllEnvs());
describe("private seed article repository", () => {
  it("keeps all initial drafts out of public reads", async () => {
    vi.stubEnv("CONTENT_SOURCE", "seed");
    expect(await getPublicArticles()).toEqual([]);
    expect(getLocalDraft("create-ai-photos-with-chatgpt")?.status).toBe(
      "draft",
    );
  });
  it("requires development, explicit opt-in, seed source and a loopback host", () => {
    for (const env of ["NETLIFY", "VERCEL", "CONTEXT"]) vi.stubEnv(env, "");
    vi.stubEnv("CONTENT_SOURCE", "seed");
    vi.stubEnv("PICMAGIC_BLOG_PREVIEW", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(localBlogPreviewEnabled("localhost:4312")).toBe(true);
    expect(localBlogPreviewEnabled("picmagic.in")).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    expect(localBlogPreviewEnabled("localhost:4312")).toBe(false);
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NETLIFY", "true");
    expect(localBlogPreviewEnabled("localhost:4312")).toBe(false);
    vi.stubEnv("NETLIFY", "");
    vi.stubEnv("PICMAGIC_BLOG_PREVIEW", "false");
    expect(localBlogPreviewEnabled("localhost:4312")).toBe(false);
  });
  it("fails closed on backend errors rather than exposing seed drafts", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54421");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-test");
    await expect(getPublicArticles()).rejects.toThrow(
      "temporarily unavailable",
    );
  });
});
