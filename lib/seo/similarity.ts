/** Lexical screening, not a semantic verdict. Shared safety instructions can inflate overlap. */
export function textSimilarity(a: string, b: string) {
  const grams = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    return new Set(
      words
        .slice(0, -2)
        .map((word, i) => [word, words[i + 1], words[i + 2]].join(" ")),
    );
  };
  const left = grams(a),
    right = grams(b);
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((gram) => right.has(gram)).length;
  return (2 * intersection) / (left.size + right.size);
}
