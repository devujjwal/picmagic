"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <div className="empty-state">
        <h2>A little pause in the magic.</h2>
        <p>
          We couldn’t load this page. Your saved looks are still in your
          browser. Please try again in a moment.
        </p>
        <button className="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
