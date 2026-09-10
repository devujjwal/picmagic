export default function Loading() {
  return (
    <div
      className="container section"
      aria-busy="true"
      aria-label="Loading inspiration"
    >
      <div className="prompt-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </div>
  );
}
