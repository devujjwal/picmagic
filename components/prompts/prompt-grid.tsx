import type { Prompt } from "@/types/content";
import { PromptCard } from "./prompt-card";
export function PromptGrid({
  prompts,
  source,
}: {
  prompts: Prompt[];
  source?: "related" | "search";
}) {
  return (
    <div className="prompt-grid">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} source={source} />
      ))}
    </div>
  );
}
