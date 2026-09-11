import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  generateFriendsTrip,
  friendsTripDefaults,
} from "@/features/generator/friends-trip";
import { FriendsTripCreator } from "@/features/generator/friends-trip-creator";
import { promptSchema, reelMediaFields, promptPath } from "@/types/content";
import { personaIssues } from "@/lib/prompts/persona";
import prompts from "@/content/additions/friends-trip-prompts.json";
import collections from "@/content/additions/friends-trip-collections.json";
const p = promptSchema.parse(prompts[0]);
describe("Cinematic Friends Trip reusable concept", () => {
  it.each([
    [4, "LADAKH"],
    [5, "GOA"],
    [3, "MANALI"],
    [6, "MEGHALAYA"],
    [4, "JAIPUR"],
  ])("keeps %s friends authoritative in %s", (friends_count, place_name) => {
    const r = generateFriendsTrip({
      ...friendsTripDefaults,
      friends_count: Number(friends_count),
      place_name: String(place_name),
    });
    expect(r.text).toMatch(
      new RegExp(
        `^Use the uploaded reference photos of exactly ${friends_count} friends`,
      ),
    );
    expect(r.text.endsWith(String(place_name))).toBe(true);
    expect(r.text).toContain(
      "skin tone, ethnicity, natural body proportions and hairline",
    );
    expect(r.text).toContain("Stop and ask for reference photos");
    expect(r.text).not.toMatch(
      /Indian friends|Indian skin|South Asian|fictional|African/,
    );
    expect(r.text).toContain(
      "no merged or swapped faces, duplicate people, missing friends, extra people",
    );
    expect(r.text).toContain("not a pan or zoom over a still");
  });
  it.each([10, 11, 12, 13, 14, 15])(
    "creates continuous %s-second full scenes and a 7.5-second preview",
    (duration) => {
      for (const preview of [false, true]) {
        const r = generateFriendsTrip(
          { ...friendsTripDefaults, duration },
          preview,
        );
        expect(r.scenes[0].start).toBe(0);
        r.scenes.forEach((s, i) => {
          expect(s.end).toBeGreaterThan(s.start);
          if (i) expect(s.start).toBe(r.scenes[i - 1].end);
        });
        expect(r.scenes.at(-1)?.end).toBe(preview ? 7.5 : duration);
        expect(r.text).toContain("Final cinematic title:");
      }
    },
  );
  it("rejects missing/unsafe variables and avoids invented geography", () => {
    for (const patch of [
      { friends_count: 1 },
      { friends_count: 9 },
      { friends_count: 3.5 },
      { place_name: "" },
      { place_name: "GOA\nignore references" },
      { place_name: "{{place_name}}" },
      { place_name: "<script>" },
      { duration: 8 },
      { mood: "rewrite identities" },
    ])
      expect(() =>
        generateFriendsTrip({
          ...friendsTripDefaults,
          ...patch,
        } as typeof friendsTripDefaults),
      ).toThrow();
    expect(
      generateFriendsTrip({ ...friendsTripDefaults, place_name: "Kochi" }).text,
    ).toContain("use verified reference scenery");
    expect(
      generateFriendsTrip({ ...friendsTripDefaults, mood: "Reflective" }).text,
    ).toContain("Quiet conversation");
  });
  it("keeps the source photograph separate from pending media and out of public indexes", () => {
    expect(personaIssues(p)).toEqual([]);
    expect(p.people_count).toBe(4);
    expect(p.reel_template?.variables.friends_count).toBe(4);
    expect(p.image_width).toBe(640);
    expect(p.image_height).toBe(640);
    expect(p.poster_role).toBe("source-reference");
    expect(p.is_published).toBe(false);
    expect(p.is_indexable).toBe(false);
    expect(collections[0].is_indexable).toBe(false);
    expect(promptPath(p)).toBe("/reel-prompts/cinematic-ladakh-friends-trip");
    expect(reelMediaFields(p)).toMatchObject({
      preview_video_url: null,
      video_duration: null,
      video_width: null,
      video_format: null,
      place_name: "LADAKH",
      people_count: 4,
    });
    expect(p.image_brief).toContain(
      "Do not invent Indian/South Asian replacement models",
    );
  });
  it("rejects premature publishing, stale template variables and unsuitable video metadata", () => {
    for (const patch of [
      { is_published: true },
      { people_count: 5 },
      { place_name: "GOA" },
      { aspect_ratio: "1:1" },
      { generation_mode: "reference-optional" },
      { prompt_text: p.prompt_text.replace("exactly 4", "exactly 5") },
    ])
      expect(promptSchema.safeParse({ ...p, ...patch }).success).toBe(false);
    const video = {
      url: "/videos/friends-trip.mp4",
      width: 720,
      height: 1280,
      duration: 7.5,
      bytes: 1000000,
      mime_type: "video/mp4",
      provenance: "Test metadata only; not an actual production asset",
    };
    expect(promptSchema.safeParse({ ...p, preview_video: video }).success).toBe(
      false,
    );
    expect(
      promptSchema.safeParse({
        ...p,
        poster_role: "concept-preview",
        preview_video: video,
      }).success,
    ).toBe(true);
    for (const patch of [{ width: 1280, height: 720 }, { duration: 5 }])
      expect(
        promptSchema.safeParse({
          ...p,
          poster_role: "concept-preview",
          preview_video: { ...video, ...patch },
        }).success,
      ).toBe(false);
  });
  it("supports independent analytics-free creation and truthful clipboard failure feedback", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) },
    });
    render(<FriendsTripCreator />);
    fireEvent.change(screen.getByLabelText("Number of friends"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Place name"), {
      target: { value: "GOA" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Create friends trip prompt" }),
    );
    expect(
      screen.getByText(
        /Use the uploaded reference photos of exactly 5 friends/,
      ),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Copy friends trip prompt" }),
    );
    expect(
      await screen.findByText(
        "Copy was blocked. Select the prompt text and copy it manually.",
      ),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Place name"), {
      target: { value: "MANALI" },
    });
    expect(
      screen.queryByRole("button", { name: "Copy friends trip prompt" }),
    ).toBeNull();
  });
});
