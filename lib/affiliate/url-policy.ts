// Exact provider hosts only. Shared redirect networks require a reviewed,
// campaign-specific policy once a real URL is issued; never allow a whole network.
const hosts: Record<string, readonly string[]> = {
  chatgpt: ["chatgpt.com"],
  gemini: ["gemini.google.com"],
  fotor: ["www.fotor.com", "fotor.com"],
  getimg: ["getimg.ai"],
  photoroom: ["www.photoroom.com", "app.photoroom.com"],
  adobe: ["www.adobe.com"],
  invideo: ["invideo.io", "ai.invideo.io"],
  runway: ["runwayml.com", "runway.com", "app.runwayml.com"],
};
const referralKeys = new Set([
  "ref",
  "referral",
  "aff",
  "affiliate",
  "via",
  "code",
]);
export function allowedProviderUrl(
  id: string,
  value: string,
  affiliate = false,
) {
  try {
    if (value.length > 2000 || /[\s\\]/.test(value)) return false;
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.hash ||
      !hosts[id]?.includes(url.hostname)
    )
      return false;
    // Avoid generic redirect routes, encoded/nested destinations and prompt prefill.
    if (
      /(?:redirect|outbound|\/go(?:\/|$))/i.test(
        decodeURIComponent(url.pathname),
      )
    )
      return false;
    for (const [key, val] of url.searchParams) {
      if (
        !affiliate ||
        !referralKeys.has(key) ||
        !/^[a-zA-Z0-9_-]{1,160}$/.test(val)
      )
        return false;
    }
    return true;
  } catch {
    return false;
  }
}
export function hasProviderPolicy(id: string) {
  return Object.hasOwn(hosts, id);
}
