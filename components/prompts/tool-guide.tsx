import Link from "@/components/ui/site-link";

export function ToolGuide({ edit = false }: { edit?: boolean }) {
  return (
    <section
      className="section tool-guide"
      aria-labelledby="tool-guide-heading"
    >
      <div className="section-head">
        <div>
          <h2 id="tool-guide-heading">
            Take the instructions to your image tool
          </h2>
          <p>
            PicMagic writes a prompt. It does not upload, generate or edit your
            photo.
          </p>
        </div>
      </div>
      <div className="reel-scenes">
        <div className="reel-scene">
          <h3>{edit ? "Choose one change" : "Build one clear idea"}</h3>
          <p>
            {edit
              ? "Start with lighting, a background or another single improvement. Keep the original photo for comparison; asking for several changes at once makes mistakes harder to isolate."
              : "Choose a subject, setting and style that work together. Framing decides how much space the person, clothing and surroundings receive; adding more effects does not always improve the result."}
          </p>
          <h3 className="mt-5">Copy, attach, check</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Complete the choices above and copy the full resulting prompt.
            </li>
            <li>
              Paste it into an image tool that accepts references. Attach a
              clear photo you have permission to edit there, not here.
            </li>
            <li>
              Check the result against the reference. Keep the same face, age,
              complexion and proportions; request one focused correction if they
              drift.
            </li>
          </ol>
        </div>
        <div className="reel-scene">
          <h3>
            {edit
              ? "Example: improve indoor light"
              : "Example: a portrait with room for its setting"}
          </h3>
          <p>
            {edit
              ? "Choose Improve Lighting, a soft studio treatment and the original outfit. The instruction should lift uneven facial shadows while retaining the same person, clothing and background. It should not ask for younger skin or a different face."
              : "Choose a natural portrait, a garden, the original outfit and half-body framing. The instruction gives the setting room to show while keeping the face prominent. Change the light or background first, rather than changing every choice together."}
          </p>
          <p className="mt-3">
            This is an illustrative workflow, not a verified result or a
            compatibility promise. External tools have their own privacy terms,
            pricing and capabilities. PicMagic does not receive your reference
            photo.
          </p>
          <Link className="text-link" href="/guides/reference-photo-prompts">
            Choose a useful reference and customize your prompt
          </Link>
        </div>
      </div>
    </section>
  );
}
