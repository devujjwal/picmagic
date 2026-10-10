import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CopyJourney,
  PromptCopyChooser,
} from "@/components/affiliate/copy-journey";
import { CopyButton } from "@/components/share/detail-actions";
import { RecommendedTools } from "@/components/affiliate/recommended-tools";
import { AffiliateToolList } from "@/components/affiliate/tool-list";
import { affiliateProviderSeeds } from "@/content/affiliate/providers";
import {
  publicProvider,
  recommendTools,
} from "@/lib/affiliate/recommendations";
import { NoticeProvider } from "@/features/saved/store";
const now = Date.parse("2026-10-10T00:00:00Z");
const tools = recommendTools(
  affiliateProviderSeeds.map((p) => publicProvider(p, now)),
  "portrait",
  false,
  now,
);
const context = {
  prompt_type: "photo" as const,
  content_slug: "public-look",
  placement: "photo_detail" as const,
};
function Journey() {
  return (
    <CopyJourney tools={tools} context={context}>
      <CopyButton
        text="My unchanged prompt"
        copyLocation="upper"
        label="Copy complete prompt"
      />
      <PromptCopyChooser at="upper" />
      <CopyButton text="My unchanged prompt" />
      <PromptCopyChooser at="lower" />
    </CopyJourney>
  );
}
describe("optional tool chooser", () => {
  it("opens only after successful copy, dismisses and supports either button", async () => {
    const user = userEvent.setup();
    const copied = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    render(<Journey />);
    expect(
      screen.queryByRole("region", { name: "Choose an AI tool after copying" }),
    ).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Copy complete prompt" }),
    );
    expect(copied).toHaveBeenCalledWith("My unchanged prompt");
    const chooser = screen.getByRole("region", {
      name: "Choose an AI tool after copying",
    });
    expect(
      within(chooser).getByText(/Nothing is transferred automatically/),
    ).toBeVisible();
    expect(within(chooser).getAllByRole("link")).toHaveLength(3);
    await user.click(
      within(chooser).getByRole("button", { name: "Dismiss tool choices" }),
    );
    expect(
      screen.queryByRole("region", { name: "Choose an AI tool after copying" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));
    expect(
      screen.getAllByRole("region", {
        name: "Choose an AI tool after copying",
      }),
    ).toHaveLength(1);
  });
  it("does not suggest tools when copying fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied"),
    );
    const notice = vi.fn();
    render(
      <NoticeProvider value={notice}>
        <Journey />
      </NoticeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));
    expect(screen.queryByText("Ready to create your image?")).toBeNull();
    expect(notice).toHaveBeenCalledWith(expect.stringContaining("manually"));
  });
  it("uses ordinary rel attributes and an honest disclosure by default", () => {
    render(<RecommendedTools tools={tools} context={context} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByText(/ordinary links/)).toBeVisible();
    expect(screen.queryByText("Affiliate link")).toBeNull();
  });
  it("labels synthetic monetized rendering and uses sponsored attributes", () => {
    // Render-only fixture, not an issued URL, application, stored provider or navigation.
    render(
      <AffiliateToolList
        tools={[{ ...tools[0], affiliate_enabled: true }]}
        context={context}
      />,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "rel",
      "sponsored noopener noreferrer",
    );
    expect(screen.getByText("Affiliate link")).toBeVisible();
    expect(screen.getByText(/may earn a commission/)).toBeVisible();
  });
  it("omits empty modules and explains video limits", () => {
    const { rerender } = render(
      <RecommendedTools tools={[]} context={context} />,
    );
    expect(screen.queryByRole("region")).toBeNull();
    rerender(
      <RecommendedTools
        tools={tools.slice(0, 1)}
        context={{ ...context, prompt_type: "reel", placement: "reel_detail" }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Turn this idea into a video" }),
    ).toBeVisible();
    expect(screen.getByText(/one generation may not produce/)).toBeVisible();
  });
});
