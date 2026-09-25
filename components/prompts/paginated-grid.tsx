"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PromptCardData } from "@/lib/prompts/card-data";
import { PromptGrid } from "./prompt-grid";

const subscribe = () => () => {};
const supportsAutoLoad = () => typeof IntersectionObserver !== "undefined";
const serverSnapshot = () => false;

/** Scroll enhancement over crawlable, server-rendered 24-item pages. */
export function PaginatedGrid({
  prompts,
  page,
  path,
}: {
  prompts: PromptCardData[];
  page: number;
  path: string;
}) {
  const [batches, setBatches] = useState(1);
  const sentinel = useRef<HTMLDivElement>(null);
  const autoLoad = useSyncExternalStore(
    subscribe,
    supportsAutoLoad,
    serverSnapshot,
  );
  const start = (page - 1) * 24;
  const end = start + batches * 24;
  const visible = prompts.slice(start, end);
  const hasMore = end < prompts.length;
  useEffect(() => {
    if (!autoLoad || !hasMore || !sentinel.current) return;
    let consumed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || consumed) return;
        consumed = true;
        observer.disconnect();
        setBatches(batches + 1);
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(sentinel.current);
    return () => {
      consumed = true;
      observer.disconnect();
    };
  }, [autoLoad, hasMore, batches]);
  return (
    <>
      {visible.some((p) => p.content_intent !== "utility") && (
        <PromptGrid
          prompts={visible.filter((p) => p.content_intent !== "utility")}
          prioritizeFirst
        />
      )}
      {visible.some((p) => p.content_intent === "utility") && (
        <section className="section" aria-label="More looks to explore">
          <div className="section-head">
            <div>
              <h2>More looks to explore</h2>
              <p>
                Profiles, styling studies, product scenes and focused edits.
              </p>
            </div>
          </div>
          <PromptGrid
            prompts={visible.filter((p) => p.content_intent === "utility")}
            prioritizeFirst={
              !visible.some((p) => p.content_intent !== "utility")
            }
          />
        </section>
      )}
      <p className="sr-only" role="status">
        Showing {visible.length} looks on this page.
      </p>
      {hasMore && (
        <div
          ref={sentinel}
          data-load-more-sentinel
          className={autoLoad ? "relative h-px" : "pagination"}
        >
          <a
            className={
              autoLoad
                ? "sr-only focus:not-sr-only focus:relative button secondary"
                : "button secondary"
            }
            href={`${path}?page=${page + batches}`}
          >
            Load more looks
          </a>
        </div>
      )}
    </>
  );
}
