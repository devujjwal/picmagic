import Link from "next/link";

export default function Loading() {
  return (
    <div className="container section" aria-label="Loading inspiration">
      <noscript>
        <p>
          The prompt creator needs JavaScript. You can still{" "}
          <Link href="/ai-prompts">browse ready-to-use photo prompts</Link> and
          select the text from their pages.
        </p>
      </noscript>
      <div className="prompt-grid" aria-busy="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </div>
  );
}
