"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/site-link";
import { track, analyticsConsent } from "@/lib/analytics";
import {
  blogEntrySource,
  setBlogAttribution,
} from "@/lib/analytics/blog-attribution";
import { subscribeConsent } from "@/lib/privacy/consent";
import type { Article } from "@/lib/blog/schema";
export function BlogLink({
  slug,
  destination,
  role = "secondary",
  children,
  className,
}: {
  slug: string;
  destination: Article["primary_conversion"];
  role?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={className}
      href={destination.path}
      onClick={() => {
        const props = {
          article_slug: slug,
          destination_path: destination.path,
          destination_type: destination.type,
          cta_role: role,
          cta_location:
            role === "primary" ? ("primary" as const) : ("inline" as const),
          entry_source: blogEntrySource(),
        };
        setBlogAttribution({
          article_slug: slug,
          destination_path: destination.path,
          destination_type: destination.type,
          cta_role: role,
        });
        track(
          destination.type === "prompt"
            ? "blog_prompt_click"
            : "blog_collection_click",
          props,
        );
        track("blog_cta_click", props);
      }}
    >
      {children}
    </Link>
  );
}
export function BlogTracking({ slug }: { slug: string }) {
  const seen = useRef(new Set<number>());
  const viewed = useRef(false);
  const lastSlug = useRef(slug);
  useEffect(() => {
    if (lastSlug.current !== slug) {
      viewed.current = false;
      seen.current.clear();
      lastSlug.current = slug;
    }
    const view = () => {
      if (analyticsConsent() && !viewed.current) {
        track("blog_view", {
          article_slug: slug,
          entry_source: blogEntrySource(),
        });
        viewed.current = true;
      }
    };
    const scroll = () => {
      if (!analyticsConsent()) return;
      const el = document.querySelector<HTMLElement>("[data-blog-body]");
      if (!el) return;
      const top = window.scrollY + el.getBoundingClientRect().top;
      const progress = Math.min(
        100,
        Math.max(
          0,
          ((window.scrollY + window.innerHeight - top) / el.offsetHeight) * 100,
        ),
      );
      for (const percent of [25, 50, 75, 100])
        if (progress >= percent && !seen.current.has(percent)) {
          seen.current.add(percent);
          track("blog_scroll_depth", {
            article_slug: slug,
            scroll_percent: percent,
            entry_source: blogEntrySource(),
          });
        }
    };
    view();
    scroll();
    const unsubscribe = subscribeConsent(() => {
      view();
      scroll();
    });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", scroll);
    };
  }, [slug]);
  return null;
}
export function BlogShare({ slug, title }: { slug: string; title: string }) {
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        className="button secondary small"
        onClick={async () => {
          const url = `https://picmagic.in/blog/${slug}`;
          try {
            if (navigator.share) {
              await navigator.share({ title, url });
              track("blog_share", { article_slug: slug, method: "native" });
              setMessage("Shared.");
            } else {
              await navigator.clipboard.writeText(url);
              track("blog_share", { article_slug: slug, method: "copy_link" });
              setMessage("Link copied.");
            }
          } catch {
            setMessage("Sharing was cancelled or unavailable.");
          }
        }}
      >
        Share guide
      </button>
      <span role="status">{message}</span>
    </div>
  );
}
