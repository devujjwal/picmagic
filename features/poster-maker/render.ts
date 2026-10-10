import { formats, getDesign, type PosterState } from "./designs";
import { posterLayout, type Box } from "./layout";
export function coverCrop(
  iw: number,
  ih: number,
  box: Box,
  x = 50,
  y = 50,
  zoom = 1,
) {
  const scale = Math.max(box.w / iw, box.h / ih) * Math.max(1, zoom);
  const w = box.w / scale,
    h = box.h / scale;
  return {
    x: ((iw - w) * Math.min(100, Math.max(0, x))) / 100,
    y: ((ih - h) * Math.min(100, Math.max(0, y))) / 100,
    w,
    h,
  };
}
export function wrapText(
  text: string,
  width: number,
  measure: (s: string) => number,
): string[] {
  const lines: string[] = [];
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      if (measure(line ? `${line} ${word}` : word) <= width) {
        line = line ? `${line} ${word}` : word;
        continue;
      }
      if (line) {
        lines.push(line);
        line = "";
      }
      for (const { segment } of segmenter.segment(word)) {
        if (line && measure(line + segment) > width) {
          lines.push(line);
          line = "";
        }
        line += segment;
      }
    }
    lines.push(line);
  }
  return lines;
}
function imageInBox(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  b: Box,
  mode: "contain" | "cover",
  s?: PosterState,
) {
  if (mode === "cover") {
    const crop = coverCrop(
      image.naturalWidth,
      image.naturalHeight,
      b,
      s?.photoX,
      s?.photoY,
      s?.zoom,
    );
    ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, b.x, b.y, b.w, b.h);
  } else {
    const scale = Math.min(b.w / image.naturalWidth, b.h / image.naturalHeight);
    const w = image.naturalWidth * scale,
      h = image.naturalHeight * scale;
    ctx.drawImage(image, b.x + (b.w - w) / 2, b.y + (b.h - h) / 2, w, h);
  }
}
function textInBox(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: Box,
  size: number,
  min: number,
  color: string,
  weight: number,
  centered: boolean,
  display = false,
): boolean {
  if (!text.trim()) return true;
  let lines: string[] = [];
  const useDisplay = display && !/[\u0900-\u097f]/.test(text);
  const leading = useDisplay ? 1.05 : 1.45;
  for (; size >= min; size -= 2) {
    const family = useDisplay
      ? '"PicMagic Display", serif'
      : '"PicMagic Devanagari", Arial, sans-serif';
    ctx.font = `${weight} ${size}px ${family}`;
    lines = wrapText(text, box.w, (value) => ctx.measureText(value).width);
    if (
      lines.length * size * leading <= box.h &&
      lines.every((l) => ctx.measureText(l).width <= box.w)
    )
      break;
  }
  if (size < min) return false;
  ctx.fillStyle = color;
  ctx.textAlign = centered ? "center" : "left";
  ctx.textBaseline = "middle";
  const top = box.y + (box.h - lines.length * size * leading) / 2;
  lines.forEach((line, i) =>
    ctx.fillText(
      line,
      box.x + (centered ? box.w / 2 : 0),
      top + size * leading * (i + 0.5),
    ),
  );
  return true;
}
export function renderPoster(
  canvas: HTMLCanvasElement,
  state: PosterState,
  artwork: HTMLImageElement,
  photo?: HTMLImageElement,
  logo?: HTMLImageElement,
): string[] {
  const [w, h] = formats[state.format];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser does not support poster rendering.");
  const d = getDesign(state.design);
  ctx.fillStyle = d.background;
  ctx.fillRect(0, 0, w, h);
  const boxes = posterLayout(state, !!photo);
  imageInBox(ctx, artwork, boxes.artwork, "contain");
  if (state.format === "story") {
    ctx.fillStyle = "#213c2b";
    ctx.fillRect(0, boxes.artwork.h, w, h - boxes.artwork.h);
  }
  const errors: string[] = [];
  const s = boxes.scale;
  const brand = { ...boxes.brand };
  if (logo) {
    const size = brand.h;
    const logoBox = {
      x: brand.x + (brand.w - size) / 2,
      y: brand.y - 72 * s,
      w: size,
      h: size,
    };
    // A neutral backing preserves the original logo colours, never AI lettering.
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(logoBox.x - 8, logoBox.y - 8, size + 16, size + 16);
    imageInBox(ctx, logo, logoBox, "contain");
    brand.y += 45 * s;
    brand.h = 65 * s;
  }
  const draw = (
    label: string,
    text: string,
    box: Box,
    size: number,
    min: number,
    color: string,
    weight: number,
    display = false,
  ) => {
    if (!textInBox(ctx, text, box, size, min, color, weight, true, display))
      errors.push(
        `${label} does not fit. Shorten it or choose another format/layout.`,
      );
  };
  draw("Company / name", state.name, brand, 35 * s, 20 * s, "#253c2a", 600);
  draw(
    "Greeting",
    state.greeting,
    boxes.greeting,
    122 * s,
    38 * s,
    state.accent,
    600,
    true,
  );
  draw(
    "Message",
    state.message,
    boxes.message,
    35 * s,
    22 * s,
    state.format === "story" ? "#fff5df" : "#253c2a",
    400,
    true,
  );
  // A small editorial rule, not an opaque card, separates typography from scene.
  const ruleY = boxes.message.y + boxes.message.h + 15 * s;
  ctx.strokeStyle = state.format === "story" ? "#d9b879" : state.accent;
  ctx.lineWidth = s;
  ctx.beginPath();
  ctx.moveTo(boxes.message.x + boxes.message.w / 2 - 70 * s, ruleY);
  ctx.lineTo(boxes.message.x + boxes.message.w / 2 + 70 * s, ruleY);
  ctx.stroke();
  if (photo && boxes.photo) {
    const b = boxes.photo;
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(b.x - 10, b.y - 10, b.w + 20, b.h + 20);
    ctx.strokeStyle = state.accent;
    ctx.strokeRect(b.x - 10, b.y - 10, b.w + 20, b.h + 20);
    imageInBox(ctx, photo, b, "cover", state);
  }
  const contact = [state.website, state.email, state.phone, state.details]
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n");
  if (contact) {
    const b = boxes.footer;
    ctx.fillStyle = "#213c2b";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = "#d9b879";
    ctx.fillRect(0, b.y, w, 3);
    draw(
      "Contact / other details",
      contact,
      { x: 60, y: b.y + 16, w: w - 120, h: b.h - 32 },
      28,
      22,
      "#fff5df",
      400,
    );
  }
  canvas.dataset.posterLayout = `${state.design}:${state.format}:${state.layout}`;
  return errors;
}
