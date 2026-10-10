export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export function sniffImage(bytes: Uint8Array): string | null {
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n))
    return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return "image/jpeg";
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp";
  return null;
}
export function validateDimensions(width: number, height: number) {
  if (
    !width ||
    !height ||
    width > 8192 ||
    height > 8192 ||
    width * height > 24_000_000
  )
    throw new Error(
      "Use an image up to 8192 pixels per side and 24 megapixels.",
    );
}
export type LocalImage = { image: HTMLImageElement; url: string };
export async function decodeUpload(file: File): Promise<LocalImage> {
  if (!file.size || file.size > MAX_UPLOAD_BYTES)
    throw new Error("Choose a PNG, JPEG or WebP file no larger than 10 MB.");
  const mime = sniffImage(
    new Uint8Array(await file.slice(0, 12).arrayBuffer()),
  );
  if (!mime || mime !== file.type)
    throw new Error(
      "This is not a supported PNG, JPEG or WebP image. SVG is not accepted.",
    );
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    validateDimensions(image.naturalWidth, image.naturalHeight);
    return { image, url };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new Error(
      error instanceof Error && error.message.startsWith("Use an image")
        ? error.message
        : "We could not decode that image. Try another PNG, JPEG or WebP.",
    );
  }
}
