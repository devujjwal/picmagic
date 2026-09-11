"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import {
  friendsTripDefaults,
  generateFriendsTrip,
  type FriendsTripInput,
} from "./friends-trip";
export function FriendsTripCreator({
  initial = friendsTripDefaults,
}: {
  initial?: FriendsTripInput;
}) {
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState("");
  const [feedback, setFeedback] = useState("");
  const change = (patch: Partial<FriendsTripInput>) => {
    setValues((v) => ({ ...v, ...patch }));
    setResult("");
    setFeedback("");
  };
  return (
    <section
      className="section"
      aria-labelledby="friends-trip-heading"
      id="friends-trip-creator"
    >
      <div className="page-heading">
        <h2 id="friends-trip-heading">Cinematic Friends Trip Reel</h2>
        <p>
          Your friends. Your destination. A journey with a beginning, a memory
          and a final location reveal.
        </p>
      </div>
      <p className="notice">
        Upload photos of all your friends in your chosen image-to-video tool
        after copying this prompt. Each person’s reference determines their
        identity. PicMagic does not upload or process your photos here.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setResult(generateFriendsTrip(values).text);
            track("reel_prompt_generate", { generator_type: "reel" });
            setFeedback(
              "Prompt ready. Copy it and attach your own friends’ photos in your video tool.",
            );
          } catch {
            setFeedback(
              "Choose 2–8 friends, a valid place name and a duration from 10–15 seconds.",
            );
          }
        }}
      >
        <div className="form-grid">
          <label className="field">
            Number of friends
            <input
              required
              type="number"
              min="2"
              max="8"
              value={values.friends_count}
              onChange={(e) =>
                change({ friends_count: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            Place name
            <input
              required
              minLength={2}
              maxLength={40}
              value={values.place_name}
              onChange={(e) => change({ place_name: e.target.value })}
            />
          </label>
          <label className="field">
            Full reel duration (seconds)
            <input
              required
              type="number"
              min="10"
              max="15"
              value={values.duration}
              onChange={(e) => change({ duration: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            Mood
            <select
              value={values.mood}
              onChange={(e) =>
                change({ mood: e.target.value as FriendsTripInput["mood"] })
              }
            >
              {["Nostalgic", "Joyful", "Adventurous", "Reflective"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="button" type="submit">
          Create friends trip prompt
        </button>
      </form>
      <p role="status" className="fine-print">
        {feedback}
      </p>
      {result && (
        <div className="prompt-box">
          <h3>Your friends trip prompt</h3>
          <p className="prompt-text">{result}</p>
          <button
            type="button"
            className="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result);
                setFeedback("Prompt copied.");
                track("prompt_copy", { generator_type: "reel" });
              } catch {
                setFeedback(
                  "Copy was blocked. Select the prompt text and copy it manually.",
                );
              }
            }}
          >
            Copy friends trip prompt
          </button>
        </div>
      )}
    </section>
  );
}
