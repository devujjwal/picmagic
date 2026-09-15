import socialReview from "../../docs/audits/social-posts-profiles-2026-09-15/media/content-review.json";
import genZReview from "../../docs/audits/gen-z-discovery-2026-09-15/media/content-review.json";
import releaseReview from "../../docs/releases/2026-09-11/content-review.json";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { allPrompts, allCollections } from "@/content/catalog";
import { promptSchema } from "@/types/content";
import {
  homepageHighlights,
  editorialIssues,
  isHomepageEligible,
  orderForDiscovery,
  EDITORIAL_VERSION,
} from "@/lib/prompts/editorial";
import audit from "../../docs/audits/library-2026-09/editorial-audit.json";
import queue from "../../docs/audits/library-2026-09/approved-image-manifest.json";
import videos from "../../docs/audits/library-2026-09/approved-video-manifest.json";
import baseline from "../../docs/audits/library-2026-09/editorial-baseline.json";
import { TemplatePromptProvider } from "@/features/generator/provider";
import { PaginatedGrid } from "@/components/prompts/paginated-grid";

import friendsQueue from "../../docs/audits/friends-trip-2026-09/image-manifest.json";
const prompts = allPrompts.map((p) => promptSchema.parse(p));
describe("Why AI editorial release", () => {
  it("accounts for every original and expanded record without silently dropping concepts", () => {
    expect(audit.reviewed).toBe(
      baseline["content/prompts.json"].length +
        baseline["content/expansion/prompts.json"].length,
    );
    expect(new Set(audit.records.map((r) => r.id)).size).toBe(audit.reviewed);
    expect(audit.records.filter((r) => r.decision === "merged")).toHaveLength(
      2,
    );
    for (const p of prompts) {
      const review = [
        ...releaseReview.records,
        ...socialReview.records,
        ...genZReview.records,
      ].find((r) => r.id === p.id)!;
      expect(review, p.slug).toBeTruthy();
      expect(
        createHash("sha256").update(p.prompt_text).digest("hex"),
        p.slug,
      ).toBe(review.sha256);
      expect(editorialIssues(p), p.slug).toEqual([]);
    }
  });
  it("retains all existing canonical paths and merges only never-production duplicates", () => {
    for (const old of baseline["content/prompts.json"]) {
      const p = prompts.find((p) => p.id === old.id)!;
      expect([p.slug, p.category_id, p.prompt_type]).toEqual([
        old.slug,
        old.category_id,
        old.prompt_type,
      ]);
    }
    for (const old of audit.records.filter((r) => r.decision === "merged"))
      expect(prompts.some((p) => p.id === old.id)).toBe(false);
    for (const c of allCollections)
      expect(c.prompt_ids.every((id) => prompts.some((p) => p.id === id))).toBe(
        true,
      );
  });
  it("avoids filling the first screen with only one audience", () => {
    const highlights = homepageHighlights(prompts, 4);
    expect(new Set(highlights.map((p) => p.category_id)).size).toBe(4);
    expect(highlights.every(isHomepageEligible)).toBe(true);
  });
  it("never features utility, an unreviewed concept, a low score or an unapproved preview", () => {
    const p = prompts.find(isHomepageEligible)!;
    expect(p).toBeTruthy();
    for (const patch of [
      { content_intent: "utility" as const },
      { distinctiveness_score: 2 },
      { editorial_review_version: null },
      { preview_review_status: "replacement-required" as const },
      { is_published: false },
    ])
      expect(isHomepageEligible({ ...p, ...patch })).toBe(false);
    expect(
      editorialIssues({ ...p, why_ai: "cinematic premium 8K" }),
    ).not.toEqual([]);
    expect(
      editorialIssues({ ...p, content_intent: "utility", is_featured: true }),
    ).not.toEqual([]);
  });
  it("leads collections with their strongest creative concepts and ranks utility separately", () => {
    for (const c of allCollections) {
      const ordered = orderForDiscovery(
        prompts.filter((p) => c.prompt_ids.includes(p.id)),
      );
      expect(c.prompt_ids, c.slug).toEqual(ordered.map((p) => p.id));
    }
    const mixed = orderForDiscovery(prompts);
    const firstUtility = mixed.findIndex((p) => p.content_intent === "utility");
    expect(
      mixed.slice(firstUtility).every((p) => p.content_intent === "utility"),
    ).toBe(true);
  });
  it("gives every reel specific timed hook, progression and payoff, without changing duration totals", () => {
    for (const p of prompts.filter((p) => p.reel)) {
      const r = p.reel!;
      for (const field of [r.hook, r.progression, r.payoff])
        expect(field?.length, p.slug).toBeGreaterThan(15);
      expect(r.scenes[0].start).toBe(0);
      expect(r.scenes.at(-1)?.end).toBe(r.duration);
      expect(
        r.scenes.reduce((sum, s, i) => {
          if (i) expect(s.start).toBe(r.scenes[i - 1].end);
          return sum + s.end - s.start;
        }, 0),
      ).toBe(r.duration);
      expect(new Set([r.hook, r.progression, r.payoff]).size).toBe(3);
    }
  });
  it("queues only approved concepts and refuses to publish missing or stale media", () => {
    const covered = new Set(
      [...queue, ...friendsQueue].flatMap((j) => j.used_by),
    );
    for (const p of prompts) {
      if (p.preview_review_status !== "approved") {
        expect(p.is_published, p.slug).toBe(false);
        expect(covered.has(p.slug), p.slug).toBe(true);
      } else
        expect(fs.existsSync(`public${p.preview_image_url}`), p.slug).toBe(
          true,
        );
    }
    for (const j of queue) {
      expect(j.editorial_review_version).toBe(EDITORIAL_VERSION);
      expect(j.used_by.length).toBeGreaterThan(0);
      for (const slug of j.used_by)
        expect(prompts.some((p) => p.slug === slug)).toBe(true);
    }
    for (const j of videos) {
      const p = prompts.find((p) => p.slug === j.slug)!;
      expect(p.content_intent).toBe("creative");
      expect(p.distinctiveness_score).toBeGreaterThanOrEqual(4);
      expect(j.exact_generation_prompt.length).toBeGreaterThan(60); // Historical queue is frozen, not an active generation approval.
    }
  });
  it("renders an explicit utility section instead of mixing catalogue prompts into creative inspiration", () => {
    const utility = prompts.find(
      (p) => p.content_intent === "utility" && p.is_published,
    )!;
    const creative = prompts.find(isHomepageEligible)!;
    render(
      <PaginatedGrid
        prompts={[creative, utility]}
        page={1}
        path="/ai-prompts"
      />,
    );
    const section = screen.getByRole("region", {
      name: "Practical utility prompts",
    });
    expect(section).toHaveTextContent(utility.title);
    expect(section).not.toHaveTextContent(creative.title);
  });
  it.each([5, 10, 15, 30] as const)(
    "guided %s-second utility reels still have a hook, action and payoff",
    (duration) => {
      const result = new TemplatePromptProvider().generateReelPrompt({
        subject: "Couple",
        style: "Natural",
        background: "Garden",
        outfit: "Everyday casual",
        lighting: "Natural Daylight",
        framing: "Full Body",
        aspect_ratio: "9:16",
        duration,
      });
      expect(result.text).toContain("HOOK:");
      expect(result.text).toContain("PROGRESSION:");
      expect(result.text).toContain("PAYOFF:");
      expect(result.scenes?.at(-1)?.end).toBe(duration);
    },
  );
});
