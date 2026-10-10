import type { AffiliateProvider, Capability } from "@/lib/affiliate/schema";
// Editorial fixtures only: no affiliate IDs, codes or issued URLs.
const verified = "2026-10-09T00:00:00.000Z";
function provider(
  id: string,
  name: string,
  official_url: string,
  description: string,
  evidence_urls: string[],
  features: [Capability, "free" | "paid" | "unknown", string][],
  program_url: string | null = null,
  media: ("photo" | "video")[] = ["photo"],
): AffiliateProvider {
  return {
    id,
    name,
    official_url,
    description,
    evidence_urls,
    capabilities: features.map(([capability, access, note]) => ({
      capability,
      access,
      note,
    })),
    program_url,
    media,
    priority: 50,
    is_enabled: true,
    last_verified_at: verified,
    affiliate_status: program_url ? "Application required" : "Unavailable",
    affiliate_url: null,
    approval_evidence: "",
    payout_confirmed: false,
    placement_confirmed: false,
    verified_affiliate_url: null,
    affiliate_url_verified_at: null,
  };
}
export const affiliateProviderSeeds: AffiliateProvider[] = [
  provider(
    "chatgpt",
    "ChatGPT",
    "https://chatgpt.com/",
    "Generate or edit an image using your own permitted photograph and a written prompt.",
    [
      "https://help.openai.com/en/articles/11084440-images-in-chatgpt",
      "https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq",
    ],
    [
      ["text_to_image", "free", "Image creation has usage limits."],
      ["image_to_image", "free", "Upload and editing limits apply."],
      [
        "reference_image",
        "free",
        "Paste your prompt and upload your own photo; likeness can vary.",
      ],
      ["photo_editing", "free", "Review edits before sharing."],
    ],
  ),
  provider(
    "gemini",
    "Gemini",
    "https://gemini.google.com/",
    "Create and edit images with photo uploads in supported Gemini image modes.",
    [
      "https://support.google.com/gemini/answer/14286560?hl=en",
      "https://gemini.google/subscriptions/",
    ],
    [
      ["text_to_image", "free", "Availability, age and usage limits apply."],
      ["image_to_image", "free", "Model and upload limits apply."],
      [
        "reference_image",
        "free",
        "Use a permitted reference photo; likeness can vary.",
      ],
      [
        "photo_editing",
        "free",
        "Advanced output may require a paid Google AI plan.",
      ],
      [
        "multi_image_reference",
        "free",
        "Only supported image modes; access limits apply.",
      ],
    ],
  ),
  provider(
    "fotor",
    "Fotor",
    "https://www.fotor.com/ai-photo-editor/",
    "Edit an existing photograph or explore AI image transformations with credit-based features.",
    [
      "https://www.fotor.com/ai-photo-editor/",
      "https://www.fotor.com/pricing/",
    ],
    [
      [
        "text_to_image",
        "unknown",
        "AI generation uses credits; check the required feature.",
      ],
      [
        "image_to_image",
        "unknown",
        "Check model access and available credits.",
      ],
      [
        "reference_image",
        "unknown",
        "Core editing is free; the requested AI transformation may need payment.",
      ],
      [
        "photo_editing",
        "unknown",
        "Free core editing does not include every AI feature.",
      ],
    ],
    "https://www.fotor.com/affiliates.html",
  ),
  provider(
    "getimg",
    "getimg.ai",
    "https://getimg.ai/image-to-image",
    "Transform a source image with a prompt, including portrait or product compositions.",
    ["https://getimg.ai/image-to-image", "https://getimg.ai/pricing"],
    [
      ["text_to_image", "paid", "Current pricing lists paid credit plans."],
      ["image_to_image", "paid", "Source-image generation uses plan credits."],
      [
        "reference_image",
        "paid",
        "Upload a reference inside the tool; identity is not guaranteed.",
      ],
      ["photo_editing", "paid", "Check the selected model's editing workflow."],
      ["product_photography", "paid", "Review product details in the output."],
    ],
    "https://getimg.ai/legal/-getimgai-affiliate-program-terms",
  ),
  provider(
    "photoroom",
    "Photoroom",
    "https://www.photoroom.com/ai-product-photography",
    "Create product backgrounds and edit product photos for shops and fashion listings.",
    [
      "https://www.photoroom.com/ai-product-photography",
      "https://www.photoroom.com/pricing",
    ],
    [
      [
        "product_photography",
        "unknown",
        "Basic editing has free entry; AI shoots depend on plan and credits.",
      ],
      [
        "photo_editing",
        "unknown",
        "Check whether the required AI feature is included.",
      ],
      [
        "reference_image",
        "unknown",
        "Use a product photograph, not a portrait identity workflow.",
      ],
    ],
    "https://www.photoroom.com/affiliates",
  ),
  provider(
    "adobe",
    "Adobe Photoshop",
    "https://www.adobe.com/products/photoshop.html",
    "Use Photoshop's reference-assisted editing for advanced photo and product compositions.",
    [
      "https://helpx.adobe.com/photoshop/desktop/create-open-import-images/create-images/use-reference-images-for-consistent-results.html",
    ],
    [
      [
        "photo_editing",
        "paid",
        "Photoshop subscription and model credits apply.",
      ],
      [
        "reference_image",
        "paid",
        "Reference-assisted editing is not guaranteed face preservation.",
      ],
      ["image_to_image", "paid", "Check the selected model and subscription."],
    ],
    "https://www.adobe.com/affiliates.html",
  ),
  provider(
    "invideo",
    "InVideo",
    "https://invideo.io/",
    "Build video ideas with supported text- or image-to-video workflows; check the selected model.",
    [
      "https://invideo.io/make/affiliate-program/",
      "https://invideo.io/pricing/",
    ],
    [
      [
        "text_to_video",
        "unknown",
        "Generative model access depends on plan and credits.",
      ],
      [
        "image_to_video",
        "unknown",
        "Check model duration and aspect ratios; longer reels need separate clips.",
      ],
    ],
    "https://invideo.io/make/affiliate-program/",
    ["video"],
  ),
  provider(
    "runway",
    "Runway",
    "https://runwayml.com/",
    "Animate a starting image with motion instructions in a supported Runway video model.",
    [
      "https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video",
      "https://runwayml.com/pricing",
    ],
    [
      [
        "image_to_video",
        "unknown",
        "Gen-4: 5 or 10 seconds, 9:16 or 16:9; model access depends on plan. Free starter credits do not include every model.",
      ],
      [
        "reference_image",
        "unknown",
        "Upload a permitted starting image inside Runway.",
      ],
    ],
    null,
    ["video"],
  ),
];
