import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Terms of Use | PicMagic",
  "Terms for using PicMagic photo ideas, example images and prompt creators.",
  "/terms",
);
export default function Terms() {
  return (
    <article className="container prose">
      <h1>A few things to know.</h1>
      <p>Updated 10 October 2026.</p>
      <h2>Using the ideas</h2>
      <p>
        PicMagic provides creative prompts and illustrative AI-generated
        previews. You may copy and adapt the prompts for your own creative work.
        Only use reference images and other material you have permission to use,
        and respect the people represented in them.
      </p>
      <h2>External tools</h2>
      <p>
        PicMagic does not generate photos or videos for visitors. Suggested
        tools are independent services with their own availability, pricing,
        terms and privacy practices. Listing a tool does not imply endorsement,
        affiliation or guaranteed compatibility.
      </p>
      <h2>Affiliate disclosure</h2>
      <p>
        PicMagic remains free to use. Some clearly labelled external links may
        be affiliate links when a program is approved and its URL verified.
        PicMagic may earn a commission on a qualifying purchase through those
        links, at no additional cost to you. External tools set their own
        prices; a free plan does not include every feature. You can use PicMagic
        without following any referral link.
      </p>
      <h2>Results and representations</h2>
      <p>
        Examples are inspiration, not a promise of a particular result. AI
        output may contain mistakes or change someone’s appearance. Review your
        output before sharing it and avoid presenting fabricated scenes as
        evidence of real events.
      </p>
      <h2>Availability</h2>
      <p>
        The public service is free. Content and features may change, and
        temporary outages can occur. Your locally saved collection is tied to
        your browser and may be lost if its data is cleared.
      </p>
      <h2>Responsible use</h2>
      <p>
        Do not use the service to violate others’ rights, impersonate people
        deceptively, exploit children, or bypass the protections of another
        service. Requests concerning content can be directed to the operator
        through the contact page.
      </p>
    </article>
  );
}
