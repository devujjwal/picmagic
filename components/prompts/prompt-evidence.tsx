import Image from "next/image";
import Link from "@/components/ui/site-link";
import { promptEvidence } from "@/lib/prompts/evidence";
import { site } from "@/config/site";
import type { Prompt } from "@/types/content";

export function PromptEvidence({
  prompt,
  guidanceUpdatedAt,
}: {
  prompt: Prompt;
  guidanceUpdatedAt?: string;
}) {
  const evidence = promptEvidence(prompt.slug, prompt.prompt_text);
  return (
    <section className="prompt-evidence section" aria-label="Example evidence">
      <h2>Example evidence</h2>
      <p className="fine-print">
        Published by {site.operator || "PicMagic"}.
        {guidanceUpdatedAt && (
          <>
            {" "}
            Guidance updated{" "}
            <time dateTime={guidanceUpdatedAt}>
              {new Date(guidanceUpdatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
            . This is a writing update, not a new generation test.
          </>
        )}
      </p>
      {evidence ? (
        <div className="evidence-result">
          <figure>
            <Image
              src={evidence.record.asset}
              width={evidence.record.width}
              height={evidence.record.height}
              alt={evidence.record.alt}
              sizes="(max-width: 600px) 85vw, 280px"
            />
            <figcaption>
              Recorded first result, not the catalogue preview.
            </figcaption>
          </figure>
          <div>
            <h3>Documented single attempt</h3>
            <dl className="detail-facts">
              <div>
                <dt>Test date</dt>
                <dd>
                  <time dateTime={evidence.record.testedAt}>
                    {evidence.record.testedAt}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Tool</dt>
                <dd>
                  {evidence.record.provider} ({evidence.record.visibleMode})
                </dd>
              </div>
              <div>
                <dt>Image model</dt>
                <dd>{evidence.record.imageModelVersion}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>
                  {evidence.record.reference === "no-reference"
                    ? "None; fictional adult created"
                    : "Previous fictional output in the same chat"}
                </dd>
              </div>
              <div>
                <dt>Attempts</dt>
                <dd>
                  {evidence.record.attempts}; {evidence.record.correctionsRun}{" "}
                  corrective runs
                </dd>
              </div>
              <div>
                <dt>Export</dt>
                <dd>
                  {evidence.record.originalWidth} ×{" "}
                  {evidence.record.originalHeight}, resized to{" "}
                  {evidence.record.width} × {evidence.record.height}
                </dd>
              </div>
            </dl>
            <p>
              {evidence.matchesCurrentPrompt
                ? "The recorded prompt text matches the complete prompt above."
                : "The prompt above has changed since this trial. The recorded result applies to the historical input, not the current wording."}{" "}
              This does not establish repeatability, real-person likeness or
              support in other tools.
            </p>
            <Link
              className="text-link"
              href={`/guides/prompt-trial#${prompt.slug}`}
            >
              Read exact input, observations and limitations
            </Link>
          </div>
        </div>
      ) : (
        <p>
          {prompt.poster_role === "source-reference"
            ? "The reference photograph above is not a generated result."
            : "The catalogue preview illustrates the intended look; it is not a documented run of the complete copyable prompt."}{" "}
          No tool-specific test record is published for this prompt. Suggested
          tools are starting points, not verified compatibility.{" "}
          <Link href="/about#editorial-methodology">Our evidence standard</Link>
          .
        </p>
      )}
    </section>
  );
}
