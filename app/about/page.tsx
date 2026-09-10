import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "About PicMagic | Photo Inspiration for Everyone",
  "Discover why PicMagic makes creative photo ideas simple, visual and free.",
  "/about",
);
export default function About() {
  return (
    <article className="container prose">
      <h1>A little inspiration goes a long way.</h1>
      <p>
        PicMagic helps you discover what your next photo could become. A
        cinematic portrait. A family celebration. A favourite memory with a
        fresh perspective.
      </p>
      <h2>Choose a look. Get the magic prompt.</h2>
      <p>
        Explore an idea, copy its instructions and try them in your preferred AI
        tool. Or use our guided creators to put your own idea into words. You
        don’t need to know anything about prompt engineering.
      </p>
      <h2>Free to explore</h2>
      <p>
        PicMagic does not charge visitors. The site is designed to support
        advertising without interrupting the creative experience. Optional
        services are explained in our privacy settings when enabled.
      </p>
      <h2>Your photos stay with you</h2>
      <p>
        We don’t ask you to upload personal photos. Saved looks stay in your
        browser. Any photo you choose to use with an external AI tool is handled
        by that provider, under its own terms.
      </p>
      <h2>Inspiration, with honest expectations</h2>
      <p>
        Our previews are AI-generated examples. Results vary between tools and
        reference images. Identity-preservation instructions can help express
        your intention, but cannot guarantee the outcome.
      </p>
      <Link href="/ai-prompts" className="button">
        Find your next idea
      </Link>
    </article>
  );
}
