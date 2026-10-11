"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { analyticsConsent } from "@/lib/analytics";
import { subscribeConsent } from "@/lib/privacy/consent";
import { trackAffiliate } from "@/lib/affiliate/tracking";
import type {
  ToolRecommendation,
  RecommendationContext,
} from "@/lib/affiliate/schema";
import { AffiliateDisclosure } from "./disclosure";

export function AffiliateToolCard({
  tool,
  context,
  compact = false,
}: {
  tool: ToolRecommendation;
  context: RecommendationContext;
  compact?: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const recorded = useRef(false);
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      if (
        recorded.current ||
        !analyticsConsent() ||
        !ref.current ||
        typeof IntersectionObserver === "undefined"
      )
        return;
      observer = new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (e) => e.isIntersecting && e.intersectionRatio >= 0.5,
            ) &&
            analyticsConsent()
          ) {
            recorded.current = trackAffiliate(
              "affiliate_tool_impression",
              tool,
              context,
            );
            if (recorded.current) observer?.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(ref.current);
    };
    observe();
    const unsubscribe = subscribeConsent(observe);
    return () => {
      observer?.disconnect();
      unsubscribe();
    };
  }, [tool, context]);
  const clicked = () => {
    trackAffiliate("affiliate_tool_click", tool, context);
    trackAffiliate("affiliate_outbound_click", tool, context);
  };
  return (
    <li
      ref={ref}
      className={`affiliate-tool-card${compact ? " compact" : ""}`}
      data-provider={tool.id}
    >
      <div className="affiliate-tool-title">
        <h3>{tool.name}</h3>
        {tool.affiliate_enabled && (
          <span className="fine-print">Affiliate link</span>
        )}
      </div>
      {!compact && <p>{tool.description}</p>}
      <p className="affiliate-access">
        {compact ? tool.access_label : tool.access_note}
      </p>
      <a
        className="text-link"
        href={tool.href}
        target="_blank"
        rel={
          tool.affiliate_enabled
            ? "sponsored noopener noreferrer"
            : "noopener noreferrer"
        }
        aria-label={`Open ${tool.name} (new tab)`}
        onClick={clicked}
        onAuxClick={(event) => {
          if (event.button === 1) clicked();
        }}
      >
        Open {tool.name} <ArrowUpRight size={15} />
        <span className="fine-print">new tab</span>
      </a>
    </li>
  );
}
export function AffiliateToolList({
  tools,
  context,
  compact = false,
}: {
  tools: ToolRecommendation[];
  context: RecommendationContext;
  compact?: boolean;
}) {
  return (
    <>
      <ul className="affiliate-tool-list">
        {tools.map((tool) => (
          <AffiliateToolCard
            key={tool.id}
            tool={tool}
            context={context}
            compact={compact}
          />
        ))}
      </ul>
      <AffiliateDisclosure monetized={tools.some((t) => t.affiliate_enabled)} />
    </>
  );
}
