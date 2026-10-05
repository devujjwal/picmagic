import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import { allPrompts } from "@/content/catalog";
import { promptSchema } from "@/types/content";
import { PromptEvidence } from "@/components/prompts/prompt-evidence";
import { PromptReport } from "@/components/prompts/prompt-report";
import { promptEvidence } from "@/lib/prompts/evidence";
import { promptReportEmail } from "@/lib/prompts/report";
import { promptTestPlan } from "@/content/prompt-test-plan";
import { isPromptSeoEligible } from "@/lib/seo/eligibility";
import trial from "@/content/prompt-trial.json";

vi.mock("@/components/ui/site-link", () => ({
  default: ({ children, href }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));
const fold = promptSchema.parse(
  allPrompts.find((p) => p.slug === "a-fold-around-you-profile"),
);

describe("honest prompt evidence", () => {
  it("shows only recorded runs and distinguishes changed prompt wording", () => {
    expect(
      promptEvidence(fold.slug, fold.prompt_text)?.matchesCurrentPrompt,
    ).toBe(true);
    expect(
      promptEvidence(fold.slug, fold.prompt_text + " amended")
        ?.matchesCurrentPrompt,
    ).toBe(false);
    expect(
      promptEvidence("city-lights-main-character-energy", "anything"),
    ).toBeUndefined();
    const historical = renderToStaticMarkup(
      <PromptEvidence prompt={{ ...fold, prompt_text: "new wording" }} />,
    );
    expect(historical).toContain("historical input, not the current wording");
    expect(historical).toContain("0 corrective runs");
    expect(historical).toContain("Not disclosed");
    expect(historical).toContain("1254");
    expect(historical).toContain("real-person likeness");
  });
  it("does not turn guidance dates, preview approval or suggested tools into testing claims", () => {
    const prompt = promptSchema.parse(
      allPrompts.find((p) => p.slug === "city-lights-main-character-energy"),
    );
    const html = renderToStaticMarkup(
      <PromptEvidence
        prompt={prompt}
        guidanceUpdatedAt="2026-10-05T06:00:00Z"
      />,
    );
    expect(html).toContain("No tool-specific test record");
    expect(html).toContain("writing update, not a new generation test");
    expect(html).toContain("5 October 2026");
    expect(html).not.toContain("Documented single attempt");
    expect(html).not.toContain("Recorded first result");
  });
  it("keeps eight planned candidates separate from the two executed fictional trials", () => {
    expect(promptTestPlan).toHaveLength(8);
    expect(new Set(promptTestPlan.map((p) => p.slug)).size).toBe(8);
    for (const plan of promptTestPlan) {
      const prompt = promptSchema.parse(
        allPrompts.find((p) => p.slug === plan.slug),
      );
      expect(isPromptSeoEligible(prompt), plan.slug).toBe(true);
      expect(plan.variation.length).toBeGreaterThan(50);
      expect(plan.repairIfNeeded.length).toBeGreaterThan(50);
    }
    expect(trial.records).toHaveLength(2);
    expect(trial.records.every((r) => r.correctionsRun === 0)).toBe(true);
  });
});

describe("prompt-specific reporting", () => {
  it("encodes user text as data in an email draft without creating headers or extra URL fields", () => {
    const href = promptReportEmail(
      "feedback@example.com",
      "https://picmagic.in/test",
      "Likeness & anatomy",
      " Tool X ",
      "Face changed? &bcc=other@example.com\nMore detail",
    );
    const url = new URL(href);
    expect(url.protocol).toBe("mailto:");
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(url.searchParams.get("body")).toContain("Tool / model: Tool X");
    expect(url.searchParams.get("body")).toContain("&bcc=other@example.com");
    expect(
      promptReportEmail("feedback@example.com", "/test", "Issue", "", ""),
    ).toContain("Not%20specified");
  });
  it("prepares a draft with the canonical page address and does not automatically submit", () => {
    render(
      <PromptReport
        email="feedback@example.com"
        path="https://picmagic.in/example"
      />,
    );
    expect(screen.getByLabelText("Issue", { exact: true }).tagName).toBe(
      "SELECT",
    );
    fireEvent.change(screen.getByLabelText("Tool / model (optional)"), {
      target: { value: "ChatGPT web" },
    });
    fireEvent.change(screen.getByLabelText("What happened?"), {
      target: { value: "Hair changed" },
    });
    const url = new URL(
      screen
        .getByRole("link", { name: "Prepare issue email", hidden: true })
        .getAttribute("href")!,
    );
    expect(url.searchParams.get("body")).toContain(
      "Prompt: https://picmagic.in/example",
    );
    expect(url.searchParams.get("body")).toContain("Hair changed");
    expect(document.querySelector('input[type="file"]')).toBeNull();
    expect(document.querySelector('button[type="submit"]')).toBeNull();
  });
  it("offers the existing contact route when no email is configured", () => {
    const html = renderToStaticMarkup(
      <PromptReport email="" path="https://picmagic.in/example" />,
    );
    expect(html).toContain('href="/contact"');
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("textarea");
  });
});
