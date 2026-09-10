import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const script = resolve("scripts/ignore-build.mjs");
const directory = mkdtempSync(join(tmpdir(), "picmagic-build-policy-"));
const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: directory, encoding: "utf8" }).trim();
const refs: string[] = [];
function commit(message: string) {
  git("add", ".");
  git("commit", "-qm", message);
  refs.push(git("rev-parse", "HEAD"));
}
function decision(base?: string, head?: string) {
  return spawnSync(process.execPath, [script], {
    cwd: directory,
    env: {
      ...process.env,
      CACHED_COMMIT_REF: base || "",
      COMMIT_REF: head || "",
    },
  }).status;
}
beforeAll(() => {
  git("init", "-q");
  git("config", "user.email", "devujjwal1989@gmail.com");
  git("config", "user.name", "Ujjwal Paul");
  mkdirSync(join(directory, "docs"));
  writeFileSync(join(directory, "README.md"), "Initial documentation");
  writeFileSync(join(directory, "app.ts"), "export const version = 1;");
  commit("Initial");
  writeFileSync(join(directory, "docs/operations.md"), "Release notes");
  commit("Documentation");
  writeFileSync(join(directory, "app.ts"), "export const version = 2;");
  commit("Application");
  writeFileSync(join(directory, "docs/operations.md"), "New release notes");
  commit("More documentation");
  git("mv", "app.ts", "docs/archived.md");
  commit("Code removal disguised as a documentation rename");
  writeFileSync(join(directory, "docs/fixture.json"), "{}");
  commit("Validation fixture");
});
afterAll(() => rmSync(directory, { recursive: true, force: true }));
describe("Netlify deployment budget policy", () => {
  it("skips only documentation-only changes", () =>
    expect(decision(refs[0], refs[1])).toBe(0));
  it("builds application changes", () =>
    expect(decision(refs[1], refs[2])).toBe(1));
  it("includes earlier unbuilt code even when the latest commit is documentation", () =>
    expect(decision(refs[1], refs[3])).toBe(1));
  it("builds when code is renamed into documentation", () =>
    expect(decision(refs[3], refs[4])).toBe(1));
  it("builds changes to validation fixtures under docs", () =>
    expect(decision(refs[4], refs[5])).toBe(1));
  it("allows forced same-commit rebuilds for environment changes", () =>
    expect(decision(refs[1], refs[1])).toBe(1));
  it("continues when the comparison is missing or unavailable", () => {
    expect(decision(undefined, refs[1])).toBe(1);
    expect(decision("f".repeat(40), refs[1])).toBe(1);
    expect(decision("--help", refs[1])).toBe(1);
  });
});
