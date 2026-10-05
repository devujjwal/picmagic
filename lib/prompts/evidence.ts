import trial from "@/content/prompt-trial.json";

/** Historical inputs remain evidence even when the catalogue wording changes. */
export function promptEvidence(slug: string, currentText: string) {
  const record = trial.records.find((record) => record.slug === slug);
  if (!record) return undefined;
  return { record, matchesCurrentPrompt: record.promptText === currentText };
}
