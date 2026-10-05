# Combined website release - 5 October 2026

The owner authorized committing and pushing the complete current local website
batch, including work from the separate AdSense review chat.

## Included

- Magic Frame branding and outlined wordmark across header, footer, favicon and
  sharing images, plus reusable social brand assets.
- Official Instagram and Facebook links: both use `picmagic.in` as their handle.
  Footer/contact anchors and Organization `sameAs` share the central configuration.
- October prompt and collection guidance, the remaining 43 prompt guides and six
  FAQ replacements, visible/schema consistency, historical example disclosures,
  and a user-reviewed mailto issue-reporting control.
- Editorial QA, draft-publication audit, private-test tooling and documentation.

## Pre-release verification

- Normal `pnpm build` using Next.js 16.3.4 Turbopack: passed, including TypeScript
  and 145 generated static pages. Local worker-port access required execution
  outside the sandbox; no Webpack substitution or build-script change was needed.
- 218 unit tests and ESLint passed.
- Content validation passed: 186 records, 91 published, 95 deferred drafts,
  zero missing images and all 50 existing canonical owners preserved.
- SEO content validation: zero errors; 42 existing editorial overlap/shared-preview
  notices remain. They are not certified fixed or an AdSense approval guarantee.
- 20 desktop/mobile production-build browser tests passed with Google services
  stubbed, covering branding, social links, guidance, evidence and reporting.
- Local tests used seed content, ads disabled and no analytics identifier.
- Netlify inspected before push: `main` auto-publishes; 897.4 included Personal
  credits remain, auto-recharge disabled, production `NEXT_PUBLIC_ADS_ENABLED=false`.

## Exclusions and safeguards

No publication flags, canonical URLs, Supabase records, database schema or ad
settings changed. The 95 drafts remain unpublished. Private identity references,
18 recognizable test outputs and account-verification screenshots remain local
and gitignored. Public-output permission and likeness acceptance are separate.
This release does not submit AdSense review, re-enable advertising or certify
real regional consent/Auto ads behavior. No paid service or additional purchase
is authorized. Netlify's automatic build and live checks must be verified after
the single push; the pre-release checks above do not claim deployment success.
