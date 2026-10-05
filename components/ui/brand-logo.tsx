import wordmark from "@/config/brand-wordmark.json";

/** Option 1: an open photo frame with a single four-point spark. */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="#c94839"
      aria-hidden="true"
      focusable="false"
      className="brand-mark"
    >
      <path d="M6 20H32V28H14V42H6ZM6 46H14V54H28V62H6ZM34 54H46V36H54V62H34Z" />
      <path d="M48 2C50 14 52 16 64 18C52 20 50 22 48 34C46 22 44 20 32 18C44 16 46 14 48 2Z" />
    </svg>
  );
}

/** Outlined Manrope Bold: no font request or platform-dependent substitution. */
export function BrandWordmark({ height = 28 }: { height?: number }) {
  const { viewBox, width, height: sourceHeight, paths } = wordmark.compact;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={(height * width) / sourceHeight}
      height={height}
      aria-hidden="true"
      focusable="false"
      className="brand-wordmark"
    >
      <path fill="#232522" d={paths[0]} />
      <path fill="#c94839" d={paths[1]} />
    </svg>
  );
}

export function BrandLogo() {
  return (
    <>
      <BrandMark />
      <span className="brand-name">
        <BrandWordmark />
        <span className="sr-only">PicMagic</span>
      </span>
    </>
  );
}
