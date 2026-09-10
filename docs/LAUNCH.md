# PicMagic launch record

Last updated: 10 September 2026. Launch validation is in progress; this record is not a completion claim.

## Dedicated services

- Netlify Free project: `picmagic-in`, ID `2b145a4c-9cf9-4e4d-985c-ad52357569f0`, team `devujjwal`.
- Supabase Free project: `PicMagic`, reference `lxecbrvzpmgjmsqiachc`, Mumbai (`ap-south-1`). Schema migrated and 50 prompts imported.
- The user authorized pausing `VS-MJR Infotech` (`zbohtifndwvokmeewsne`) to free a Supabase slot. It is paused. `telecotrade` was left online.
- Netlify auto top-up is false, no payment method was added, and the plan has a hard Free allowance. Default usage warnings go to the owner at 50%, 75% and 100% usage. Ads and GA4 are disabled.
- Public operator: Ujjwal Paul. Contact: devujjwal1989@gmail.com.

## Access

Owner email/password login and admin membership were verified against the hosted Supabase project. Anonymous writes and public signup are rejected. Global signup is disabled, minimum password length is 12, secure password changes are enabled, and the storage limit is 10 MiB. RLS protects content and Storage writes.

The generated owner password is in `.env.admin.local` (mode 0600, ignored by Git) on the owner’s Mac. Database and provisioning credentials are in `.env.production.local` (mode 0600, ignored by Git). No service-role key or password was imported into Netlify. Keep these files private and rotate the administrator password through Supabase Auth when handing over credentials.

## DNS and Google

GoDaddy remains the DNS provider. The apex parking record was replaced with Netlify’s documented A record `75.2.60.5`; `www` now points to `picmagic-in.netlify.app`. Existing NS, SOA, `_domainconnect` and `_dmarc` records were preserved. No domain renewal or paid add-on was purchased.

Google Search Console domain property `picmagic.in` was verified in `devujjwal1989@gmail.com` using Google’s supplied DNS TXT record. Keep that record in DNS. Sitemap submission and representative live URL inspections await the final indexable HTTPS release.

## Hosted validation

The initial preview surfaced a macOS-to-Linux native Sharp packaging error. `pnpm-workspace.yaml` now includes Linux x64 dependencies; the rebuilt function contains the Linux Sharp binding and libvips. The corrected preview is being validated. Local lab and database acceptance evidence remains in `docs/qa`.
