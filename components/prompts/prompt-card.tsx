import { Play, Clapperboard } from "lucide-react";
import { type PromptCardData, toPromptCard } from "@/lib/prompts/card-data";
import { promptPath } from "@/lib/routes";
import { PreviewMedia } from "./preview-media";
import { SaveButton } from "./save-button";
import { TrackedLink } from "@/components/ui/tracked-link";
export function PromptCard({
  prompt: p,
  priority = false,
  source,
}: {
  prompt: PromptCardData;
  priority?: boolean;
  source?: "related" | "search";
}) {
  return (
    <article
      className={`prompt-card${p.display_hint === "wide" ? " prompt-card-wide" : ""}`}
    >
      <div
        className="card-image"
        style={{ aspectRatio: `${p.image_width} / ${p.image_height}` }}
      >
        <PreviewMedia
          prompt={toPromptCard(p)}
          priority={priority}
          href={promptPath(p)}
          source={source}
        />
        <SaveButton id={p.id} title={p.title} />
        {(p.prompt_type === "reel" || p.prompt_type === "video") && (
          <span className="reel-badge">
            {p.preview_video ? (
              <Play size={12} fill="currentColor" />
            ) : (
              <Clapperboard size={12} />
            )}{" "}
            {p.preview_video ? "Video preview" : "Reel concept · Still"}
          </span>
        )}
      </div>
      <div className="card-meta">
        {p.content_intent === "utility" ? "Practical utility · " : ""}
        {p.style.slice(0, 2).join(" · ")}
      </div>
      <h3>
        <TrackedLink href={promptPath(p)} source={source} id={p.id}>
          {p.title}
        </TrackedLink>
      </h3>
    </article>
  );
}
