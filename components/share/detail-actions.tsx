"use client";
import { useEffect, useState } from "react";
import { Copy, Check, Share2, Link as LinkIcon } from "lucide-react";
import { SaveButton } from "@/components/prompts/save-button";
import { useNotice, recordRecent } from "@/features/saved/store";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";
export function CopyButton({
  text,
  id,
  label = "Copy prompt",
}: {
  text: string;
  id?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const notify = useNotice();
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return (
    <button
      className="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          notify("Prompt copied. Love this look? Share it.");
          track("prompt_copy", { prompt_id: id });
        } catch {
          notify(
            "Copy unavailable. Select the prompt text and copy it manually.",
          );
        }
      }}
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
      {copied ? "Prompt copied" : label}
    </button>
  );
}
export function DetailActions({
  id,
  title,
  text,
  path,
}: {
  id: string;
  title: string;
  text: string;
  path: string;
}) {
  const notify = useNotice();
  const url = site.url + path;
  const message = `Found this amazing AI photo idea on PicMagic 👀\n\n${title}\n\nTry it here:\n${url}`;
  useEffect(() => {
    recordRecent(id);
    track("prompt_view", { prompt_id: id });
  }, [id]);
  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Found this amazing AI photo idea on PicMagic 👀\n${title}`,
          url,
        });
        track("prompt_share", { prompt_id: id, method: "native" });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          notify("Sharing unavailable. Use one of the links below.");
      }
    } else {
      document.getElementById("share-options")?.setAttribute("open", "");
    }
  }
  return (
    <>
      <div className="action-row detail-actions">
        <CopyButton text={text} id={id} />
        <SaveButton id={id} title={title} full />
        <button
          className="button secondary"
          onClick={nativeShare}
          aria-label="Share this look"
        >
          <Share2 size={17} />
        </button>
      </div>
      <details className="share-menu" id="share-options">
        <summary>Share this look with someone</summary>
        <div className="share-links">
          <a
            className="chip"
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("whatsapp_share", { prompt_id: id });
              track("prompt_share", { prompt_id: id, method: "whatsapp" });
            }}
          >
            WhatsApp
          </a>
          <a
            className="chip"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("prompt_share", { prompt_id: id, method: "facebook" })
            }
          >
            Facebook
          </a>
          <a
            className="chip"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " | PicMagic")}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("prompt_share", { prompt_id: id, method: "x" })
            }
          >
            X
          </a>
          <button
            className="chip"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                notify("Link copied");
                track("prompt_share", { prompt_id: id, method: "copy_link" });
              } catch {
                notify(
                  "Copy unavailable. Copy the page address from your browser.",
                );
              }
            }}
          >
            <LinkIcon size={13} />
            Copy link
          </button>
        </div>
      </details>
    </>
  );
}
