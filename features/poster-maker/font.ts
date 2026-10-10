let pending: Promise<void> | undefined;
/** Fetch explicitly so a failed font resource can be retried without a reload. */
export function loadPosterFont(): Promise<void> {
  if (!pending) {
    pending = Promise.all(
      [
        ["PicMagic Devanagari", "/fonts/noto-sans-devanagari.ttf", "100 900"],
        ["PicMagic Display", "/fonts/cormorant-garamond.ttf", "300 700"],
      ].map(async ([family, path, weight]) => {
        const response = await fetch(path, { cache: "no-cache" });
        if (!response.ok) throw Error("Poster font unavailable");
        const face = new FontFace(family, await response.arrayBuffer(), {
          weight,
        });
        const loaded = await face.load();
        document.fonts.add(loaded);
      }),
    )
      .then(() => undefined)
      .catch((error: unknown) => {
        pending = undefined;
        throw error;
      });
  }
  return pending;
}
