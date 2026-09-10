import { describe, expect, it } from "vitest";
import { adsTxt, validAdSenseClient } from "@/config/ads";

describe("AdSense publisher verification", () => {
  it("only publishes a correctly formatted publisher identity", () => {
    expect(adsTxt("ca-pub-4114304022167819")).toBe(
      "google.com, pub-4114304022167819, DIRECT, f08c47fec0942fa0\n",
    );
    for (const value of [
      undefined,
      "",
      "ca-pub-123",
      "ca-pub-4114304022167819\nother.com",
    ])
      expect(adsTxt(value)).toBe("");
    expect(validAdSenseClient("pub-4114304022167819")).toBeUndefined();
  });
});
