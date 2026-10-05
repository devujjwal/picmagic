import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { site } from "@/config/site";
import { Footer } from "@/components/layout/footer";
import Contact from "@/app/contact/page";

vi.mock("@/components/layout/privacy-choices", () => ({
  PrivacyChoices: () => <button>Privacy choices</button>,
}));
afterEach(cleanup);

it("uses only the owner's verified social profiles", () => {
  expect(site.social).toEqual([
    { label: "Instagram", href: "https://www.instagram.com/picmagic.in/" },
    { label: "Facebook", href: "https://www.facebook.com/picmagic.in/" },
  ]);
});

it.each([
  ["footer", Footer],
  ["contact page", Contact],
] as const)(
  "renders accessible, ordinary social links in the %s",
  (_, Component) => {
    render(<Component />);
    for (const { label, href } of site.social) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("rel", "me");
      expect(link).not.toHaveAttribute("target");
    }
  },
);
