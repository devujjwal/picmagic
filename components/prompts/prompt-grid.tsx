import type { Prompt } from "@/types/content";
import { PromptCard } from "./prompt-card";
export function PromptGrid({
  prompts,
  source,
  prioritizeFirst = false,
}: {
  prompts: Prompt[];
  source?: "related" | "search";
  prioritizeFirst?: boolean;
}) {
  return (
    <div className="prompt-grid">
      {prompts.map((p, index) => (
        <PromptCard
          key={p.id}
          prompt={p}
          source={source}
          priority={prioritizeFirst && index < 2}
        />
      ))}
    </div>
  );
}
