"use client";
import { Bookmark } from "lucide-react";
import { useSaved, useNotice } from "@/features/saved/store";
import { track } from "@/lib/analytics";
export function SaveButton({
  id,
  title,
  full = false,
}: {
  id: string;
  title: string;
  full?: boolean;
}) {
  const { ids, toggle } = useSaved();
  const notify = useNotice();
  const saved = ids.includes(id);
  return (
    <button
      className={full ? "button secondary" : "save-button"}
      aria-label={`${saved ? "Unsave" : "Save"} ${title}`}
      aria-pressed={saved}
      onClick={() => {
        toggle(id);
        notify(
          saved ? "Removed from your collection" : "Saved to your collection",
        );
        track(saved ? "prompt_unsave" : "prompt_save", { prompt_id: id });
      }}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
      {full && (saved ? "Saved" : "Save look")}
    </button>
  );
}
