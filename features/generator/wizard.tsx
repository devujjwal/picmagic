"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import {
  subjects,
  styles,
  backgrounds,
  outfits,
  lightings,
  framings,
  ratios,
  enhanceOptions,
  promptProvider,
  type GeneratorInput,
  type GeneratedPrompt,
  type Improvement,
} from "./provider";
import { CopyButton } from "@/components/share/detail-actions";
import { track } from "@/lib/analytics";
type Mode = "photo" | "edit" | "reel";
type Step = {
  key: keyof GeneratorInput;
  title: string;
  description: string;
  options: readonly (string | number)[];
};
const initial: GeneratorInput = {
  subject: "Woman",
  style: "Natural",
  background: "Garden",
  outfit: "Keep original outfit",
  lighting: "Golden Hour",
  framing: "Half Body",
  aspect_ratio: "4:5",
  identity: false,
  age_group: "Keep original age",
  improvement: "Professional Portrait",
  duration: 15,
  mood: "Cinematic",
  platform: "Instagram Reels",
  variant: 0,
};
export function Wizard({ mode = "photo" }: { mode?: Mode }) {
  const [input, setInput] = useState<GeneratorInput>({
    ...initial,
    identity: mode === "edit",
    aspect_ratio: mode === "reel" ? "9:16" : "4:5",
  });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const photoSteps: Step[] = [
    {
      key: "subject",
      title: "Who’s in your photo?",
      description:
        "Start with the person—or product—at the heart of your idea.",
      options: subjects,
    },
    {
      key: "style",
      title: "What’s the feeling?",
      description: "Choose the visual direction that catches your imagination.",
      options:
        input.subject === "Product"
          ? ["Minimal", "Studio", "Luxury", "Natural", "Retro"]
          : input.subject === "Kid"
            ? ["Natural", "Traditional Indian", "Studio", "Fantasy", "Retro"]
            : styles,
    },
    {
      key: "background",
      title: "Set the scene.",
      description: "A new backdrop can tell a whole new story.",
      options: backgrounds,
    },
    {
      key: "outfit",
      title:
        input.subject === "Product"
          ? "Keep the product true to itself."
          : "Find the right outfit.",
      description:
        input.subject === "Product"
          ? "The prompt preserves product geometry, materials and labels."
          : "Keep what you’re wearing or explore something different.",
      options:
        input.subject === "Product"
          ? ["No clothing / product styling"]
          : input.subject === "Kid"
            ? [
                "Keep original outfit",
                "Everyday casual",
                "Comfortable party outfit",
              ]
            : outfits.filter((x) => x !== "No clothing / product styling"),
    },
    {
      key: "lighting",
      title: "A little light changes everything.",
      description: "Choose how the scene should feel.",
      options: lightings,
    },
    {
      key: "framing",
      title: "Find your frame.",
      description: "Get close to the details or leave room for the story.",
      options: framings,
    },
    {
      key: "aspect_ratio",
      title: "One last detail: the shape.",
      description:
        "4:5 is a great starting point for portrait posts. Try 9:16 for stories.",
      options: ratios,
    },
  ];
  const editSteps: Step[] = [
    {
      key: "improvement",
      title: "What would you like to improve?",
      description:
        "Choose one main change. We’ll keep the rest of the photo feeling natural.",
      options: enhanceOptions,
    },
    photoSteps[0],
    photoSteps[1],
    photoSteps[2],
    ...(input.improvement === "Change Outfit" ? [photoSteps[3]] : []),
    photoSteps[4],
    photoSteps[5],
  ];
  const reelSteps: Step[] = [
    photoSteps[0],
    {
      key: "duration",
      title: "How long is your story?",
      description: "We’ll shape the scenes to fit.",
      options: [5, 10, 15, 30],
    },
    photoSteps[1],
    {
      key: "mood",
      title: "What should people feel?",
      description: "A mood to guide movement, transitions and music.",
      options: [
        "Cinematic",
        "Romantic",
        "Emotional",
        "Viral",
        "Luxury",
        "Funny",
        "Dramatic",
        "Minimal",
        "Fashion",
      ],
    },
    {
      key: "platform",
      title: "Where will your reel live?",
      description: "Start with the platform you create for.",
      options: ["Instagram Reels", "YouTube Shorts", "TikTok", "Other"],
    },
    photoSteps[2],
    photoSteps[4],
  ];
  const steps =
    mode === "reel" ? reelSteps : mode === "edit" ? editSteps : photoSteps;
  const current = steps[Math.min(step, steps.length - 1)];
  function update(key: keyof GeneratorInput, value: string | number) {
    setInput((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "subject") {
        next.outfit =
          value === "Product"
            ? "No clothing / product styling"
            : "Keep original outfit";
        next.style = "Natural";
        next.age_group = "Keep original age";
        if (value === "Product") next.identity = false;
      }
      if (key === "improvement" && String(value).startsWith("Product")) {
        next.subject = "Product";
        next.outfit = "No clothing / product styling";
      }
      if (key === "improvement" && value === "Couple Makeover")
        next.subject = "Couple";
      return next as GeneratorInput;
    });
  }
  function generate(regenerate = false) {
    try {
      const next = {
        ...input,
        variant: regenerate ? ((input.variant || 0) + 1) % 1000 : input.variant,
      };
      const output =
        mode === "reel"
          ? promptProvider.generateReelPrompt(next)
          : mode === "edit"
            ? promptProvider.generatePhotoEditPrompt(next)
            : promptProvider.generatePhotoPrompt(next);
      setInput(next);
      setResult(output);
      setError("");
      track(
        regenerate
          ? "prompt_regenerate"
          : mode === "reel"
            ? "reel_prompt_generate"
            : mode === "edit"
              ? "photo_edit_prompt_generate"
              : "prompt_generate",
        { generator_type: mode },
      );
      setTimeout(() => heading.current?.focus(), 0);
    } catch {
      setError("Please check your selections and try again.");
    }
  }
  function move(next: number) {
    setStep(next);
    setTimeout(() => heading.current?.focus(), 0);
  }
  function improve(kind: Improvement) {
    if (result) setResult(promptProvider.improvePrompt(result, kind));
  }
  return (
    <div className="wizard">
      {result ? (
        <div className="wizard-result">
          <div className="eyebrow">
            <Sparkles size={14} /> Your idea, ready to create
          </div>
          <h2 ref={heading} tabIndex={-1}>
            {mode === "reel"
              ? "Your next little story."
              : "Here’s your magic prompt."}
          </h2>
          <p>
            Copy this into your preferred AI tool. Upload your photo there if
            you want to use it as a reference.
          </p>
          <div className="prompt-box">
            <p className="prompt-text">{result.text}</p>
          </div>
          <div className="action-row">
            <CopyButton text={result.text} />
            <button className="button secondary" onClick={() => generate(true)}>
              <RotateCcw size={16} />
              Regenerate
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setResult(null);
                move(0);
              }}
            >
              Edit choices
            </button>
          </div>
          <div className="collection-links mt-5">
            <button className="chip" onClick={() => improve("cinematic")}>
              Make more cinematic
            </button>
            <button className="chip" onClick={() => improve("realistic")}>
              Make more realistic
            </button>
            <button className="chip" onClick={() => improve("shorten")}>
              Shorten prompt
            </button>
          </div>
          {result.scenes && (
            <>
              <div className="reel-scenes">
                {result.scenes.map((s, i) => (
                  <div className="reel-scene" key={i}>
                    <h3>
                      Scene {i + 1} · {s.start}–{s.end}s
                    </h3>
                    <p>{s.action}</p>
                    <p>
                      {s.camera} · {s.environment} · {s.lighting}
                    </p>
                    <p>Transition: {s.transition}</p>
                  </div>
                ))}
              </div>
              <div className="prompt-box">
                <h3 className="mb-3">Ready for the caption</h3>
                <p>{result.caption}</p>
                <p className="mt-3">{result.hashtags?.join(" ")}</p>
                <p className="mt-3">Music mood: {result.music}</p>
              </div>
            </>
          )}
          <p className="notice">
            AI tools interpret prompts differently. Identity preservation is an
            instruction, not a guarantee. PicMagic does not upload or process
            your photos.
          </p>
        </div>
      ) : (
        <>
          <div
            className="wizard-progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step + 1}
            aria-label={`Step ${step + 1} of ${steps.length}`}
          >
            {steps.map((s, i) => (
              <span key={s.key} className={i <= step ? "complete" : ""} />
            ))}
          </div>
          <div className="wizard-panel">
            <div className="eyebrow">
              Step {step + 1} of {steps.length}
            </div>
            <h2 ref={heading} tabIndex={-1}>
              {current.title}
            </h2>
            <p>{current.description}</p>
            <div
              className="option-grid"
              role="group"
              aria-label={current.title}
            >
              {current.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  aria-pressed={input[current.key] === option}
                  className={`option ${input[current.key] === option ? "selected" : ""}`}
                  onClick={() => update(current.key, option)}
                >
                  {option}
                  {current.key === "duration" ? " seconds" : ""}
                </button>
              ))}
            </div>
            {step === steps.length - 1 &&
              mode !== "edit" &&
              !["Product", "Kid", "Family"].includes(input.subject) && (
                <label className="field">
                  Age intent
                  <select
                    aria-label="Age intent"
                    value={input.age_group}
                    onChange={(event) =>
                      update("age_group", event.target.value)
                    }
                  >
                    <option value="Keep original age">Keep original age</option>
                    <option value="Adult">
                      Creative adult age: approximately 22–30
                    </option>
                    <option value="Older adult">
                      Creative older adult age: approximately 60–75
                    </option>
                  </select>
                  <span className="fine-print">
                    Creative age choices deliberately change adult age cues
                    while retaining identity. Keep original age preserves the
                    reference; children and teenagers cannot be transformed into
                    adults.
                  </span>
                </label>
              )}
            {step === steps.length - 1 && input.subject !== "Product" && (
              <p className="notice">
                Your reference photo determines identity. Without a reference,
                the prompt uses an Indian/South Asian example. Age is preserved
                by default. An explicitly selected creative age changes adult
                age cues. Scoped edits preserve source age. Styling can change
                while recognizable features remain yours; third-party tools may
                still drift.
              </p>
            )}
            <div className="wizard-buttons">
              <button
                className="button secondary"
                disabled={step === 0}
                onClick={() => move(step - 1)}
              >
                <ArrowLeft size={15} />
                Back
              </button>
              {step === steps.length - 1 ? (
                <button className="button" onClick={() => generate()}>
                  <Sparkles size={16} />
                  Generate prompt
                </button>
              ) : (
                <button className="button" onClick={() => move(step + 1)}>
                  Continue
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
            {error && (
              <p role="alert" className="error-text">
                {error}
              </p>
            )}
          </div>
          <p className="fine-print text-center">
            Always free. No photo upload. No account needed.
          </p>
        </>
      )}
    </div>
  );
}
