import { realpath, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";
import sharp from "sharp";
import type { AuditCatalog, Finding } from "./types";
import { finding, origin } from "./analyze";
import { promptPath } from "../../types/content";

export async function inspectImages(
  catalog: AuditCatalog,
  observedAt: string,
  root: string,
) {
  const findings: Finding[] = [];
  const publicRoot = await realpath(resolve(root, "public/previews"));
  const sizes: number[] = [];
  const seen = new Map<
    string,
    { width?: number; height?: number; size: number; format?: string } | null
  >();
  let unknown = 0;
  for (const p of catalog.prompts.filter((p) => p.is_published))
    for (const [role, src] of [
      ["preview", p.preview_image_url],
      ["thumbnail", p.thumbnail_url],
    ]) {
      let issue = "";
      if (!/^\/previews\/[a-zA-Z0-9._-]+\.(webp|png|jpe?g|avif)$/.test(src)) {
        unknown++;
        issue =
          "Asset outside the local preview allowlist; not opened or fetched";
      } else {
        if (!seen.has(src)) {
          try {
            const file = await realpath(resolve(root, "public" + src));
            if (!file.startsWith(publicRoot + sep))
              throw new Error("Symlink outside preview directory");
            const stats = await stat(file);
            if (!stats.isFile() || stats.size > 30_000_000)
              throw new Error("Unsupported file size");
            const metadata = await sharp(file, {
              limitInputPixels: 40_000_000,
            }).metadata();
            seen.set(src, {
              width: metadata.width,
              height: metadata.height,
              format: metadata.format,
              size: stats.size,
            });
            if (role === "preview") sizes.push(stats.size);
          } catch {
            seen.set(src, null);
          }
        }
        const image = seen.get(src);
        if (!image) issue = "Asset missing, unreadable, unsafe or unsupported";
        else if (
          role === "preview" &&
          (image.width !== p.image_width || image.height !== p.image_height)
        )
          issue = "Source dimensions disagree with the prompt record";
        else if (
          image.width &&
          image.height &&
          Math.abs(
            image.width / image.height - p.image_width / p.image_height,
          ) > 0.01
        )
          issue = "Thumbnail/source aspect ratios disagree";
      }
      if (issue)
        findings.push(
          finding(
            {
              rule: "image-file",
              key: `${p.id}:${role}`,
              priority: "P2",
              areas: ["SEO", "images"],
              urls: [origin + promptPath(p)],
              sources: [catalog.sources[p.id]],
              issue,
              evidence: `${role}: ${src}; expected preview ${p.image_width}×${p.image_height}.`,
              evidenceSource: "local asset metadata",
              action:
                "Review the asset and mapping; retain old assets and do not recompress or regenerate automatically.",
              benefit:
                "Prevent broken previews and layout/crop inconsistencies.",
              confidence: "high",
              uncertainty:
                "File metadata does not establish visual quality or identity accuracy.",
              complexity: "low",
              approval: "editorial",
            },
            observedAt,
          ),
        );
    }
  sizes.sort((a, b) => a - b);
  return {
    findings,
    coverage: unknown ? ("partial" as const) : ("observed" as const),
    inventory: {
      inspectedAssetFiles: seen.size,
      unknownAssetReferences: unknown,
      medianPreviewBytes: sizes[Math.floor(sizes.length / 2)] || 0,
      largestPreviewBytes: sizes.at(-1) || 0,
    },
  };
}
