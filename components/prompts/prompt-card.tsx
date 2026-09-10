import { Play } from "lucide-react";
import type { Prompt } from "@/types/content";
import { promptPath } from "@/lib/routes";
import { PreviewImage } from "./preview-image";
import { SaveButton } from "./save-button";
import { TrackedLink } from "@/components/ui/tracked-link";
export function PromptCard({
  prompt: p,
  priority = false,
  source,
}: {
  prompt: Prompt;
  priority?: boolean;
  source?: "related" | "search";
}) {
  return (
    <article className="prompt-card">
      <div className="card-image">
        <TrackedLink
          href={promptPath(p)}
          source={source}
          id={p.id}
          tabIndex={-1}
          aria-hidden="true"
        >
          <PreviewImage
            src={p.thumbnail_url}
            alt={p.image_alt}
            priority={priority}
          />
        </TrackedLink>
        <SaveButton id={p.id} title={p.title} />
        {p.prompt_type === "reel" && (
          <span className="reel-badge">
            <Play size={12} fill="currentColor" /> Reel idea
          </span>
        )}
      </div>
      <div className="card-meta">{p.style.slice(0, 2).join(" · ")}</div>
      <h3>
        <TrackedLink href={promptPath(p)} source={source} id={p.id}>
          {p.title}
        </TrackedLink>
      </h3>
    </article>
  );
}
