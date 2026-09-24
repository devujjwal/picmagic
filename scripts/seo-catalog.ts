// Machine-readable QA input from the same catalogue and gates as the application.
import { allPrompts, allCollections } from "../content/catalog";
import rawCategories from "../content/categories.json";
import {
  promptSchema,
  categorySchema,
  collectionSchema,
  promptPath,
} from "../types/content";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "../lib/seo/eligibility";
const prompts = allPrompts.map((p) => promptSchema.parse(p));
const categories = rawCategories.map((c) => categorySchema.parse(c));
const collections = allCollections.map((c) => collectionSchema.parse(c));
console.log(
  JSON.stringify({
    prompts: prompts.map((p) => ({
      ...p,
      path: promptPath(p),
      eligible: isPromptSeoEligible(p),
    })),
    categories: categories.map((c) => ({
      ...c,
      eligible: isCategorySeoEligible(c, prompts),
    })),
    collections: collections.map((c) => ({
      ...c,
      eligible: isCollectionSeoEligible(c, prompts),
    })),
  }),
);
