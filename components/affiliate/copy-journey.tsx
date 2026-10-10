"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  ToolRecommendation,
  RecommendationContext,
} from "@/lib/affiliate/schema";
import { AffiliateToolList } from "./tool-list";
type CopyLocation = "upper" | "lower";
const CopyContext = createContext<{
  copiedAt: CopyLocation | null;
  reveal: (at: CopyLocation | null) => void;
  tools: ToolRecommendation[];
  context: RecommendationContext;
} | null>(null);
export function CopyJourney({
  tools,
  context,
  children,
}: {
  tools: ToolRecommendation[];
  context: RecommendationContext;
  children: ReactNode;
}) {
  const [copiedAt, reveal] = useState<CopyLocation | null>(null);
  return (
    <CopyContext.Provider value={{ copiedAt, reveal, tools, context }}>
      {children}
    </CopyContext.Provider>
  );
}
export function useCopiedToolChooser() {
  return useContext(CopyContext)?.reveal;
}
export function PromptCopyChooser({ at }: { at: CopyLocation }) {
  const journey = useContext(CopyContext);
  if (!journey || journey.copiedAt !== at || !journey.tools.length) return null;
  const video = ["reel", "video"].includes(journey.context.prompt_type);
  return (
    <section
      className="copy-tool-chooser"
      aria-label="Choose an AI tool after copying"
    >
      <div className="affiliate-tool-title">
        <h2>
          {video
            ? "Ready to create your video?"
            : "Ready to create your image?"}
        </h2>
        <button
          className="chip"
          type="button"
          onClick={() => journey.reveal(null)}
        >
          Dismiss tool choices
        </button>
      </div>
      <p className="fine-print" role="status">
        Prompt copied. Choose where to use it, then paste it and upload your own
        reference there. Nothing is transferred automatically.
      </p>
      <AffiliateToolList
        compact
        tools={journey.tools}
        context={{
          ...journey.context,
          placement: video ? "reel_copy" : "photo_copy",
        }}
      />
    </section>
  );
}
