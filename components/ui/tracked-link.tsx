"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";
export function TrackedLink({
  source,
  id,
  ...props
}: React.ComponentProps<typeof Link> & {
  source?: "related" | "search";
  id: string;
}) {
  return (
    <Link
      {...props}
      onClick={() => {
        if (source)
          track(
            source === "related"
              ? "related_prompt_click"
              : "search_result_click",
            { prompt_id: id },
          );
      }}
    />
  );
}
