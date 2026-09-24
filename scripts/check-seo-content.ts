import { allCollections, allPrompts } from "../content/catalog";
import categories from "../content/categories.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
} from "../types/content";
import {
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "../lib/seo/eligibility";

const prompts = allPrompts.map((prompt) => promptSchema.parse(prompt));
const parsedCategories = categories.map((category) =>
  categorySchema.parse(category),
);
const collections = allCollections.map((collection) =>
  collectionSchema.parse(collection),
);
const eligible = prompts.filter(isPromptSeoEligible);
const errors: string[] = [];
const warnings: string[] = [];

function exactDuplicates(
  label: string,
  values: { slug: string; value: string }[],
) {
  const seen = new Map<string, string>();
  for (const { slug, value } of values) {
    const normalized = value.trim().toLocaleLowerCase();
    const first = seen.get(normalized);
    if (first) errors.push(`${label}: ${first} and ${slug}`);
    else seen.set(normalized, slug);
  }
}

exactDuplicates(
  "Duplicate visible description",
  eligible.map((prompt) => ({
    slug: prompt.slug,
    value: prompt.description,
  })),
);
exactDuplicates(
  "Duplicate SEO description",
  eligible.map((prompt) => ({
    slug: prompt.slug,
    value: prompt.seo_description,
  })),
);
exactDuplicates(
  "Duplicate indexable category description",
  parsedCategories
    .filter((category) => isCategorySeoEligible(category, prompts))
    .map((category) => ({ slug: category.slug, value: category.description })),
);
exactDuplicates(
  "Duplicate indexable collection description",
  collections
    .filter((collection) => isCollectionSeoEligible(collection, prompts))
    .map((collection) => ({
      slug: collection.slug,
      value: collection.description,
    })),
);

const images = new Map<string, string[]>();
for (const prompt of eligible) {
  const owners = images.get(prompt.preview_image_url) || [];
  owners.push(prompt.slug);
  images.set(prompt.preview_image_url, owners);
}
for (const [image, owners] of images)
  if (owners.length > 1)
    warnings.push(`Shared indexable preview ${image}: ${owners.join(", ")}`);

console.log(
  `SEO content check: ${eligible.length} eligible prompts, ${errors.length} errors, ${warnings.length} shared-image warnings.`,
);
warnings.forEach((warning) => console.warn(`- ${warning}`));
errors.forEach((error) => console.error(`- ${error}`));
if (errors.length) process.exitCode = 1;
