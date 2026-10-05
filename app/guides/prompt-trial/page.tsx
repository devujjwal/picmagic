import Image from "next/image";
import Link from "@/components/ui/site-link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { CopyButton } from "@/components/share/detail-actions";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
import trial from "@/content/prompt-trial.json";
import { promptTrialPath } from "@/content/site-pages";

const title = "Two prompts, one fictional person: what actually happened";
const description =
  "A documented PicMagic prompt trial in ChatGPT: the exact inputs, first results, circular avatar checks, scene change and limitations.";
export const metadata = makeMetadata(title, description, promptTrialPath);

export default function PromptTrial() {
  return (
    <article className="container prose reference-guide">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Prompt trial", path: promptTrialPath },
        ]}
      />
      <div className="eyebrow">A practical walkthrough · 25 September 2026</div>
      <h1>{title}</h1>
      <p>
        Can one prompt create a usable profile picture, and another put that
        person into a different scene? We tried two existing PicMagic prompts in
        ChatGPT and kept the first result from each. Here are the inputs,
        outputs and the parts that still needed checking.
      </p>
      <p className="notice">
        The person is entirely fictional. No real person’s photograph was
        uploaded. This is a small example of one workflow, not a test of
        real-person likeness or a promise that you will get the same result.
      </p>
      <h2>What we used</h2>
      <ul>
        <li>
          ChatGPT’s web image-generation workflow, with “Instant” visible in the
          composer. The interface did not disclose the underlying image model or
          version.
        </li>
        <li>
          The complete copyable prompts for A Fold Around You and Borrowed Moon,
          Closing Time. The exact submitted inputs are available below.
        </li>
        <li>
          One attempt per prompt, in the same conversation. No corrective
          generations, face edits or selective replacement of failed attempts.
        </li>
      </ul>
      <h2 id="a-fold-around-you-profile">
        1. Make a square portrait without a reference
      </h2>
      <p>
        First we submitted A Fold Around You without attaching an image. Its
        no-reference instructions ask for a fictional Indian/South Asian adult;
        that is the casting instruction, not an ethnicity inferred from the
        output. The resulting portrait has glasses, a short beard, a blue
        backing and folded cream paper around the shoulders.
      </p>
      <TrialImage index={0} />
      <p>
        <strong>What worked:</strong> the face remains photographic while the
        paper provides a physical frame. Facial landmarks are clear and the
        paper does not wrap the neck. The subject is large enough for an avatar.
      </p>
      <p>
        <strong>What did not follow the request exactly:</strong> the prompt
        asked for a 1024×1024 target, but the downloaded output was 1254×1254.
        We resized it to 1024×1024 for this page. Writing pixel dimensions in a
        prompt is not a reliable export setting; check the downloaded file.
      </p>
      <h3>Does it still work in a small circle?</h3>
      <p>
        We checked the same image at 40, 64 and 128 pixels. The upper row shows
        squares and the lower row circles, left to right in those sizes. At 40
        pixels the fine paper texture is lost, but the face, glasses and broad
        folds remain distinguishable. The head and chin stay within the circular
        crop.
      </p>
      <figure>
        <Image
          src="/guides/prompt-trial/fold-crop-check.webp"
          width={400}
          height={342}
          sizes="(max-width: 440px) 90vw, 400px"
          alt="The fictional portrait at 40, 64 and 128 pixels, in square crops above and circular crops below."
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <figcaption>
          Small-size checks, not a likeness assessment. This sheet may scale
          down on a narrow screen.
        </figcaption>
      </figure>
      <InputDetails index={0} />
      <h2 id="borrowed-moon-closing-time">
        2. Change the scene while retaining the fictional person
      </h2>
      <p>
        In the same conversation, we asked ChatGPT to use the person it had just
        generated as the identity reference. We explicitly excluded the paper
        backdrop, then pasted the complete Borrowed Moon prompt. This uses an
        earlier generated image in conversation; it does not test a fresh photo
        upload.
      </p>
      <TrialImage index={1} />
      <p>
        <strong>What worked:</strong> glasses, short beard and swept hair remain
        broadly consistent. The image changes the pose, clothing and setting,
        with an amused sideways glance, theatre seating and a painted crescent
        supported by a wheeled cart. The paper backdrop does not follow the
        person into the new scene.
      </p>
      <p>
        <strong>What to inspect:</strong> the new angle and warm lighting change
        how the face reads. Broad consistency is not proof of an exact face
        match. The moon’s outer edge is clipped at the left; for a product-like
        shot of the whole prop, request a wider frame. Inspect the grip and cart
        support at full size rather than judging only the thumbnail.
      </p>
      <p>
        The downloaded image was 1122×1402, close to the requested 4:5 ratio,
        but not the requested 1080×1350 pixel target. The displayed version was
        resized to 1080×1350 without creative retouching.
      </p>
      <InputDetails index={1} />
      <h2>What to do with your own photograph</h2>
      <ol>
        <li>
          Use a clear photograph you have permission to edit. Attach it in your
          chosen image tool and explicitly label it as the identity reference.
        </li>
        <li>
          Copy the complete scene prompt, retaining its reference-present
          instructions. Let the prompt change the setting and wardrobe, not your
          apparent age, facial geometry or natural complexion.
        </li>
        <li>
          Compare the output with your photograph before checking the decorative
          effect. If it changes your identity, ask for one focused repair. Do
          not accept a different face just because the scene looks polished.
        </li>
        <li>
          Check the export dimensions and your intended crop. Resize only after
          checking the face, hands and important props.
        </li>
      </ol>
      <h2>What this trial cannot tell you</h2>
      <p>
        Two results from one conversation do not establish a success rate. We
        did not test different ages, couples, children, product accuracy, other
        image tools or repeatability. The provider can change its models. The
        existing catalogue previews may have been created from separate preview
        briefs; these walkthrough images specifically document the inputs shown
        here.
      </p>
      <p>
        For reference preparation and common identity problems, read the{" "}
        <Link href="/guides/reference-photo-prompts">
          reference-photo guide
        </Link>
        . If a prompt gives a misleading result,{" "}
        <Link href="/contact">
          send PicMagic the prompt URL and a description of the problem
        </Link>
        ; do not send private photographs.
      </p>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${site.url}${promptTrialPath}#webpage`,
          url: site.url + promptTrialPath,
          name: title,
          description,
          dateModified: "2026-09-25T04:00:00Z",
          isPartOf: { "@id": `${site.url}#website` },
          publisher: { "@id": `${site.url}#organization` },
        }}
      />
    </article>
  );
}

function TrialImage({ index }: { index: number }) {
  const record = trial.records[index];
  return (
    <figure>
      <Image
        src={record.asset}
        alt={record.alt}
        width={record.width}
        height={record.height}
        sizes="(max-width: 640px) 90vw, 600px"
        style={{ width: "100%", maxWidth: 600, height: "auto" }}
      />
      <figcaption>
        First attempt · {record.testedAt} · AI-generated fictional person.{" "}
        <Link href={record.path}>Open {record.title}</Link>.
      </figcaption>
    </figure>
  );
}
function InputDetails({ index }: { index: number }) {
  const record = trial.records[index];
  return (
    <details className="faq">
      <summary>Exact input: {record.title}</summary>
      <p className="fine-print">
        Recorded on {record.testedAt}. This preserves the tested version even if
        the library prompt changes later.
        {index === 1
          ? " The opening sentence refers to the first fictional image in the same conversation."
          : " No reference was attached."}
      </p>
      <div className="prompt-box">
        <p className="prompt-text">{record.inputText}</p>
      </div>
      <CopyButton text={record.inputText} label="Copy trial input" />
    </details>
  );
}
