"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { searchPrompts } from "@/lib/prompts/discovery";
import type { Prompt } from "@/types/content";
import { promptPath } from "@/lib/routes";
import { track } from "@/lib/analytics";
export function Search({
  prompts,
  initialQuery = "",
}: {
  prompts: Prompt[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const results = useMemo(
    () => searchPrompts(prompts, query),
    [prompts, query],
  );
  const suggestions = useMemo(
    () => (input.trim() ? searchPrompts(prompts, input).slice(0, 5) : []),
    [prompts, input],
  );
  useEffect(() => {
    if (query)
      track("search", {
        query_length: query.length,
        result_count: results.length,
      });
  }, [query, results.length]);
  return (
    <>
      <form
        className="search-box"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(input.trim());
          setFocused(false);
          router.replace(
            `/search${input.trim() ? `?q=${encodeURIComponent(input.trim())}` : ""}`,
            { scroll: false },
          );
        }}
      >
        <label className="sr-only" htmlFor="idea-search">
          Search photo ideas
        </label>
        <input
          id="idea-search"
          type="search"
          name="q"
          value={input}
          maxLength={120}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder="Try ‘saree’, ‘couple rain’, ‘birthday kid’…"
          autoComplete="off"
        />
        <button className="icon-button" type="submit" aria-label="Search">
          <SearchIcon size={20} />
        </button>
        {focused && suggestions.length > 0 && (
          <div className="suggestions" aria-label="Suggested looks">
            {suggestions.map((p) => (
              <Link
                key={p.id}
                href={promptPath(p)}
                onClick={() =>
                  track("search_result_click", { prompt_id: p.id })
                }
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}
      </form>
      {!query && (
        <div className="collection-links justify-center">
          {[
            "Saree",
            "Couple rain",
            "Birthday kid",
            "LinkedIn",
            "Cinematic",
            "Diwali family",
          ].map((t) => (
            <button
              className="chip"
              key={t}
              onClick={() => {
                setInput(t);
                setQuery(t);
                router.replace(`/search?q=${encodeURIComponent(t)}`, {
                  scroll: false,
                });
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <p className="result-count">
        {query
          ? `${results.length} looks for “${query}”`
          : "A few ideas to get you started"}
      </p>
      {results.length ? (
        <>
          <h2 className="sr-only">Search results</h2>
          <PromptGrid prompts={results.slice(0, 48)} source="search" />
        </>
      ) : (
        <div className="empty-state">
          <h2>A different word might do the magic.</h2>
          <p>
            Try a subject, outfit, occasion or mood. “Couple”, “saree” and
            “cinematic” are good places to start.
          </p>
          <Link className="button" href="/create">
            Create your own look
          </Link>
        </div>
      )}
    </>
  );
}
