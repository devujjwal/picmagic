import Link from "@/components/ui/site-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import { referenceGuidePath, sitePages } from "@/content/site-pages";

const title = "How to use a reference photo with an AI portrait prompt";
const description =
  "Separate identity from styling, choose a useful reference, customize a PicMagic prompt and check the result for face drift and realism.";
export const metadata = makeMetadata(title, description, referenceGuidePath);

export default function ReferencePhotoGuide() {
  return (
    <article className="container prose reference-guide">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Reference-photo guide", path: referenceGuidePath },
        ]}
      />
      <div className="eyebrow">A practical starting point</div>
      <h1>{title}</h1>
      <p>
        A useful portrait prompt separates three things: who the person is, what
        the scene should show, and what must remain unchanged. Your reference
        photo supplies identity. The prompt supplies the composition, clothing,
        light and expression. Neither guarantees an exact likeness in every AI
        tool.
      </p>
      <h2>What makes a useful reference photo?</h2>
      <p>
        Choose a clear, reasonably current image with an unobstructed face,
        visible hairline and natural skin texture. Avoid strong beauty filters,
        heavy shadows over the eyes and very small faces. A second view can
        clarify features, but label it as the same person; do not assume the
        tool understands which face to use in a group photograph.
      </p>
      <p>
        Only use photographs you have permission to edit. PicMagic does not need
        the reference: attach it inside the external tool you choose, after
        checking that tool’s privacy and upload settings. Keep private
        documents, addresses and unrelated people out of the frame.
      </p>
      <h2>How do I customize a PicMagic prompt?</h2>
      <ol>
        <li>
          <strong>Pick the output.</strong> Choose a still image, photo edit or
          motion story. A reel’s concept still is not a rendered video.
        </li>
        <li>
          <strong>Identify the reference role.</strong> Tell the tool which
          image supplies identity, which supplies a garment or product, and
          which is only a style example.
        </li>
        <li>
          <strong>Keep the creative mechanism.</strong> Preserve the selected
          prompt’s framing and main visual idea. Change one setting, colour or
          prop at a time.
        </li>
        <li>
          <strong>State the expression and age.</strong> A serious scene does
          not need the reference smile. Keep the intended age explicit;
          professional clothes do not require an older face. Never substitute an
          adult reference for a child character.
        </li>
        <li>
          <strong>Review before sharing.</strong> Compare the output with the
          reference and with the scene requirements. Correct errors before using
          it as a profile or product image.
        </li>
      </ol>
      <h2>What should I write about identity?</h2>
      <blockquote>
        Use the attached portrait for this adult’s identity only. Preserve
        recognizable facial proportions, natural complexion, hairline and body
        proportions. Follow the scene prompt for expression, clothing, pose and
        lighting; do not automatically copy the reference smile or background.
      </blockquote>
      <p>
        This is a starting instruction, not a face-lock guarantee. Add the
        scene-specific prompt after it. If a tool does not support reference
        images, text alone cannot reliably reproduce a particular person.
      </p>
      <h2>Which parts of a prompt can I change?</h2>
      <ul>
        <li>
          <Link href="/ai-prompts/men/city-lights-main-character-energy">
            City Lights
          </Link>
          : change clothing colour while retaining the night setting and
          coherent light on the face. Do not add unrelated studio lighting.
        </li>
        <li>
          <Link href="/ai-prompts/travel/the-river-remembers">
            The River Remembers
          </Link>
          : adapt the river memory, but keep the journal-to-river ink transition
          outside the photographic face.
        </li>
        <li>
          <Link href="/ai-prompts/fashion/one-saree-three-campaign-worlds">
            One Saree, Three Campaign Worlds
          </Link>
          : change the campaign environment, not the garment’s represented
          weave, border or colour. Verify product details against the actual
          saree.
        </li>
      </ul>
      <h2>How do I check realism and face drift?</h2>
      <p>
        Compare face shape, eye spacing, nose, jaw and complexion first.
        Expression can move the cheeks and mouth without changing the underlying
        identity. Then inspect fingers, hand-to-prop contact, jewellery, fabric
        edges and shadow direction. Finally, check the intended mobile or
        circular crop; a good full-size image can still make a poor avatar.
      </p>
      <p>
        If one feature drifts, request a focused correction while preserving the
        composition. For a surprised scene, try a restrained version of surprise
        rather than falling back to a smile. If repeated edits cannot preserve
        important details, use a different workflow or retain the original
        photograph instead of accepting an inaccurate identity.
      </p>
      <p>
        See a worked example in our{" "}
        <Link href="/guides/prompt-trial">
          two-prompt trial with a fictional person
        </Link>
        : the first outputs, exact inputs and the limits we observed.
      </p>
      <h2>Are these instructions tested in every tool?</h2>
      <p>
        No. Suggested-tool labels are not verified compatibility badges.
        Capabilities and results vary by model and version. These examples
        explain prompt intent; they are not a controlled comparison of tool
        performance. Read{" "}
        <Link href="/about#editorial-methodology">
          how PicMagic reviews and describes its library
        </Link>
        .
      </p>
      <p>
        For more examples, explore{" "}
        <Link href="/collections/instagram-profile-picture">
          profile-picture compositions
        </Link>{" "}
        or <Link href="/collections/cinematic">cinematic scenes</Link>.
      </p>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${site.url}${referenceGuidePath}#webpage`,
          url: site.url + referenceGuidePath,
          name: title,
          description,
          dateModified: sitePages.find((p) => p.path === referenceGuidePath)
            ?.updatedAt,
          isPartOf: { "@id": `${site.url}#website` },
          publisher: { "@id": `${site.url}#organization` },
        }}
      />
    </article>
  );
}
