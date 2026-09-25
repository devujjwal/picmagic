import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
vi.mock("@/lib/prompts/discovery-request", () => ({
  getDiscoveryContext: async () => undefined,
}));
vi.mock("@/lib/content", () => ({
  getCatalog: vi.fn(async () => ({
    prompts: [],
    categories: [],
    collections: [],
  })),
}));
import Home from "@/app/page";
it("an empty published library renders a useful creator entry instead of seed content or an error", async () => {
  render(await Home());
  expect(
    screen.getByRole("heading", {
      name: "A new wave of inspiration is on its way.",
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Create a prompt" })).toHaveAttribute(
    "href",
    "/create",
  );
  expect(document.querySelectorAll(".prompt-card")).toHaveLength(0);
});
