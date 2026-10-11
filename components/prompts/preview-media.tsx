"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { PreviewImage } from "./preview-image";
import { TrackedLink } from "@/components/ui/tracked-link";
import type { PromptCardData } from "@/lib/prompts/card-data";
// At most two preview downloads/players compete with the page at a time.
const leases = new Set<HTMLVideoElement>();
const listeners = new Set<() => void>();
function release(video: HTMLVideoElement) {
  if (leases.delete(video)) listeners.forEach((fn) => fn());
}
export function PreviewMedia({
  prompt,
  priority = false,
  detail = false,
  href,
  source,
}: {
  prompt: PromptCardData;
  priority?: boolean;
  detail?: boolean;
  href?: string;
  source?: "related" | "search";
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false);
  const [paused, setPaused] = useState(false);
  const asset = prompt.preview_video;
  useEffect(() => {
    const element = video.current;
    const container = box.current;
    if (
      !asset ||
      !element ||
      !container ||
      failed ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let near = false,
      visible = false,
      stopped = false;
    const sync = () => {
      if (stopped) return;
      const allowed =
        !paused && (manual || (!motion.matches && !connection?.saveData));
      if (!allowed || !near || document.hidden) {
        element.pause();
        setPlaying(false);
        release(element);
        // Removing src prevents off-screen elements continuing a transfer.
        if (element.hasAttribute("src")) {
          element.removeAttribute("src");
          element.load();
        }
        return;
      }
      if (!leases.has(element) && leases.size >= 2) return;
      leases.add(element);
      if (!element.hasAttribute("src")) {
        element.src = asset.url;
        element.load();
      }
      if (visible)
        element
          .play()
          .then(() => {
            if (!stopped) setPlaying(true);
          })
          .catch(() => {
            if (!stopped) setPlaying(false);
          });
      else {
        element.pause();
        setPlaying(false);
      }
    };
    // src is absent from server HTML: poster is the only initial request.
    const proximity = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    );
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        sync();
      },
      { threshold: [0, 0.25] },
    );
    listeners.add(sync);
    proximity.observe(container);
    visibility.observe(container);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stopped = true;
      listeners.delete(sync);
      proximity.disconnect();
      visibility.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.pause();
      element.removeAttribute("src");
      element.load();
      release(element);
    };
  }, [asset, failed, manual, paused]);
  const visual = (
    <>
      <PreviewImage
        src={detail ? prompt.preview_image_url : prompt.thumbnail_url}
        alt={prompt.image_alt}
        priority={priority}
        sizes={
          detail
            ? "(max-width:550px) calc(100vw - 40px), (max-width:760px) calc(50vw - 32.5px), (max-width:1100px) calc(48.78vw - 44px), (max-width:1280px) calc(48.78vw - 66px), 559px"
            : undefined
        }
      />
      {asset && !failed && (
        <video
          ref={video}
          className={`preview-motion${playing ? " is-playing" : ""}`}
          width={asset.width}
          height={asset.height}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        />
      )}
    </>
  );
  return (
    <div ref={box} className="preview-media">
      {href ? (
        <TrackedLink
          href={href}
          source={source}
          id={prompt.id}
          tabIndex={-1}
          aria-hidden="true"
        >
          {visual}
        </TrackedLink>
      ) : (
        visual
      )}
      {asset && !failed && (
        <button
          type="button"
          className="preview-play"
          aria-label={`${playing ? "Pause" : "Play"} video preview: ${prompt.title}`}
          onClick={() => {
            if (playing) setPaused(true);
            else {
              setManual(true);
              setPaused(false);
            }
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
