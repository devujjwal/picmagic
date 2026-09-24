import { mkdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import { resolve, sep, dirname } from "node:path";

export async function readJson(file: string) {
  const actual = await realpath(file);
  if (!actual.endsWith(".json") || (await stat(actual)).size > 20_000_000)
    throw new Error("Imports must be JSON files below 20 MB");
  return JSON.parse(await readFile(actual, "utf8")) as unknown;
}

/** Reports can only be created in a new ignored, private directory. Never overwrite. */
export async function writeReports(
  root: string,
  run: string,
  files: Record<string, string>,
) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(run) || run.includes(".."))
    throw new Error("Output must be a simple run name");
  const repo = await realpath(root),
    privateDir = resolve(repo, ".release-private");
  await mkdir(privateDir, { recursive: true, mode: 0o700 });
  if ((await realpath(privateDir)) !== privateDir)
    throw new Error("Private report directory must not be a symlink");
  const base = resolve(privateDir, "optimization");
  await mkdir(base, { recursive: true, mode: 0o700 });
  if ((await realpath(base)) !== base)
    throw new Error("Report directory must not be a symlink");
  const out = resolve(base, run);
  if (!out.startsWith(base + sep)) throw new Error("Unsafe output directory");
  for (const name of Object.keys(files))
    if (!/^[a-z-]+\.(json|md)$/.test(name))
      throw new Error("Unsafe report filename");
  await mkdir(out, { mode: 0o700 }); // EEXIST is intentional, including for symlinks.
  for (const [name, content] of Object.entries(files)) {
    const target = resolve(out, name);
    if (dirname(target) !== out) throw new Error("Unsafe report target");
    await writeFile(target, content, { flag: "wx", mode: 0o600 });
  }
  return out;
}
