"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PromptCardData } from "@/lib/prompts/card-data";
import { PromptGrid } from "./prompt-grid";

const subscribe = () => () => {};
const supportsAutoLoad = () => typeof IntersectionObserver !== "undefined";
const serverSnapshot = () => false;

/** Scroll enhancement over crawlable, server-rendered 24-item pages.
 * CatalogPage keys this component by route, page and server snapshot: a new feed
 * resets batches by remounting, never by reordering an already-open feed.
 */
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
  const sectionLabel = path.startsWith("/reel-prompts")
    ? "Motion plans to explore"
    : {
        "/ai-prompts/family": "Family portraits and faithful restorations",
        "/ai-prompts/wedding": "Wedding clothing and shared moments",
        "/ai-prompts/birthday": "Birthday portraits and celebration props",
        "/ai-prompts/festival": "Celebration-specific portraits",
        "/ai-prompts/product-photography": "Product sets and material studies",
        "/collections/indian-festivals":
          "Festival portraits and cultural details",
      }[path] || "More looks to explore";
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
        <section className="section" aria-label={sectionLabel}>
          <div className="section-head">
            <div>
              <h2>{sectionLabel}</h2>
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
      <p className="result-count" role="status">
        Showing looks {start + 1}–{Math.min(end, prompts.length)} of{" "}
        {prompts.length}.
      </p>
      {Math.ceil(prompts.length / 24) > 1 && (
        <nav className="pagination flex-wrap" aria-label="Prompt pages">
          {page > 1 && (
            <a
              className="button secondary"
              rel="prev"
              href={page === 2 ? path : `${path}?page=${page - 1}`}
            >
              Previous page
            </a>
          )}
          <p className="basis-full text-center">
            Server page {page} of {Math.ceil(prompts.length / 24)} · appended
            results shown above
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              { length: Math.ceil(prompts.length / 24) },
              (_, i) => i + 1,
            ).map((number) => (
              <a
                key={number}
                className="chip"
                aria-current={number === page ? "page" : undefined}
                href={number === 1 ? path : `${path}?page=${number}`}
              >
                Page {number}
              </a>
            ))}
          </div>
        </nav>
      )}
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
