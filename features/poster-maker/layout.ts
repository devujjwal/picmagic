import { formats, type PosterState } from "./designs";
export type Box = { x: number; y: number; w: number; h: number };

/** One deterministic geometry source for both full-resolution preview and export.
 * The full artwork is contained, never stretched or cropped across sacred motifs.
 */
export function posterLayout(state: PosterState, hasPhoto: boolean) {
  const [w, h] = formats[state.format];
  const scale = Math.min(w / 1080, h / 1350);
  const aw = 1080 * scale,
    ah = 1350 * scale;
  const artwork: Box = { x: (w - aw) / 2, y: 0, w: aw, h: ah };
  const story = state.format === "story";
  const centeredArt = state.design !== "durga-puja";
  // Match each generated scene's actual negative space; keep the idol unobscured.
  const x = artwork.x + (centeredArt ? 250 : 110) * scale;
  const width = 510 * scale;
  const top = 170 * scale;
  const greetingY = 320 * scale;
  const greetingH = 300 * scale;
  const contacts = [
    state.website,
    state.email,
    state.phone,
    state.details,
  ].filter((v) => v.trim());
  const footerH = contacts.length ? Math.max(92, 40 + contacts.length * 42) : 0;
  const photoHeight = (story ? 180 : 220) * scale;
  return {
    artwork,
    brand: { x, y: top, w: width, h: 110 * scale },
    greeting: { x, y: greetingY, w: width, h: greetingH },
    message: {
      x: story ? 140 : x,
      y: story ? 1380 : greetingY + greetingH + 24 * scale,
      w: story ? 800 : width,
      h: (story ? (hasPhoto ? 100 : 200) : hasPhoto ? 130 : 180) * scale,
    },
    photo: hasPhoto
      ? {
          x: story
            ? (w - (state.layout === "split" ? width : photoHeight)) / 2
            : state.layout === "split"
              ? x
              : x + (width - photoHeight) / 2,
          y: story ? 1510 : 805 * scale,
          w: state.layout === "split" ? width : photoHeight,
          h: photoHeight,
        }
      : null,
    footer: { x: 0, y: h - footerH, w, h: footerH },
    scale,
  };
}
