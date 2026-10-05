import Image from "next/image";
import Link from "@/components/ui/site-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { CopyButton } from "@/components/share/detail-actions";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import { doubleExposureGuidePath } from "@/content/consolidations";
import { doubleExposureGuide as guide } from "@/content/double-exposure-guide";
import examples from "@/content/additions/double-exposure-fashion-prompts.json";

export const metadata = makeMetadata(
  guide.title + " | PicMagic",
  guide.description,
  doubleExposureGuidePath,
);

export default function DoubleExposureGuide() {
  return (
    <article className="container prose reference-guide">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Photo ideas", path: "/ai-prompts" },
          { name: "Double-exposure fashion", path: doubleExposureGuidePath },
        ]}
      />
      <h1>{guide.title}</h1>
      <p>
        A close profile carries the face; a smaller full-length figure carries
        the clothing and stance. Both views belong to one adult. The two
        examples below use the same composition, so they share one workflow
        rather than separate recipes based on gender.
      </p>
      <h2>Two illustrative styling examples</h2>
      <div className="double-exposure-examples">
        {examples.map((example) => (
          <figure key={example.id}>
            <Image
              src={example.preview_image_url}
              width={example.image_width}
              height={example.image_height}
              sizes="(max-width: 640px) 90vw, 360px"
              alt={example.image_alt}
            />
            <figcaption>
              {example.subject === "One adult man" ? "Menswear" : "Womenswear"}{" "}
              example: AI-generated fictional styling, not a test of the
              inclusive prompt below or real-person likeness.
            </figcaption>
          </figure>
        ))}
      </div>
      <h2>Prepare one identity, not two models</h2>
      <p>
        Use a clear current photograph you have permission to edit. If
        available, add a profile photograph of that same adult and label both
        files as identity references. Label an attached PicMagic example as
        styling only. A front-facing photograph does not establish every unseen
        profile feature; do not accept a different face because the layering
        looks convincing.
      </p>
      <p>
        Use your actual hair length, body proportions and eyewear. The
        corduroy-and-denim outfit can be adapted to your preferred fit without
        changing your identity. Leave both eyes readable where possible;
        sunglasses can make comparison harder.
      </p>
      <h2>Complete double-exposure prompt</h2>
      <CopyButton text={guide.prompt} label="Copy complete prompt" />
      <div className="prompt-box">
        <p className="prompt-text">{guide.prompt}</p>
      </div>
      <h2>Review the result in this order</h2>
      <ol>
        <li>
          Compare the profile and standing face separately with the original
          photographs at equal scale. Check hairline, jaw, nose, marks and
          eyewear before judging the colour grade.
        </li>
        <li>
          Count exactly two depictions of one identity. Keep the layers separate
          enough to avoid fused noses or eyes. Transparency belongs to the large
          profile, not the full-body figure.
        </li>
        <li>
          Check complete shoes, ground contact, pocket openings and shoulder
          proportions. Match the outfit in both layers; background glow must not
          bleach skin or hide the face.
        </li>
        <li>
          Check the downloaded ratio and dimensions. Export a 4:5 image only
          after the faces and anatomy are acceptable. This full-body layout is
          not designed as a small circular avatar.
        </li>
      </ol>
      <h2>Repair one region at a time</h2>
      <p>
        <strong>If the profile becomes a second person:</strong> request:
        “Correct only the left profile against the original labelled identity
        reference. Preserve the right figure, outfit and background. Retain
        exactly two depictions of the same adult; do not replace the right
        face.” Use a mask if the tool supports one, then compare again.
      </p>
      <p>
        <strong>If hair or fabric covers facial landmarks:</strong> keep the
        accepted face fixed and reduce opacity only around the interfering edge.
        Do not lower opacity across the whole standing figure. If the aviators
        conceal important features, remove them rather than inventing unseen
        eyes.
      </p>
      <p>
        <strong>If the figures merge or shoes are clipped:</strong> increase the
        space between the two layers and reduce the standing figure&apos;s size
        within the existing canvas. Do not invent new limbs to fill the frame.
      </p>
      <h2>When generation cannot keep both views consistent</h2>
      <p>
        Suggested, untested fallback: accept a profile and a full-body image of
        the same person separately, then place them as two layers in an editor.
        Mask the profile edge and lower that layer&apos;s opacity; leave the
        standing figure opaque. Match the light direction and background before
        adding grain. Reject a drifting view rather than presenting the
        composite as faithful. This method needs two identity checks, not just a
        successful cut-out.
      </p>
      <h2>What is and is not documented here</h2>
      <p>
        The existing fictional previews illustrate two styling variants. They
        were not generated as a test of this newly consolidated prompt. No new
        generation, real-person comparison, repeatability measurement or
        tool-compatibility test is claimed. The repairs and editor fallback are
        proposed workflows; results depend on the external tool.
      </p>
      <p>
        For reference preparation, use the{" "}
        <Link href="/guides/reference-photo-prompts">
          reference-photo guide
        </Link>
        . For a square avatar, choose{" "}
        <Link href="/collections/instagram-profile-picture">
          profile-picture compositions
        </Link>{" "}
        instead. The{" "}
        <Link href="/guides/prompt-trial">documented two-prompt trial</Link>{" "}
        shows a different, bounded fictional-person workflow.
      </p>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": site.url + doubleExposureGuidePath + "#webpage",
          url: site.url + doubleExposureGuidePath,
          name: guide.title,
          description: guide.description,
          dateModified: guide.updatedAt,
          isPartOf: { "@id": site.url + "#website" },
        }}
      />
    </article>
  );
}
