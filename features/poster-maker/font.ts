let pending: Promise<void> | undefined;
/** Fetch explicitly so a failed font resource can be retried without a reload. */
export function loadPosterFont(): Promise<void> {
  if (!pending) {
    pending = fetch("/fonts/noto-sans-devanagari.ttf", { cache: "no-cache" })
      .then(async (response) => {
        if (!response.ok) throw Error("Poster font unavailable");
        const face = new FontFace(
          "PicMagic Devanagari",
          await response.arrayBuffer(),
          { weight: "100 900" },
        );
        return face.load();
      })
      .then((loaded) => {
        document.fonts.add(loaded);
      })
      .catch((error: unknown) => {
        pending = undefined;
        throw error;
      });
  }
  return pending;
}
