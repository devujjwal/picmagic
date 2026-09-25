import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocalDiscovery } from "@/components/prompts/local-discovery";
import { allPrompts } from "@/content/catalog";
import { promptSchema } from "@/types/content";
import { toPromptCard } from "@/lib/prompts/card-data";
const state = vi.hoisted(() => ({
  recent: [] as string[],
  saved: [] as string[],
}));
vi.mock("@/features/saved/store", () => ({
  useRecent: () => state.recent,
  useSaved: () => ({ ids: state.saved }),
}));
vi.mock("@/components/prompts/prompt-grid", () => ({
  PromptGrid: ({ prompts }: { prompts: { id: string }[] }) => (
    <div>
      {prompts.map((p) => (
        <span key={p.id} data-testid="recent-look">
          {p.id}
        </span>
      ))}
    </div>
  ),
}));
it("excludes homepage selections before taking four recent cards", () => {
  const prompts = allPrompts
    .slice(0, 8)
    .map((p) => toPromptCard(promptSchema.parse(p)));
  state.recent = prompts.map((p) => p.id);
  state.recent.splice(4, 0, state.recent[3]);
  render(
    <LocalDiscovery
      prompts={prompts}
      mode="recent"
      excludedIds={state.recent.slice(0, 3)}
    />,
  );
  expect(
    screen.getAllByTestId("recent-look").map((el) => el.textContent),
  ).toEqual(prompts.slice(3, 7).map((p) => p.id));
});
