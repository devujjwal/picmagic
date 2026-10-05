import { readFileSync } from "node:fs";
import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import {
  BrandLogo,
  BrandMark,
  BrandWordmark,
} from "@/components/ui/brand-logo";
import wordmark from "@/config/brand-wordmark.json";

afterEach(cleanup);

it("renders the chosen mark with a readable two-tone wordmark", () => {
  const { container } = render(<BrandLogo />);
  expect(container.textContent).toBe("PicMagic");
  expect(container.querySelector(".sr-only")?.textContent).toBe("PicMagic");
  expect(container.querySelectorAll(".brand-wordmark path")).toHaveLength(2);
  expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelector("svg")).toHaveAttribute("focusable", "false");
  expect(container.querySelector("svg")).toHaveAttribute("width", "36");
});

it("uses the same outlined typeface in website, share cards and social exports", () => {
  const { container } = render(<BrandWordmark height={35} />);
  expect(wordmark.font).toBe("Manrope Bold (700)");
  expect(container.querySelector("svg")).toHaveAttribute("height", "35");
  expect(container.querySelector("svg")).toHaveAttribute(
    "viewBox",
    wordmark.compact.viewBox,
  );
  expect(
    Array.from(container.querySelectorAll("path"), (p) => p.getAttribute("d")),
  ).toEqual(wordmark.compact.paths);
  const social = readFileSync(
    "brand-assets/PicMagic-Final-Social-Logo/picmagic-magic-frame-master.svg",
    "utf8",
  );
  for (const path of wordmark.spaced.paths) expect(social).toContain(path);
  expect(social).not.toContain("<text");
});

it("keeps favicon geometry and colour identical to the inline logo", () => {
  const icon = new DOMParser().parseFromString(
    readFileSync("app/icon.svg", "utf8"),
    "image/svg+xml",
  );
  const { container } = render(<BrandMark size={44} />);
  const paths = (root: ParentNode) =>
    Array.from(root.querySelectorAll("path"), (path) => path.getAttribute("d"));
  expect(paths(container)).toEqual(paths(icon));
  expect(icon.documentElement.getAttribute("fill")).toBe(
    container.querySelector("svg")?.getAttribute("fill"),
  );
  expect(icon.documentElement.getAttribute("viewBox")).toBe("0 0 64 64");
  expect(container.querySelector("svg")).toHaveAttribute("width", "44");
});
