"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import type { Prompt, Category } from "@/types/content";
import { savePrompt } from "./actions";
import {
  generateFriendsTrip,
  friendsTripInputSchema,
} from "@/features/generator/friends-trip";
import {
  legacyReferencePersona as referencePersona,
  referenceRequired,
  AUTHORING_PERSONA_POLICY_VERSION,
} from "@/lib/prompts/persona";
import {
  legacyArtReferencePersona as artReferencePersona,
  legacyReviewedReferencePersona as reviewedReferencePersona,
  reviewedProductPersona,
} from "@/lib/prompts/identity-contract";
import { EDITORIAL_VERSION } from "@/lib/prompts/editorial";
import { slugify } from "@/lib/prompts/discovery";
import {
  personaPreamble,
  PERSONA_POLICY_VERSION,
  type PersonaPolicy,
} from "@/lib/prompts/persona";
export function PromptForm({
  initial,
  categories,
}: {
  initial: Prompt;
  categories: Category[];
}) {
  const [p, setP] = useState(initial);
  const [state, action, pending] = useActionState(savePrompt, {});
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [faqText, setFaqText] = useState(JSON.stringify(p.faqs, null, 2));
  const [reelText, setReelText] = useState(
    p.reel ? JSON.stringify(p.reel, null, 2) : "null",
  );
  const [videoText, setVideoText] = useState(
    JSON.stringify(p.preview_video || null, null, 2),
  );
  const [contractText, setContractText] = useState(
    JSON.stringify(p.reference_contract || null, null, 2),
  );
  const [templateText, setTemplateText] = useState(
    JSON.stringify(p.reel_template || null, null, 2),
  );
  const update = <K extends keyof Prompt>(key: K, value: Prompt[K]) =>
    setP((prev) => ({
      ...prev,
      [key]: value,
      ...([
        "prompt_text",
        "image_brief",
        "title",
        "description",
        "persona_policy",
        "reference_contract",
        "transformation_type",
        "preview_image_url",
        "thumbnail_url",
        "content_intent",
        "distinctiveness_score",
        "why_ai",
        "reel_template",
        "place_name",
        "people_count",
        "generation_mode",
        "poster_role",
      ].includes(key)
        ? {
            editorial_review_version: null,
            preview_review_status: "replacement-required" as const,
          }
        : {}),
    }));
  let payload = { ...p };
  let jsonError = "";
  try {
    payload = {
      ...p,
      faqs: JSON.parse(faqText),
      reel: JSON.parse(reelText),
      preview_video: JSON.parse(videoText),
      reel_template: JSON.parse(templateText),
      reference_contract: JSON.parse(contractText),
    };
  } catch {
    jsonError =
      "FAQs, template, reel details and video metadata must contain valid JSON.";
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setP((prev) => ({
        ...prev,
        ...data,
        preview_review_status: "replacement-required",
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  return (
    <form action={action}>
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />
      <div className="form-grid">
        <label className="field wide">
          Title
          <input
            required
            value={p.title}
            maxLength={160}
            onChange={(e) => {
              update("title", e.target.value);
              if (!initial.title) update("slug", slugify(e.target.value));
            }}
          />
        </label>
        <label className="field">
          URL slug
          <input
            required
            value={p.slug}
            onChange={(e) => update("slug", e.target.value)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
          <small>Published URL changes create a permanent redirect.</small>
        </label>
        <label className="field">
          Category
          <select
            value={p.category_id}
            onChange={(e) => update("category_id", e.target.value)}
          >
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="field wide">
          <legend>Editorial review</legend>
          <label>
            Content purpose
            <select
              value={p.content_intent || ""}
              onChange={(e) =>
                update(
                  "content_intent",
                  e.target.value as "creative" | "utility",
                )
              }
            >
              <option value="">Choose a purpose</option>
              <option value="creative">Creative inspiration</option>
              <option value="utility">Practical utility / catalogue</option>
            </select>
          </label>
          <label>
            Distinctiveness (1–5)
            <input
              type="number"
              min={1}
              max={5}
              value={p.distinctiveness_score || ""}
              onChange={(e) =>
                update("distinctiveness_score", Number(e.target.value))
              }
            />
          </label>
          <label>
            Why use AI for this?
            <textarea
              value={p.why_ai || ""}
              onChange={(e) => update("why_ai", e.target.value)}
              placeholder="Describe the actual visual idea or practical deliverable. Adjectives alone are not a concept."
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={p.editorial_review_version === EDITORIAL_VERSION}
              onChange={(e) =>
                update(
                  "editorial_review_version",
                  e.target.checked ? EDITORIAL_VERSION : null,
                )
              }
            />{" "}
            I reviewed identity, distinctiveness, utility and the reel
            hook/progression/payoff where applicable.
          </label>
          <label>
            <input
              type="checkbox"
              checked={p.preview_review_status === "approved"}
              onChange={(e) =>
                update(
                  "preview_review_status",
                  e.target.checked ? "approved" : "replacement-required",
                )
              }
            />{" "}
            The current preview accurately represents this concept and its
            important details.
          </label>
          <small>
            Scores 1–2 cannot publish. Utility stays separate from featured
            creative discovery. Changing the creative text requires a fresh
            review. Reel JSON needs hook, progression and payoff fields.
          </small>
        </fieldset>
        <label className="field wide">
          Description
          <textarea
            required
            value={p.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <div className="field wide">
          <label htmlFor="persona-policy">
            Reference and no-reference policy
          </label>
          <select
            id="persona-policy"
            value={p.persona_policy || "person"}
            onChange={(e) =>
              update("persona_policy", e.target.value as PersonaPolicy)
            }
          >
            <option value="person">
              Person: reference first, Indian/South Asian default
            </option>
            <option value="person-and-product">
              Person and advertised product
            </option>
            <option value="product">Product fidelity</option>
            <option value="animal">Pet / animal fidelity</option>
          </select>
          <p>
            Keep demographics in the preview brief. Creative direction describes
            styling, not replacement identity. Publishing validates both persona
            modes.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              const policy =
                p.persona_policy ||
                (p.subject === "Product" ? "product" : "person");
              const body = p.prompt_text.includes("CREATIVE DIRECTION:")
                ? p.prompt_text.split("CREATIVE DIRECTION:").at(-1)!.trim()
                : p.prompt_text;
              setP((prev) => ({
                ...prev,
                persona_policy: policy,
                persona_version: AUTHORING_PERSONA_POLICY_VERSION,
                prompt_text:
                  (p.generation_mode === "reference-required"
                    ? referencePersona +
                      "\n\n" +
                      referenceRequired +
                      "\n\nCREATIVE DIRECTION:"
                    : payload.reference_contract
                      ? [
                          (policy === "person" ||
                            policy === "person-and-product") &&
                            (payload.reference_contract.medium ===
                            "artistic-palette"
                              ? artReferencePersona
                              : reviewedReferencePersona),
                          (policy === "person" ||
                            policy === "person-and-product") &&
                            `NO REFERENCE PRESENT: Default to an appropriate fictional Indian/South Asian ${p.subject.toLowerCase()}. Preserve believable diversity.`,
                          (policy === "product" ||
                            policy === "person-and-product") &&
                            reviewedProductPersona,
                          payload.reference_contract.depiction_count > 1 &&
                            `Show the same identity in ${payload.reference_contract.depiction_count} intentional depictions.`,
                          "CREATIVE DIRECTION:",
                        ]
                          .filter(Boolean)
                          .join("\n\n")
                      : personaPreamble(
                          policy,
                          p.subject,
                          p.prompt_type === "photo_edit",
                        )) +
                  "\n\n" +
                  body,
              }));
            }}
          >
            Apply persona instructions
          </button>
        </div>
        <fieldset className="field wide">
          <legend>Creative transformation and reference contract</legend>
          <label>
            Transformation type
            <input
              value={p.transformation_type || ""}
              placeholder="photo-illustration"
              onChange={(e) =>
                update("transformation_type", e.target.value || null)
              }
            />
          </label>
          <label>
            Preview layout
            <select
              value={p.display_hint || "standard"}
              onChange={(e) =>
                update("display_hint", e.target.value as "standard" | "wide")
              }
            >
              <option value="standard">Standard</option>
              <option value="wide">Wide, uncropped composition</option>
            </select>
          </label>
          <label>
            Reference contract JSON
            <textarea
              rows={7}
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                update("editorial_review_version", null);
              }}
            />
          </label>
          <p>
            Use null for conventional photographs. Artistic media declare
            medium: artistic-palette. identity_count is the number of distinct
            people (null means source-derived); depiction_count is appearances
            per person. reference_age is preserve, child-required or
            adult-required. product_views is reference-supported or
            not-applicable. Repeated scenes must explain that the same identity
            appears intentionally.
          </p>
        </fieldset>
        <fieldset className="field wide">
          <legend>Reusable reel template and reference metadata</legend>
          <label>
            Generation mode
            <select
              value={p.generation_mode || "reference-optional"}
              onChange={(e) =>
                update(
                  "generation_mode",
                  e.target.value as Prompt["generation_mode"],
                )
              }
            >
              <option value="reference-optional">
                Reference optional; fictional Indian/South Asian default
              </option>
              <option value="reference-required">
                Reference required; never invent missing people
              </option>
            </select>
          </label>
          <label>
            Place name
            <input
              value={p.place_name || ""}
              onChange={(e) =>
                update("place_name", e.target.value.toUpperCase())
              }
            />
          </label>
          <label>
            People count
            <input
              type="number"
              min={1}
              max={20}
              value={p.people_count || ""}
              onChange={(e) =>
                update(
                  "people_count",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            />
          </label>
          <label>
            Poster role
            <select
              value={p.poster_role || "concept-preview"}
              onChange={(e) =>
                update("poster_role", e.target.value as Prompt["poster_role"])
              }
            >
              <option value="concept-preview">Reviewed concept preview</option>
              <option value="source-reference">
                Source reference only (cannot publish)
              </option>
            </select>
          </label>
          <label>
            Template JSON
            <textarea
              rows={8}
              value={templateText}
              onChange={(e) => {
                setTemplateText(e.target.value);
                update("editorial_review_version", null);
              }}
            />
          </label>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              try {
                const template = JSON.parse(templateText);
                if (template?.key !== "cinematic-friends-trip-v1")
                  throw new Error("Choose cinematic-friends-trip-v1");
                const generated = generateFriendsTrip(
                  friendsTripInputSchema.parse(template.variables),
                );
                setP((prev) => ({
                  ...prev,
                  prompt_text: generated.text,
                  place_name: generated.variables.place_name,
                  people_count: generated.variables.friends_count,
                  generation_mode: "reference-required",
                  persona_policy: "person",
                  persona_version: PERSONA_POLICY_VERSION,
                  aspect_ratio: "9:16",
                  editorial_review_version: null,
                  preview_review_status: "replacement-required",
                }));
                setReelText(
                  JSON.stringify(
                    {
                      ...(p.reel || {}),
                      hook: generated.hook,
                      progression: generated.progression,
                      payoff: generated.payoff,
                      scenes: generated.scenes,
                      duration: generated.duration,
                    },
                    null,
                    2,
                  ),
                );
                setTemplateText(
                  JSON.stringify(
                    { key: template.key, variables: generated.variables },
                    null,
                    2,
                  ),
                );
                setUploadError("");
              } catch {
                setUploadError(
                  "Use valid cinematic-friends-trip-v1 template variables before regenerating.",
                );
              }
            }}
          >
            Regenerate from template variables
          </button>
          <small>
            Changing friend count or place requires regenerating the prompt,
            reviewing the poster and reviewing the video. Flat media fields are
            derived from the central preview video metadata; they cannot drift
            independently.
          </small>
        </fieldset>
        <label className="field wide">
          Preview generation brief (separate from copyable prompt)
          <textarea
            value={p.image_brief || ""}
            onChange={(e) => update("image_brief", e.target.value)}
          />
          <small>
            Request a believable Indian/South Asian preview subject unless the
            concept requires otherwise. Record specific appearance here, never
            as an override of a user’s reference.
          </small>
        </label>
        <label className="field wide">
          Video preview metadata (JSON, or null)
          <textarea
            value={videoText}
            onChange={(e) => setVideoText(e.target.value)}
          />
          <small>
            Only reviewed 5–8 second MP4 files under /videos, at most 4 MB.
            Include url, width, height, duration, bytes, mime_type and
            generation provenance. Upload through the reviewed asset release
            workflow; still images are never labelled as videos.
          </small>
        </label>
        <label className="field wide">
          Complete prompt
          <textarea
            required
            className="min-h-64"
            value={p.prompt_text}
            onChange={(e) => update("prompt_text", e.target.value)}
          />
        </label>
        <label className="field">
          Prompt type
          <select
            value={p.prompt_type}
            onChange={(e) =>
              update("prompt_type", e.target.value as Prompt["prompt_type"])
            }
          >
            {["photo", "photo_edit", "reel", "video"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Subject
          <select
            value={p.subject}
            onChange={(e) => update("subject", e.target.value)}
          >
            {[
              "Man",
              "Woman",
              "Couple",
              "Kid",
              "Family",
              "Friends",
              "Person with pet",
              "Team",
              "Product",
              "Pet",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {(["style", "tags", "suggested_tools"] as const).map((key) => (
          <label className="field" key={key}>
            {key.replaceAll("_", " ")} (comma separated)
            <input
              value={p[key].join(", ")}
              onChange={(e) =>
                update(
                  key,
                  e.target.value.split(",").map((x) => x.trim()),
                )
              }
            />
          </label>
        ))}
        <label className="field">
          Occasion
          <input
            value={p.occasion}
            onChange={(e) => update("occasion", e.target.value)}
          />
        </label>
        <label className="field">
          Aspect ratio
          <select
            value={p.aspect_ratio}
            onChange={(e) =>
              update("aspect_ratio", e.target.value as Prompt["aspect_ratio"])
            }
          >
            {["1:1", "4:5", "3:4", "9:16", "16:9"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        {(["lighting", "framing", "camera"] as const).map((key) => (
          <label className="field" key={key}>
            {key}
            <input
              value={p[key]}
              onChange={(e) => update(key, e.target.value)}
            />
          </label>
        ))}
        <label className="field wide">
          Upload preview image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <small>
            JPEG, PNG, WebP or AVIF, 400px minimum, up to 10 MB. Uploaded
            previews are public assets; do not upload private photos.
          </small>
        </label>
        {uploading && <p role="status">Optimizing and uploading…</p>}
        {uploadError && (
          <p className="error-text" role="alert">
            {uploadError}
          </p>
        )}
        {(["preview_image_url", "thumbnail_url", "image_alt"] as const).map(
          (key) => (
            <label className="field wide" key={key}>
              {key.replaceAll("_", " ")}
              <input
                required
                value={p[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </label>
          ),
        )}
        <label className="field">
          SEO title
          <input
            value={p.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
          />
        </label>
        <label className="field">
          SEO description
          <textarea
            value={p.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
          />
        </label>
        <label className="field">
          Trending rank
          <input
            type="number"
            min="0"
            value={p.trending_rank}
            onChange={(e) => update("trending_rank", Number(e.target.value))}
          />
        </label>
        <div>
          {(
            [
              "is_featured",
              "is_trending",
              "is_published",
              "is_indexable",
            ] as const
          ).map((key) => (
            <label className="checkbox-field" key={key}>
              <input
                type="checkbox"
                checked={p[key]}
                onChange={(e) => update(key, e.target.checked)}
              />
              {key.replace("is_", "").replaceAll("_", " ")}
            </label>
          ))}
        </div>
        <details className="wide">
          <summary>Optional FAQs and reel details</summary>
          <label className="field">
            FAQs JSON
            <textarea
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
            />
            <small>Array of objects with question and answer.</small>
          </label>
          <label className="field">
            Reel details JSON
            <textarea
              value={reelText}
              onChange={(e) => {
                setReelText(e.target.value);
                setP((prev) => ({
                  ...prev,
                  editorial_review_version: null,
                  preview_review_status: "replacement-required",
                }));
              }}
            />
            <small>
              Use null for a photo prompt. Reel records include duration,
              concept, scenes, caption, hashtags and music_mood.
            </small>
          </label>
        </details>
      </div>
      {(state.error || jsonError) && (
        <p className="error-text" role="alert">
          {state.error || jsonError}
        </p>
      )}
      {!pending && state.success && (
        <p role="status" className="notice">
          {state.success}
        </p>
      )}
      <div className="action-row">
        <button
          type="submit"
          className="button"
          disabled={pending || uploading || Boolean(jsonError)}
        >
          {pending ? "Saving…" : "Save prompt"}
        </button>
        <Link
          className="button secondary"
          href={`/admin/preview/${state.id || p.id}`}
        >
          Preview saved version
        </Link>
        <Link className="button secondary" href="/admin/prompts">
          Back to library
        </Link>
      </div>
    </form>
  );
}
