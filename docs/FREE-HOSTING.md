# Free hosting budget and release policy

## Vercel hosting and pending Netlify retirement — October 18, 2026

The owner authorized moving PicMagic to the existing Vercel **Hobby** scope
`devujjwals-projects` and retiring Netlify only after live verification. Current
migration evidence and DNS rollback values are in
`docs/audits/vercel-migration-2026-10-18.md`. The September account snapshots below
are historical, not the current subscription state.

- Zero new hosting spend remains mandatory: no Pro trial, paid upgrade, payment
  details, purchased credits or paid add-ons.
- Hobby is limited to personal, non-commercial use. The owner currently states
  no ads/non-profit use; reassess eligibility before ads, affiliate links or other
  commercial use. No advertising or affiliate activation is part of migration.
- Hobby resources are shared with the owner's other projects. Verified dashboard
  before migration: 56m59s/4 CPU-hours, 3.1/100 GB transfer, 81K/1M function
  invocations, 99K/1M CDN requests. These are a snapshot, not a traffic guarantee.
- Netlify automatic builds have been **stopped**; the existing published site is
  retained while old DNS caches expire and pending permanent-deletion confirmation.
  Vercel deployment `3fef809` is ready, both custom domains have valid HTTPS and
  the website DNS points to Vercel. See the audit for propagation limitations.
  Branch deploys and Deploy
  Previews were already disabled, with no build hooks. GitHub has no workflows or
  open PRs for this repository.
- Vercel Git-triggered builds are disabled in `vercel.json` during migration.
  Deploy only a clean, validated tracked snapshot; never deploy the dirty working
  directory, local environment files or `.release-private`.
- Netlify still shows a Personal subscription and an overdue **$9 invoice**.
  Moving/deleting the project does not settle the invoice or prove cancellation
  of its team subscription. No payment is authorized.

Official sources checked October 18: [Hobby allowance and limits](https://vercel.com/docs/plans/hobby)
and [personal/non-commercial fair use](https://vercel.com/docs/limits/fair-use-guidelines).
Exceeding free allowances may interrupt service; never upgrade automatically.

## Verified account state — September 10, 2026

Netlify team `devujjwal`, project `picmagic-in`:

- Plan: **Free**, $0, 300 credits per monthly cycle. No Pro/Enterprise trial.
- Automatic top-ups: **disabled**. No credit card saved. No invoices or paid receipts.
- Dashboard cycle: September 10–October 9; credits expire/refresh October 10, 2026 (provider timezone).
- Before this release: **228.3 credits used, 71.7 remaining**. Metering can be delayed.
- Production deployments: **13 = 195 credits**; web requests: 23,029 = 4.6 credits; compute: 19.9 credits; bandwidth: 8.8 credits; AI inference: 0.
- The 50% email was an earlier usage notification, not an invoice. The additional configurable alert is set to 75%; Netlify also provides threshold notifications.

On Free, credits have a hard limit. Exhaustion pauses projects until the next cycle; it does not authorize paid overages. Never upgrade the plan, add payment details, enable top-ups, buy credits, or activate a paid trial without a separate explicit user instruction. This policy cannot guarantee uninterrupted service within a finite free allowance. Credits are shared across the team.

## Changes in this release

1. Public navigation uses `components/ui/site-link.tsx`, which sets `prefetch={false}`. The measured production homepage baseline made **51 speculative RSC requests** during one scripted scroll. The local production-build browser regression measured **zero speculative page requests** on both desktop and mobile, and verified that a real click still opens a prompt. Pages retain crawlable anchors and Next.js client navigation; the tradeoff is fetching the destination on click instead of beforehand.
2. `scripts/ignore-build.mjs` skips documentation-only builds conservatively. Other changes still receive the full validation pipeline. It compares the entire diff from Netlify's cached build commit, not only the last commit, and recognizes code deletion even when Git would otherwise classify it as a rename into documentation.
3. Prepare and test complete batches locally, then push once to `main`. Do not push successive small fixes to production during implementation. The requested single production release costs **15 additional credits**, plus metered traffic/compute. No extra production release is needed for a QA report.

The existing CSP nonce and Google CMP consent architecture are preserved. HTML requires fresh nonces and cannot be shared through a CDN HTML cache; never reuse a nonce to reduce cost. Catalog data remains cached and publishing invalidates it. Static assets remain CDN-served. Do not run full crawls, Lighthouse matrices, or repeated browser suites against production; use an isolated local production build with Google services stubbed, followed by a minimal live smoke check. Avoid clicking or generating test ad impressions.

Validation before the single release: ESLint, TypeScript, 69 unit tests, 54 desktop/mobile browser checks, content validation and the isolated production build passed. Google libraries were stubbed during automated browser checks; these checks do not establish actual Google ad fill or approval.

## Operating within the allowance

- Check the [team credit breakdown](https://app.netlify.com/teams/devujjwal/billing/general#credit-usage-breakdown) before a production release. Treat figures as delayed, leave room for traffic, and batch work. Do not treat the entire balance as a deployment budget.
- Work on a development branch and validate locally. Main remains the automatic production release branch; the existing GitHub webhook is retained.
- Use PicMagic's admin publishing for ordinary editorial updates. This refreshes content without a code deployment; normal request/compute usage still applies.
- At the 75% warning, defer nonessential production releases and inspect which usage category is growing. Pause build automation if releases are accidental; stopping builds does not stop visitor consumption or take the currently published site offline.
- If credits run out, keep the no-payment rule and wait for the reset. A hosting migration would be a separate reviewed change with its own current free-tier limits, commercial-use terms, DNS and consent/security verification. Do not promise that changing hosts removes all limits.
- Netlify deployment previews are free to deploy, but serving previews is not unmetered. No automatic paid purchases or paid monitoring service is introduced by this change.

Sources verified September 10, 2026: [Free plan and credit hard limits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [credit accounting](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/), [Free-plan exhaustion](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/), [ignore commands and exit codes](https://docs.netlify.com/build/configure-builds/ignore-builds/). Repository-local Next.js prefetching and CSP documentation was checked before implementation.

## Owner-authorized Personal plan — September 15, 2026
The owner independently upgraded and explicitly approved the reviewed release. Live dashboard verification: Personal $9/month, 1,000 of 1,000 plan credits available (expires October 15, 2026), plus 25.1 operational credits (expires October 10). Auto recharge is Disabled. The top billing-period label still shows Aug 15–Sep 14; the individual new credit grant is dated September 15. Use the explicit credit-expiry dates rather than assuming a reset from the stale header. No plan, payment or recharge settings were changed by the agent. Historical Free-plan observations above are retained as history. No further purchase or upgrade is authorized.
