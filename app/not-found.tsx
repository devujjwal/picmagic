import Link from "@/components/ui/site-link";
export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty-state">
        <p className="eyebrow justify-center">
          404 · A little off the beaten path
        </p>
        <h1 className="font-serif text-4xl my-5">
          This look has wandered off.
        </h1>
        <p>
          It may have moved or is no longer available. There’s plenty more
          inspiration waiting.
        </p>
        <Link className="button" href="/ai-prompts">
          Explore photo ideas
        </Link>
      </div>
    </div>
  );
}
