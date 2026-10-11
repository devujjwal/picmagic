"use client";
import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, ShieldCheck } from "lucide-react";
import {
  getDesign,
  initialPoster,
  validatePoster,
  type PosterState,
} from "./designs";
import { decodeUpload, type LocalImage } from "./uploads";
import { renderPoster } from "./render";
import { PosterControls } from "./controls";
import { loadPosterFont } from "./font";
import { track } from "@/lib/analytics";
export function PosterEditor({ designId }: { designId: string }) {
  const [state, setState] = useState(() => initialPoster(designId));
  const [art, setArt] = useState<{
    id: string;
    image: HTMLImageElement;
  } | null>(null);
  const [images, setImages] = useState<{
    photo?: LocalImage;
    logo?: LocalImage;
  }>({});
  const [fontReady, setFontReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [renderErrors, setRenderErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const uploads = useRef<{ photo?: LocalImage; logo?: LocalImage }>({});
  const revision = useRef(0);
  const design = getDesign(state.design);
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.src = design.artwork;
    Promise.all([image.decode(), loadPosterFont()])
      .then(() => {
        if (!active) return;
        if (
          !document.fonts.check('400 32px "PicMagic Devanagari"') ||
          !document.fonts.check('600 32px "PicMagic Display"')
        )
          throw Error("Font unavailable");
        setArt({ id: design.id, image });
        setFontReady(true);
        setLoadError("");
      })
      .catch(() => {
        if (active) {
          setArt(null);
          setLoadError(
            "The artwork or font could not load. Check your connection, then retry.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [design.id, design.artwork, retry]);
  useEffect(
    () => () => {
      revision.current++;
      Object.values(uploads.current).forEach((i) => URL.revokeObjectURL(i.url));
    },
    [],
  );
  useEffect(() => {
    if (!canvas.current || art?.id !== state.design || !fontReady) return;
    try {
      setRenderErrors(
        renderPoster(
          canvas.current,
          state,
          art.image,
          images.photo?.image,
          images.logo?.image,
        ),
      );
    } catch {
      setRenderErrors(["Preview rendering failed. Try resetting the poster."]);
    }
  }, [state, art, images, fontReady]);
  function change(patch: Partial<PosterState>) {
    setState((s) => ({ ...s, ...patch }));
    setNotice("");
  }
  function chooseDesign(id: string) {
    const d = getDesign(id);
    change({
      design: d.id,
      greeting: d[state.language],
      message: state.language === "hi" ? d.messageHi : d.messageEn,
      accent: d.accent,
    });
  }
  function chooseLanguage(language: "en" | "hi") {
    change({
      language,
      greeting: design[language],
      message: language === "hi" ? design.messageHi : design.messageEn,
    });
  }
  async function upload(kind: "photo" | "logo", file?: File) {
    if (!file) return;
    const token = ++revision.current;
    setBusy(true);
    setActionError("");
    try {
      const image = await decodeUpload(file);
      if (token !== revision.current) {
        URL.revokeObjectURL(image.url);
        return;
      }
      if (uploads.current[kind])
        URL.revokeObjectURL(uploads.current[kind]!.url);
      uploads.current = { ...uploads.current, [kind]: image };
      setImages({ ...uploads.current });
    } catch (error) {
      if (token === revision.current)
        setActionError(
          error instanceof Error ? error.message : "Upload failed.",
        );
    } finally {
      if (token === revision.current) setBusy(false);
    }
  }
  function remove(kind: "photo" | "logo") {
    revision.current++;
    if (uploads.current[kind]) URL.revokeObjectURL(uploads.current[kind]!.url);
    delete uploads.current[kind];
    setImages({ ...uploads.current });
    setBusy(false);
  }
  function reset() {
    revision.current++;
    Object.values(uploads.current).forEach((i) => URL.revokeObjectURL(i.url));
    uploads.current = {};
    setImages({});
    setState(initialPoster(designId));
    setActionError("");
    setBusy(false);
    setNotice("Poster reset. Uploaded files have been released.");
  }
  async function download() {
    setActionError("");
    setNotice("");
    if (art?.id !== state.design || !fontReady) return;
    const errors = validatePoster(state);
    if (errors.length) {
      setActionError(errors.join(" "));
      return;
    }
    setBusy(true);
    try {
      // Export the full-resolution preview surface itself. A detached canvas
      // can resolve variable-font metrics differently from a document canvas.
      // CSS scales this surface visually; its backing pixels stay export-sized.
      const output = canvas.current;
      if (!output) throw Error("The preview is unavailable. Please retry.");
      const errors = renderPoster(
        output,
        state,
        art.image,
        images.photo?.image,
        images.logo?.image,
      );
      if (errors.length) throw Error(errors.join(" "));
      const blob = await new Promise<Blob>((resolve, reject) =>
        output.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(Error("PNG export failed. Please try again.")),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `picmagic-${state.design}-${state.format}.png`;
      a.click();
      // Only fixed design choices, after a successful export. Never send text,
      // filenames, contact details, uploaded images or the generated PNG.
      track("poster_export", {
        poster_design: state.design,
        poster_format: state.format,
        poster_language: state.language,
      });
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setNotice(
        "PNG download started. Your design has not been uploaded or saved online.",
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Download failed. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const ready = art?.id === state.design && fontReady;
  const errors = [...validatePoster(state), ...renderErrors];
  return (
    <div className="poster-workspace">
      <PosterControls
        state={state}
        change={change}
        chooseDesign={chooseDesign}
        chooseLanguage={chooseLanguage}
        upload={upload}
        remove={remove}
        hasPhoto={!!images.photo}
        hasLogo={!!images.logo}
        busy={busy}
      />
      <section
        className="poster-preview-panel"
        aria-label="Poster preview and download"
      >
        <div className="poster-preview-heading">
          <span className="eyebrow">Your festive canvas</span>
          <span>Free PNG · no watermark</span>
        </div>
        <div className="poster-canvas-wrap" aria-busy={!ready}>
          <canvas
            ref={canvas}
            hidden={!ready}
            aria-label={`Poster preview: ${state.greeting}. ${state.message}. ${state.name}. ${state.website}. ${state.email}. ${state.phone}. ${state.details}`}
            role="img"
          />
          {!ready && (
            <p role="status">{loadError || "Preparing artwork and fonts…"}</p>
          )}
          {loadError && (
            <button
              className="button secondary"
              onClick={() => setRetry((n) => n + 1)}
            >
              Retry artwork
            </button>
          )}
        </div>
        {errors.length > 0 && ready && (
          <p role="alert" className="poster-error">
            {errors.join(" ")}
          </p>
        )}
        {actionError && (
          <p role="alert" className="poster-error">
            {actionError}
          </p>
        )}
        <div className="poster-actions">
          <button
            type="button"
            className="button"
            disabled={!ready || busy || !!errors.length}
            onClick={download}
          >
            <Download size={18} />
            Download PNG
          </button>
          <button type="button" className="button secondary" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        <p role="status" className="poster-help">
          {notice}
        </p>
        <p className="poster-private">
          <ShieldCheck size={18} />
          Your uploads and text stay in this tab. Closing or refreshing clears
          your work.
        </p>
      </section>
    </div>
  );
}
