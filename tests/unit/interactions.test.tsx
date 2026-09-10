import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/components/share/detail-actions";
import { SaveButton } from "@/components/prompts/save-button";
import { NoticeProvider } from "@/features/saved/store";
import { Wizard } from "@/features/generator/wizard";
import { PromptCard } from "@/components/prompts/prompt-card";
import { promptSchema } from "@/types/content";
import data from "@/content/prompts.json";
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));
describe("public actions", () => {
  it("only confirms copy after the clipboard succeeds", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyButton text="Useful prompt" />);
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));
    expect(copy).toHaveBeenCalledWith("Useful prompt");
    expect(screen.getByRole("button", { name: "Prompt copied" })).toBeVisible();
  });
  it("offers manual copy when permission is denied", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Denied"),
    );
    const notice = vi.fn();
    render(
      <NoticeProvider value={notice}>
        <CopyButton text="Useful prompt" />
      </NoticeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));
    expect(notice).toHaveBeenCalledWith(expect.stringContaining("manually"));
    expect(screen.queryByText("Prompt copied")).not.toBeInTheDocument();
  });
  it("saves and unsaves with visible state", async () => {
    const user = userEvent.setup();
    render(<SaveButton id="test-look" title="Test look" />);
    await user.click(screen.getByRole("button", { name: "Save Test look" }));
    expect(
      screen.getByRole("button", { name: "Unsave Test look" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("picmagic:saved:v1")).toContain("test-look");
    await user.click(screen.getByRole("button", { name: "Unsave Test look" }));
    expect(
      screen.getByRole("button", { name: "Save Test look" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
  it("handles corrupt saved state", () => {
    localStorage.setItem("picmagic:saved:v1", "not json");
    render(<SaveButton id="corrupt-test" title="Another look" />);
    expect(
      screen.getByRole("button", { name: "Save Another look" }),
    ).toBeVisible();
  });
  it("keeps cards minimal", () => {
    render(<PromptCard prompt={promptSchema.parse(data[0])} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByText("Copy prompt")).not.toBeInTheDocument();
    expect(screen.queryByText("Share")).not.toBeInTheDocument();
  });
  it("completes the guided creator without text entry", async () => {
    const user = userEvent.setup();
    render(<Wizard />);
    await user.click(screen.getByRole("button", { name: "Man" }));
    for (let i = 0; i < 6; i++)
      await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Generate prompt" }));
    expect(screen.getByText("Here’s your magic prompt.")).toBeVisible();
    expect(
      screen.getByText(/Create a natural photograph of the man/),
    ).toBeVisible();
  });
  it("does not throw when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    render(<SaveButton id="blocked-test" title="Offline look" />);
    fireEvent.click(screen.getByRole("button", { name: "Save Offline look" }));
    expect(
      screen.getByRole("button", { name: "Unsave Offline look" }),
    ).toBeVisible();
  });
});
