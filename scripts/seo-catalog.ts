// Machine-readable QA input from the same catalogue and gates as the application.
import { loadAuditCatalog } from "./optimization/catalog";
import { promptPath } from "../types/content";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "../lib/seo/eligibility";
const { prompts, categories, collections } = loadAuditCatalog();
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
