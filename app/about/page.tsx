import Link from "@/components/ui/site-link";
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
      <h2 id="editorial-methodology">How we review the library</h2>
      <p>
        PicMagic combines scene instructions, an illustrative preview and
        practical guidance. Published catalogue records pass checks for a
        reviewed concept, approved preview, required content and working asset
        references. Draft concepts stay outside the public prompt catalogue.
        These checks do not mean every suggested tool has been tested.
      </p>
      <h3>What a preview demonstrates</h3>
      <p>
        A preview illustrates composition, lighting and the intended visual
        mechanism. It is not a promise that copying the prompt into any model
        will reproduce the same output. Some examples use illustration or
        compositing concepts rather than photography. A still image on a reel
        page is concept art unless a playable video is explicitly provided.
      </p>
      <h3>Suggestions are not verified tool tests</h3>
      <p>
        We do not currently publish a model-version-specific compatibility test
        record for each prompt. A verified test would need the exact prompt
        version, tool and model, test date, relevant settings, permitted
        references and reviewed results. Until that evidence is available,
        suggested tools should be treated as starting points, not endorsements
        or success guarantees.
      </p>
      <p>
        Our <Link href="/guides/prompt-trial">two-prompt walkthrough</Link>{" "}
        records a small ChatGPT trial with a newly generated fictional person,
        exact inputs, first outputs and crop checks. It does not verify
        real-person likeness or compatibility across models.
      </p>
      <p>
        Prompt pages distinguish illustrative previews from documented runs.
        When a run is available, we show its date, tool, disclosed model
        details, reference conditions, attempt count and export dimensions. If
        the prompt changes, its earlier result remains labelled as historical
        evidence. Guidance update dates describe writing changes, not a fresh
        tool test.
      </p>
      <h3>Corrections and responsible use</h3>
      <p>
        Check likeness, anatomy and important product or cultural details before
        sharing a result. Do not represent a generated scene as documentary
        evidence. If a description, preview or instruction is misleading,
        <Link href="/contact"> contact PicMagic</Link> with the prompt URL and
        the specific issue; do not send private identity photographs.
      </p>
      <p>
        The issue report on each prompt prepares an email containing that page
        address, the tool you used and your description. It does not upload
        images or submit a report automatically. Reports are requests for
        review, not proof that an issue has already been corrected.
      </p>
      <p>
        Start with our{" "}
        <Link href="/guides/reference-photo-prompts">
          reference-photo and prompt-customization guide
        </Link>{" "}
        to separate identity from styling.
      </p>
      <Link href="/ai-prompts" className="button">
        Find your next idea
      </Link>
    </article>
  );
}
