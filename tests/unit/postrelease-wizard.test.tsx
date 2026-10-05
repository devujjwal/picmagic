import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Wizard } from "@/features/generator/wizard";
import { ToolGuide } from "@/components/prompts/tool-guide";
afterEach(cleanup);
it.each(["photo", "edit"] as const)(
  "%s visible and shortened prompts exactly match clipboard payloads",
  async (mode) => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const { container } = render(<Wizard mode={mode} />);
    if (mode === "edit")
      await user.click(
        screen.getByRole("button", { name: "Improve Lighting" }),
      );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(container.querySelector("h2")).toHaveFocus());
    await user.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(container.querySelector("h2")).toHaveFocus());
    while (screen.queryByRole("button", { name: "Continue" }))
      await user.click(screen.getByRole("button", { name: "Continue" }));
    if (mode === "photo")
      expect(screen.getByRole("combobox", { name: "Age intent" })).toHaveValue(
        "Keep original age",
      );
    else
      expect(screen.queryByRole("combobox", { name: "Age intent" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Generate prompt" }));
    const original = container.querySelector(".prompt-text")!.textContent!;
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));
    expect(copy).toHaveBeenLastCalledWith(original);
    expect(original).toContain("preserve every supplied person's apparent age");
    expect(original).not.toContain("22–30");
    await user.click(screen.getByRole("button", { name: "Shorten prompt" }));
    const shortened = container.querySelector(".prompt-text")!.textContent!;
    expect(shortened.length).toBeLessThan(original.length * 0.85);
    await user.click(screen.getByRole("button", { name: "Prompt copied" }));
    expect(copy).toHaveBeenLastCalledWith(shortened);
  },
);
it("exposes a deliberate age choice with matching output/help", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <>
      <Wizard />
      <ToolGuide />
    </>,
  );
  while (screen.queryByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Age intent" }),
    "Older adult",
  );
  expect(
    screen.getByText(/Creative age choices deliberately change adult age cues/),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Generate prompt" }));
  expect(container.querySelector(".prompt-text")!.textContent).toContain(
    "explicitly selected creative age transformation — approximately 60–75",
  );
  expect(container.querySelector(".tool-guide")!.textContent).toContain(
    "Keep source age unless you explicitly selected a creative adult age",
  );
});
