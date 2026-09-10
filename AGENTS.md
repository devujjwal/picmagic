<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Hosting and release budget

The owner requires zero hosting spend. Keep Netlify Free and automatic top-ups off; do not add payment details, buy credits, upgrade, or activate paid trials without a new explicit instruction. See `docs/FREE-HOSTING.md` for the verified account state and limits.

Each successful production deploy consumes credits. Complete the authorized batch and run checks locally before pushing to `main` once. Do not deploy incremental fixes while still implementing the same batch. Use local production builds with Google ads/analytics stubbed for full browser tests, then minimal production smoke checks. Check the remaining team allowance before a release. Main remains connected to automatic deployment; documentation-only changes are handled by the ignore-build policy.
