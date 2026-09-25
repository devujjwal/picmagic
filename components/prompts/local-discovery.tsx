"use client";
import Link from "@/components/ui/site-link";
import { Bookmark, ArrowRight } from "lucide-react";
import { useSaved, useRecent } from "@/features/saved/store";
import { PromptGrid } from "./prompt-grid";
import type { PromptCardData } from "@/lib/prompts/card-data";
export function LocalDiscovery({
  prompts,
  mode,
  excludedIds = [],
}: {
  prompts: PromptCardData[];
  mode: "saved" | "recent";
  excludedIds?: string[];
}) {
  const { ids } = useSaved();
  const recent = useRecent();
  const selected = [...new Set(mode === "saved" ? ids : recent)].flatMap(
    (id) => {
      const p = prompts.find((p) => p.id === id);
      return p && !excludedIds.includes(p.id) ? [p] : [];
    },
  );
  if (!selected.length)
    return mode === "recent" ? null : (
      <div className="empty-state">
        <Bookmark size={28} className="mx-auto" />
        <h2>Your next favourite is out there.</h2>
        <p>
          Tap the bookmark on any look to keep it here. Your collection stays in
          this browser.
        </p>
        <Link className="button" href="/ai-prompts">
          Find a look you love <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <section className={mode === "recent" ? "section" : "saved-section"}>
      {mode === "saved" && <h2 className="sr-only">Your saved looks</h2>}
      {mode === "recent" && (
        <div className="section-head">
          <div>
            <h2>A little more exploring?</h2>
            <p>Pick up where you left off.</p>
          </div>
        </div>
      )}
      <PromptGrid
        prompts={selected.slice(0, mode === "recent" ? 4 : undefined)}
      />
    </section>
  );
}
