import { execFileSync } from "node:child_process";

// Netlify runs this before installing dependencies: use only Node built-ins.
// Exit 0 skips a build; exit 1 continues. Uncertainty must never hide a release.
const { CACHED_COMMIT_REF: base, COMMIT_REF: head } = process.env;
if (!base || !head || base === head || !/^[a-f0-9]{40}$/i.test(base))
  process.exit(1);
if (!/^[a-f0-9]{40}$/i.test(head)) process.exit(1);

try {
  const files = execFileSync(
    "git",
    ["diff", "--no-renames", "--name-only", "-z", base, head, "--"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  )
    .split("\0")
    .filter(Boolean);
  // Only prose is ignored. JSON QA fixtures and all unknown files still build.
  const proseOnly =
    files.length > 0 &&
    files.every(
      (file) =>
        ["README.md", "AGENTS.md"].includes(file) ||
        (file.startsWith("docs/") && file.endsWith(".md")),
    );
  console.log(
    proseOnly
      ? "Skipping documentation-only deployment."
      : "Building application or validation changes.",
  );
  process.exit(proseOnly ? 0 : 1);
} catch {
  console.log("Cannot establish changed files; continuing the build.");
  process.exit(1);
}
