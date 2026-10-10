import { posterDesigns, textLimits, type PosterState } from "./designs";
export function PosterControls({
  state,
  change,
  chooseDesign,
  chooseLanguage,
  upload,
  remove,
  hasPhoto,
  hasLogo,
  busy,
}: {
  state: PosterState;
  change: (patch: Partial<PosterState>) => void;
  chooseDesign: (id: string) => void;
  chooseLanguage: (lang: "en" | "hi") => void;
  upload: (kind: "photo" | "logo", file?: File) => void;
  remove: (kind: "photo" | "logo") => void;
  hasPhoto: boolean;
  hasLogo: boolean;
  busy: boolean;
}) {
  return (
    <div className="poster-controls">
      <fieldset>
        <legend>01 / Choose your canvas</legend>
        <label>
          Festival
          <select
            value={state.design}
            onChange={(e) => chooseDesign(e.target.value)}
          >
            {posterDesigns.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <div className="poster-field-pair">
          <label>
            Greeting language
            <select
              value={state.language}
              onChange={(e) => chooseLanguage(e.target.value as "en" | "hi")}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>
          <label>
            Format
            <select
              value={state.format}
              onChange={(e) =>
                change({ format: e.target.value as PosterState["format"] })
              }
            >
              <option value="square">Square · 1080 × 1080</option>
              <option value="portrait">Portrait · 1080 × 1350</option>
              <option value="story">Story · 1080 × 1920</option>
            </select>
          </label>
        </div>
        <label>
          Layout
          <select
            value={state.layout}
            onChange={(e) =>
              change({ layout: e.target.value as PosterState["layout"] })
            }
          >
            <option value="centered">Centered greeting</option>
            <option value="split">Photo beside greeting</option>
          </select>
        </label>
        <p className="poster-help">
          Changing the festival or language replaces the greeting and message
          presets. Your name, uploads and format stay.
        </p>
      </fieldset>
      <fieldset>
        <legend>02 / Make it yours</legend>
        <label>
          Greeting
          <textarea
            lang={state.language}
            rows={2}
            maxLength={textLimits.greeting}
            value={state.greeting}
            onChange={(e) => change({ greeting: e.target.value })}
          />
        </label>
        <label>
          Short message
          <textarea
            lang={state.language}
            rows={3}
            maxLength={textLimits.message}
            value={state.message}
            onChange={(e) => change({ message: e.target.value })}
          />
        </label>
        <label>
          Company / name
          <input
            maxLength={textLimits.name}
            value={state.name}
            placeholder="Your company or your name"
            onChange={(e) => change({ name: e.target.value })}
          />
        </label>
        <label>
          Website (optional)
          <input
            maxLength={textLimits.website}
            value={state.website}
            placeholder="yourwebsite.com"
            onChange={(e) => change({ website: e.target.value })}
          />
        </label>
        <label>
          Email (optional)
          <input
            type="email"
            autoComplete="off"
            maxLength={textLimits.email}
            value={state.email}
            placeholder="hello@example.com"
            onChange={(e) => change({ email: e.target.value })}
          />
        </label>
        <label>
          Phone (optional)
          <input
            type="tel"
            autoComplete="off"
            maxLength={textLimits.phone}
            value={state.phone}
            onChange={(e) => change({ phone: e.target.value })}
          />
        </label>
        <label>
          Other details (optional)
          <textarea
            rows={3}
            lang={state.language}
            maxLength={textLimits.details}
            value={state.details}
            placeholder="A tagline, address, social handle or personal note"
            onChange={(e) => change({ details: e.target.value })}
          />
        </label>
        <p className="poster-help">
          These details appear on your downloaded poster. Add only information
          you want to share publicly. Leave any field blank to hide it.
        </p>
        <label className="poster-colour">
          Greeting and border colour
          <input
            type="color"
            value={state.accent}
            onChange={(e) => change({ accent: e.target.value })}
          />
        </label>
      </fieldset>
      <fieldset>
        <legend>03 / Add a personal touch</legend>
        {(["logo", "photo"] as const).map((kind) => (
          <div key={kind} className="poster-upload">
            <label>
              {kind === "logo" ? "Logo (optional)" : "Photo (optional)"}
              <input
                disabled={busy}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  upload(kind, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {(kind === "photo" ? hasPhoto : hasLogo) && (
              <button
                type="button"
                className="button secondary small"
                onClick={() => remove(kind)}
              >
                Remove {kind}
              </button>
            )}
          </div>
        ))}
        <p className="poster-help">
          PNG, JPEG or WebP, up to 10 MB and 24 megapixels. Only use images you
          have permission to use. Files stay on your device; your photo is
          placed, not AI-transformed.
        </p>
        {hasPhoto && (
          <div className="poster-crop">
            {(
              [
                ["photoX", "Photo horizontal position", 0, 100, 1],
                ["photoY", "Photo vertical position", 0, 100, 1],
                ["zoom", "Photo zoom", 1, 3, 0.05],
              ] as const
            ).map(([key, label, min, max, step]) => (
              <label key={key}>
                {label}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={state[key]}
                  onChange={(e) => change({ [key]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
