import { act, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PaginatedGrid } from "@/components/prompts/paginated-grid";
import { promptSchema } from "@/types/content";
import originals from "@/content/prompts.json";
vi.mock("@/components/prompts/prompt-grid", () => ({
  PromptGrid: ({ prompts }: { prompts: { id: string }[] }) => (
    <div>
      {prompts.map((p) => (
        <span data-testid="look" key={p.id}>
          {p.id}
        </span>
      ))}
    </div>
  ),
}));
const p = promptSchema.parse(originals[0]);
const prompts = Array.from({ length: 55 }, (_, i) => ({
  ...p,
  id: String(i),
  content_intent: "creative" as const,
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("adds one 24-item batch near the viewport, deduplicates observer callbacks and stops at the end", () => {
  const callbacks: IntersectionObserverCallback[] = [];
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callbacks.push(cb);
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  render(<PaginatedGrid prompts={prompts} page={1} path="/ai-prompts" />);
  expect(screen.getAllByTestId("look")).toHaveLength(24);
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/ai-prompts?page=2",
  );
  expect(screen.getByRole("link")).toHaveClass("sr-only");
  act(() => {
    callbacks[0](
      [{ isIntersecting: false }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });
  expect(screen.getAllByTestId("look")).toHaveLength(24);
  act(() => {
    for (let i = 0; i < 3; i++)
      callbacks[0](
        [{ isIntersecting: true }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
  });
  expect(screen.getAllByTestId("look")).toHaveLength(48);
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/ai-prompts?page=3",
  );
  act(() => {
    callbacks[1](
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });
  expect(screen.getAllByTestId("look")).toHaveLength(55);
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("Showing 55 looks");
  expect(disconnect).toHaveBeenCalled();
});
it("keeps a usable next-page link without observer support and starts at the correct page", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  render(<PaginatedGrid prompts={prompts} page={2} path="/ai-prompts" />);
  expect(screen.getAllByTestId("look")).toHaveLength(24);
  expect(screen.getAllByTestId("look")[0]).toHaveTextContent("24");
  expect(screen.getByRole("link")).not.toHaveClass("sr-only");
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/ai-prompts?page=3",
  );
});
