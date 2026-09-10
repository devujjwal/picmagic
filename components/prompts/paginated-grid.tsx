"use client";
import { useState } from "react";
import type { Prompt } from "@/types/content";
import { PromptGrid } from "./prompt-grid";

/** The ordinary next-page link remains usable without JavaScript. */
export function PaginatedGrid({
  prompts,
  page,
  path,
}: {
  prompts: Prompt[];
  page: number;
  path: string;
}) {
  const [batches, setBatches] = useState(1);
  const start = (page - 1) * 24;
  const end = start + batches * 24;
  const visible = prompts.slice(start, end);
  return (
    <>
      <PromptGrid prompts={visible} prioritizeFirst />
      <p className="sr-only" role="status">
        Showing {visible.length} looks on this page.
      </p>
      {end < prompts.length && (
        <div className="pagination">
          <a
            className="button secondary"
            href={`${path}?page=${page + batches}`}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              setBatches((value) => value + 1);
            }}
          >
            Load more looks
          </a>
        </div>
      )}
    </>
  );
}
