"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import type { Prompt, Category } from "@/types/content";
import { savePrompt } from "./actions";
import { slugify } from "@/lib/prompts/discovery";
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
  const update = <K extends keyof Prompt>(key: K, value: Prompt[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));
  let payload = { ...p };
  let jsonError = "";
  try {
    payload = { ...p, faqs: JSON.parse(faqText), reel: JSON.parse(reelText) };
  } catch {
    jsonError = "FAQs and reel details must contain valid JSON.";
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
      setP((prev) => ({ ...prev, ...data }));
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
        <label className="field wide">
          Description
          <textarea
            required
            value={p.description}
            onChange={(e) => update("description", e.target.value)}
          />
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
            {["Man", "Woman", "Couple", "Kid", "Family", "Product"].map((s) => (
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
              onChange={(e) => setReelText(e.target.value)}
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
