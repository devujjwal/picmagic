import { formats, getDesign, type PosterState } from "./designs";
type Box = { x: number; y: number; w: number; h: number };
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
): boolean {
  if (!text.trim()) return true;
  let lines: string[] = [];
  for (; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px "PicMagic Devanagari", Arial, sans-serif`;
    lines = wrapText(text, box.w, (value) => ctx.measureText(value).width);
    if (
      lines.length * size * 1.5 <= box.h &&
      lines.every((l) => ctx.measureText(l).width <= box.w)
    )
      break;
  }
  if (size < min) return false;
  ctx.fillStyle = color;
  ctx.textAlign = centered ? "center" : "left";
  ctx.textBaseline = "middle";
  const top = box.y + (box.h - lines.length * size * 1.5) / 2;
  lines.forEach((line, i) =>
    ctx.fillText(
      line,
      box.x + (centered ? box.w / 2 : 0),
      top + size * 1.5 * (i + 0.5),
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
  // Fit the whole illustration; no crop can cut off its festival motifs.
  imageInBox(ctx, artwork, { x: 0, y: 0, w, h }, "contain");
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(48, h * 0.15, w - 96, h * 0.69);
  if (logo) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(444, h * 0.055, 192, 100);
    imageInBox(
      ctx,
      logo,
      { x: 456, y: h * 0.055 + 12, w: 168, h: 76 },
      "contain",
    );
  }
  const split = state.layout === "split" && !!photo;
  const textX = split ? 80 : 100,
    textW = split ? 470 : 880;
  const textTop = photo && !split ? h * 0.405 : h * 0.25;
  const contact = [state.website, state.email, state.phone, state.details]
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n");
  const textBottom = h * 0.82;
  if (photo) {
    const b = split
      ? { x: 592, y: h * 0.25, w: 380, h: h * 0.48 }
      : { x: 390, y: h * 0.17, w: 300, h: h * 0.22 };
    ctx.fillStyle = state.accent;
    ctx.fillRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
    imageInBox(ctx, photo, b, "cover", state);
  }
  const space = textBottom - textTop;
  const entries = [
    {
      label: "Greeting",
      text: state.greeting,
      fraction: contact ? 0.3 : 0.45,
      size: split ? 60 : 80,
      min: 34,
      color: state.accent,
      weight: 700,
    },
    {
      label: "Message",
      text: state.message,
      fraction: contact ? 0.25 : 0.35,
      size: 36,
      min: 24,
      color: "#ffffff",
      weight: 400,
    },
    {
      label: "Company / name",
      text: state.name,
      fraction: contact ? 0.15 : 0.2,
      size: 36,
      min: 22,
      color: "#ffffff",
      weight: 700,
    },
    {
      label: "Contact / other details",
      text: contact,
      fraction: contact ? 0.3 : 0,
      size: 24,
      min: 18,
      color: "#ffffff",
      weight: 400,
    },
  ];
  const errors: string[] = [];
  let y = textTop;
  for (const e of entries) {
    const height = space * e.fraction;
    if (
      !textInBox(
        ctx,
        e.text,
        { x: textX, y, w: textW, h: height },
        e.size,
        e.min,
        e.color,
        e.weight,
        !split,
      )
    )
      errors.push(
        `${e.label} does not fit. Shorten it or choose another format/layout.`,
      );
    y += height;
  }
  canvas.dataset.posterLayout = `${state.design}:${state.format}:${state.layout}`;
  return errors;
}
