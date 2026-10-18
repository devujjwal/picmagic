import { afterEach, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Vercel migration safeguards", () => {
  it("requires production launch configuration on either host", () => {
    for (const flag of ["CONTEXT", "VERCEL_ENV", "VERCEL_TARGET_ENV"]) {
      const result = spawnSync(
        process.execPath,
        [resolve("scripts/check-launch.mjs")],
        {
          env: { PATH: process.env.PATH, NODE_ENV: "test", [flag]: "production" },
          encoding: "utf8",
        },
      );
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "Production must use CONTENT_SOURCE=supabase",
      );
    }
  });

  it("does not index a Vercel preview even if the indexing flag is copied", async () => {
    vi.stubEnv("NEXT_PUBLIC_INDEXING_ENABLED", "true");
    vi.stubEnv("CONTEXT", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await import("@/config/site")).site.indexing).toBe(false);
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    expect((await import("@/config/site")).site.indexing).toBe(true);
  });
});
