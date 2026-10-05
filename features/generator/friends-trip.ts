import {
  utilityReference,
  preserveReferenceAge,
  utilityExpression,
} from "./reference-policy";
import { z } from "zod";
import { referenceRequired } from "@/lib/prompts/persona";

export const friendsTripInputSchema = z.object({
  friends_count: z.number().int().min(2).max(8),
  place_name: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(
      /^[\p{L}\p{N}][\p{L}\p{N} .'-]*$/u,
      "Use a place name, without instructions or markup",
    )
    .transform((s) => s.toUpperCase()),
  duration: z.number().int().min(10).max(15),
  mood: z.enum(["Nostalgic", "Joyful", "Adventurous", "Reflective"]),
});
export type FriendsTripInput = z.input<typeof friendsTripInputSchema>;
export const friendsTripDefaults: FriendsTripInput = {
  friends_count: 4,
  place_name: "LADAKH",
  duration: 12,
  mood: "Nostalgic",
};
export const FRIENDS_TRIP_TEMPLATE = "cinematic-friends-trip-v1";
const settings: Record<string, string> = {
  LADAKH:
    "believable arid Himalayan ranges, rocky high-altitude terrain, a safe mountain-road shoulder and an open viewpoint under rich but natural blue skies; no invented famous landmarks",
  GOA: "a palm-lined Goan coastal lane opening onto a sandy beach, warm sea breeze and late-afternoon light; no invented famous landmarks",
  MANALI:
    "a believable Himalayan valley around Manali, cedar-lined paths, distant mountain slopes and clear cool daylight; no invented famous landmarks",
  MEGHALAYA:
    "Meghalaya's green rolling hills, low cloud and a safe broad viewpoint away from cliffs; no invented famous landmarks",
  JAIPUR:
    "Jaipur's pink sandstone street architecture and a broad pedestrian courtyard, warm late-afternoon light and restrained local colour; no invented palace access or landmarks",
};
const moodDirections = {
  Nostalgic:
    "Warm, unhurried glances and small shared smiles; a remembered journey rather than a posed advertisement.",
  Joyful:
    "Spontaneous conversation and laughter, relaxed gestures and buoyant pacing without exaggerated acting.",
  Adventurous:
    "Anticipation in the walk and a sense of discovery in the landscape reveal; no unsafe stunts.",
  Reflective:
    "Quiet conversation, a brief thoughtful pause and a spacious final reveal; understated expressions.",
};
export function generateFriendsTrip(input: FriendsTripInput, preview = false) {
  const v = friendsTripInputSchema.parse(input);
  const duration = preview ? 7.5 : v.duration;
  const n = v.friends_count;
  const action = [
    `HOOK: A wide establishing frame at ${v.place_name} opens on exactly ${n} friends grouped at a safe viewpoint. A gentle forward move reveals their independently recognizable faces; keep the group large enough to read, with space above for the landscape.`,
    `PROGRESSION: Cut to the same ${n} friends walking casually along a safe path or road shoulder closed to traffic. Smooth side tracking follows conversation and small smiles. Vary stride and gestures; no synchronized marching. Keep every friend visible without overlaps hiding faces.`,
    `CANDID MEMORY: Cut closer to all ${n} friends sharing a laugh or a natural arm-around-shoulder gesture. Some look at one another rather than the lens. Subtle handheld movement, moderate depth of field keeping all faces readable; do not isolate or drop a friend.`,
    `HERO REVEAL: A slow pull-back reveals the same ${n} friends against the enormous landscape. Wind moves clothing and hair gently and plausibly. Keep all faces identifiable; stop before people become tiny dots. No extreme orbit or camera acceleration.`,
    `PAYOFF: Hold a wide group frame containing all ${n} friends. Fade in only the final location title ${v.place_name}, centred within the middle 70% of frame width and clear of faces and Instagram UI. Hold for most of this final beat, then gently fade text out. No other text, logos or watermark.`,
  ];
  const boundaries = preview
    ? [0, 1.5, 3, 4.5, 6.5, 7.5]
    : [0, 0.2, 0.4, 0.6, 0.85, 1].map((f) => Number((f * duration).toFixed(2)));
  const scenes = action.map((a, i) => ({
    start: boundaries[i],
    end: boundaries[i + 1],
    action: a,
    transition:
      i === 4
        ? "Brief title fade over a steady moving frame; end on a composition compatible with the opening."
        : "Clean continuity cut; no morphing transition.",
  }));
  const text = [
    `Use the uploaded reference photos of exactly ${n} friends as the authoritative identity source for every shot. Create a ${duration}-second, 9:16 vertical image-to-video travel-memory reel at ${v.place_name}.`,
    utilityReference,
    preserveReferenceAge,
    utilityExpression,
    referenceRequired,
    `Maintain exactly ${n} distinct friends independently: no merged or swapped faces, duplicate people, missing friends, extra people or homogenized appearances. The reference people's actual ethnicity and skin tones remain authoritative. Pose, expression, clothing and hairstyle may adapt naturally for continuity; never replace identity.`,
    "CREATIVE DIRECTION:",
    `Setting: ${settings[v.place_name] || `a believable, location-appropriate setting at ${v.place_name}; use verified reference scenery for unfamiliar geography and do not invent famous landmarks`}. Mood: ${v.mood}. ${moodDirections[v.mood]}`,
    ...scenes.map((s) => `${s.start}–${s.end}s: ${s.action} ${s.transition}`),
    "Shoot as live travel-film footage with actual human movement, not a pan or zoom over a still photograph. Use realistic natural daylight, subtle filmic contrast, natural skin texture, physically believable wind and consistent wardrobe between shots. Avoid extreme slow motion, facial identity drift, warped hands or extra limbs, flickering clothes, background morphing, excessive HDR and oversaturated scenery. Use the uploaded group image as the primary image-to-video reference; use additional per-person reference crops only from those same supplied people. If the provider cannot retain the entire group across cuts, create separate reference-conditioned shots and edit them together rather than inventing replacements.",
    "For reliable lettering, render the video without generated text and add the exact final title in the video editor. Deliver muted H.264 MP4, inline playback, with a clean poster and a gentle return to the opening composition. Review every shot for identity, count, anatomy and location before accepting; identity preservation is not guaranteed by third-party tools.",
    "Final cinematic title:",
    v.place_name,
  ].join("\n\n");
  return {
    text,
    scenes,
    duration,
    variables: v,
    hook: action[0],
    progression: `${action[1]} ${action[2]}`,
    payoff: action[4],
  };
}
