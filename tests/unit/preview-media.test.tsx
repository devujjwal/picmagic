import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { PreviewMedia } from "@/components/prompts/preview-media";
import { promptSchema } from "@/types/content";
import data from "@/content/prompts.json";
vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));
const p = promptSchema.parse({
  ...data[44],
  preview_video: {
    url: "/videos/anniversary-test.mp4",
    width: 720,
    height: 1280,
    duration: 8,
    bytes: 180000,
    mime_type: "video/mp4",
    provenance: "Test metadata only; no production video claimed.",
  },
});
let observers: {
  cb: IntersectionObserverCallback;
  options: IntersectionObserverInit;
}[] = [];
let reduce = false;
beforeEach(() => {
  observers = [];
  reduce = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        cb: IntersectionObserverCallback,
        options: IntersectionObserverInit,
      ) {
        observers.push({ cb, options });
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: reduce,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: { saveData: false },
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function enter() {
  await act(async () => {
    for (const observer of [...observers])
      observer.cb(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
  });
}
describe("reel preview bandwidth and fallback", () => {
  it("renders only the poster before proximity and then starts muted inline video", async () => {
    const { container } = render(<PreviewMedia prompt={p} />);
    const video = container.querySelector("video")!;
    expect(video.hasAttribute("src")).toBe(false);
    expect(video.preload).toBe("none");
    await enter();
    expect(video.getAttribute("src")).toBe(p.preview_video!.url);
    expect(video.muted).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(screen.getByRole("button", { name: /Pause video/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pause video/ }));
    expect(video.hasAttribute("src")).toBe(false);
  });
  it.each(["reduced motion", "data saver"])(
    "does not automatically download with %s",
    async (mode) => {
      if (mode === "reduced motion") reduce = true;
      else
        Object.defineProperty(navigator, "connection", {
          configurable: true,
          value: { saveData: true },
        });
      const { container } = render(<PreviewMedia prompt={p} />);
      await enter();
      expect(container.querySelector("video")!.hasAttribute("src")).toBe(false);
    },
  );
  it("keeps a poster and removes broken video controls after a media failure", async () => {
    const { container } = render(<PreviewMedia prompt={p} />);
    await enter();
    fireEvent.error(container.querySelector("video")!);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("img")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("limits simultaneous proximity downloads to two", async () => {
    const { container } = render(
      <>
        {[1, 2, 3, 4].map((id) => (
          <PreviewMedia key={id} prompt={{ ...p, id: String(id) }} />
        ))}
      </>,
    );
    await enter();
    expect(container.querySelectorAll("video[src]")).toHaveLength(2);
  });
  it("does not imply a still-only record has a video", () => {
    const { container } = render(
      <PreviewMedia prompt={{ ...p, preview_video: null }} />,
    );
    expect(container.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
