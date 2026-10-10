import { describe, expect, it, vi, afterEach } from "vitest";
import {
  getDesign,
  initialPoster,
  posterDesigns,
  validatePoster,
  formats,
} from "@/features/poster-maker/designs";
import {
  coverCrop,
  wrapText,
  renderPoster,
} from "@/features/poster-maker/render";
import {
  sniffImage,
  validateDimensions,
  decodeUpload,
  MAX_UPLOAD_BYTES,
} from "@/features/poster-maker/uploads";
import { posterMakerPath } from "@/features/poster-maker/links";

afterEach(() => vi.unstubAllGlobals());
describe("poster editor", () => {
  it("only allows approved design identifiers and produces no personal-data URL", () => {
    for (const value of [
      "../../private",
      "?name=Secret",
      "data:image/png;base64,x",
      null,
    ])
      expect(getDesign(value).id).toBe("diwali");
    for (const d of posterDesigns)
      expect(posterMakerPath(d.templateId, d.slug)).toBe(
        `/festival-poster-maker?design=${d.id}`,
      );
    expect(posterMakerPath("other", posterDesigns[0].slug)).toBeNull();
  });
  it("has English/Hindi presets, blank optional fields and exact export sizes", () => {
    expect(formats).toEqual({
      square: [1080, 1080],
      portrait: [1080, 1350],
      story: [1080, 1920],
    });
    for (const d of posterDesigns)
      for (const lang of ["en", "hi"] as const) {
        const state = initialPoster(d.id, lang);
        expect(validatePoster(state)).toEqual([]);
        expect(state.name).toBe("");
        expect(state.website).toBe("");
        expect(state.email).toBe("");
        expect(state.phone).toBe("");
        expect(state.details).toBe("");
        if (lang === "hi") expect(state.greeting).toMatch(/[\u0900-\u097f]/);
      }
  });
  it("rejects missing greetings, excessive text and invalid colours", () => {
    expect(
      validatePoster({
        ...initialPoster(),
        greeting: " ",
        message: "x".repeat(181),
        accent: "red",
      }),
    ).toHaveLength(3);
  });
  it("sniffs supported bytes rather than trusting extensions", () => {
    expect(sniffImage(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe(
      "image/png",
    );
    expect(sniffImage(Uint8Array.from([255, 216, 255]))).toBe("image/jpeg");
    expect(sniffImage(new TextEncoder().encode("RIFF1234WEBP"))).toBe(
      "image/webp",
    );
    expect(sniffImage(new TextEncoder().encode("<svg></svg>"))).toBeNull();
    expect(sniffImage(new TextEncoder().encode("GIF89a"))).toBeNull();
  });
  it("enforces upload byte limits and decoded pixel limits", async () => {
    await expect(
      decodeUpload({ size: MAX_UPLOAD_BYTES + 1 } as File),
    ).rejects.toThrow("10 MB");
    await expect(decodeUpload({ size: 0 } as File)).rejects.toThrow("10 MB");
    expect(() => validateDimensions(8193, 1)).toThrow();
    expect(() => validateDimensions(6000, 5000)).toThrow();
    expect(() => validateDimensions(0, 100)).toThrow();
    expect(() => validateDimensions(4000, 6000)).not.toThrow();
  });
  it("does not allocate a blob URL for a spoofed SVG", async () => {
    const bytes = new TextEncoder().encode("<svg></svg>");
    await expect(
      decodeUpload({
        size: bytes.length,
        type: "image/png",
        slice: () => ({ arrayBuffer: async () => bytes.buffer }),
      } as unknown as File),
    ).rejects.toThrow("SVG");
  });
  it("revokes the temporary object URL when decoding fails", async () => {
    const revoke = vi.fn();
    vi.stubGlobal("URL", {
      createObjectURL: () => "blob:test",
      revokeObjectURL: revoke,
    });
    vi.stubGlobal(
      "Image",
      class {
        decode() {
          return Promise.reject(Error("decode"));
        }
      },
    );
    const bytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
    await expect(
      decodeUpload({
        size: 8,
        type: "image/png",
        slice: () => ({ arrayBuffer: async () => bytes.buffer }),
      } as unknown as File),
    ).rejects.toThrow("decode");
    expect(revoke).toHaveBeenCalledWith("blob:test");
  });
  it("clamps crop positioning and preserves the photo aspect ratio", () => {
    const b = { x: 0, y: 0, w: 300, h: 600 };
    expect(coverCrop(1000, 1000, b, 0, 0)).toEqual({
      x: 0,
      y: 0,
      w: 500,
      h: 1000,
    });
    expect(coverCrop(1000, 1000, b, 200, 50, 2)).toEqual({
      x: 750,
      y: 250,
      w: 250,
      h: 500,
    });
  });
  it("wraps long words without splitting Hindi grapheme clusters", () => {
    expect(wrapText("one two\nthree", 7, (s) => s.length)).toEqual([
      "one two",
      "three",
    ]);
    const hindi = "शुभकामनाएँ";
    const graphemes = Array.from(
      new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(hindi),
      (s) => s.segment,
    );
    expect(
      wrapText(
        hindi,
        1,
        (s) =>
          Array.from(
            new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(s),
          ).length,
      ),
    ).toEqual(graphemes);
  });
  it("fails clearly when Canvas is unavailable", () => {
    expect(() =>
      renderPoster(
        { getContext: () => null } as unknown as HTMLCanvasElement,
        initialPoster(),
        {} as HTMLImageElement,
      ),
    ).toThrow("does not support");
  });
});
