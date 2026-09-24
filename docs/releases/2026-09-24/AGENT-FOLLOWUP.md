# Recommendation agent and editorial follow-up release

Owner explicitly authorized production release, Supabase content sync and live
verification on 24 September 2026, with no additional cost. This supersedes the
local-only status recorded in the earlier follow-up audit for this batch only.

## Scope and cost

Ship the deterministic recommendation agent, approved editorial corrections,
reference-photo guide, methodology, internal links, metadata and versioned-image
headers. See `docs/audits/seo-followup-2026-09-24/README.md` for the implementation
and validation history. No new dependencies or paid services were added.

GPT-6 is not required and will not be integrated under the current cost constraint.
The optional migration proposal is deferred. The public template generator stays
free and unchanged; no API credentials, paid model calls or compatibility claims.

Netlify verified before release: existing Personal plan, 955/1,000 included plan
credits remaining, 6.2 operational credits, recharge disabled. One production
deploy uses included allowance; no purchase, upgrade or billing setting change.
Remote main and the feature baseline both resolve to `bed7495` before this release.
No open user PRs were reported by the GitHub connector. No feature-branch push or
PR creation is part of this release; the owner-authorized main push triggers it.

## Supabase sync completed

The 11 target records matched the reviewed before-values. A full content-row backup
was saved privately at `.release-private/seo-followup-release/before.json` before
writing. `scripts/content/sync-seo-followup.mjs --apply` applied only approved
editorial fields using ID, timestamp and edited-field guards; each write was an
individual guarded transaction (not one atomic 11-row transaction).

Verification compared every row with the backup: 11 exact editorial changes,
175 other rows unchanged, 91 published / 95 drafts. Preview URLs, scene prompt text,
canonical ownership, publication and collection memberships were preserved.
No schema change was necessary; no fake schema-migration history entry was added.
Database-password authentication was unavailable; the existing server-side API
credential succeeded. No credentials were exposed, reset or committed.

For rollback, review the private backup and restore only these edited fields with
fresh concurrency guards. Never overwrite full rows or blindly rerun the prepare
step. The tool is deliberately separate from the recommendation-only agent.

## Validation and verification boundaries

176 unit tests, lint and content/release checks passed again before release.
The preceding local production build, 10 desktop/mobile browser checks and 232-page
local rendered audit passed. Webpack was used locally because Turbopack encountered
an environment socket/process EPERM; the deployment compiler is unchanged.

After publication verify the release commit and perform a small live smoke check:
new guide, About methodology, both sitemap children, representative metadata and
collection links, hashed-image cache headers, redirects and draft protection.
The already verified consented GA4 receipt is not a claim of field CWV success.

## Ongoing work without extra spend

- Keep using the local audit and existing Search Console/GA4 access; no paid
  crawlers, API reviewers, subscriptions or full production crawl matrices.
- Retain the 31-pair intent review and 11 shared-image assessments. No low-volume
  search evidence justifies automatic mergers, new landing pages or noindex edits.
- Review comparable complete search windows after enough post-release data exists;
  distinguish web/images and annotate this release. Recrawling and field data take
  time and cannot be completed or guaranteed during deployment.
- Tool compatibility remains explicitly unverified. Perform a genuinely documented
  trial only when an existing permitted free workflow is available; never fabricate
  model/version/date evidence or silently invoke a paid generation service.
- Revisit the remaining editorial opportunities selectively. The audit's heuristic
  backlog is not a requirement to rewrite every published prompt.

Live verification evidence belongs in the private release directory and the task's
completion report; this pre-publication document does not claim deployment success.
