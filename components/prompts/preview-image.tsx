"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
export function PreviewImage({
  src,
  alt,
  priority = false,
  preload = false,
  preoptimized = false,
  sizes = "(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 23vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  preload?: boolean;
  preoptimized?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback" role="img" aria-label={alt}>
      <ImageOff size={25} />
      <span>Preview unavailable</span>
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={preoptimized && src.startsWith("/previews/")}
      preload={preload}
      loading={preload ? undefined : priority ? "eager" : "lazy"}
      fetchPriority={!preload && priority ? "high" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
