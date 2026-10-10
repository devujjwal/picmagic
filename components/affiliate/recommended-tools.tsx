import type {
  ToolRecommendation,
  RecommendationContext,
} from "@/lib/affiliate/schema";
import { AffiliateToolList } from "./tool-list";
export function RecommendedTools({
  tools,
  context,
}: {
  tools: ToolRecommendation[];
  context: RecommendationContext;
}) {
  if (!tools.length) return null;
  const video = ["reel", "video"].includes(context.prompt_type);
  return (
    <section
      className="recommended-tools"
      aria-label={
        video ? "Turn this idea into a video" : "Create this look with AI"
      }
    >
      <h2>
        {video
          ? "Turn this idea into a video"
          : context.prompt_type === "article"
            ? "Tools you can use for AI photos"
            : "Create this look with AI"}
      </h2>
      <p className="fine-print">
        {video
          ? "Create short clips separately for longer reels. Duration, aspect ratios and model access vary; one generation may not produce the full story."
          : "Copy your prompt, open a tool, then paste it and upload your own permitted reference photo there. Appearance and results can vary."}
      </p>
      <AffiliateToolList tools={tools} context={context} />
    </section>
  );
}
