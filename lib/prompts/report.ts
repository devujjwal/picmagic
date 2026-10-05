export function promptReportEmail(
  email: string,
  path: string,
  issue: string,
  tool: string,
  description: string,
) {
  const body = [
    `Prompt: ${path}`,
    `Issue: ${issue}`,
    `Tool / model: ${tool.trim() || "Not specified"}`,
    "",
    description.trim(),
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent("PicMagic prompt issue")}&body=${encodeURIComponent(body)}`;
}
