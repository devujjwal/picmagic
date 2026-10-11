# Website-informed festival prompt revision — 11 October 2026

Status: implemented and validated locally; no production release or database writes.

## Scope

- Correct the Durga Puja pandal portrait's cut-off SEO description with a complete sentence. Keep HTML, Open Graph and Twitter descriptions consistent through the existing metadata helper. Fix the originating authoring path so future long descriptions end at a word boundary.
- Revise the Diwali, Durga Puja and Dussehra business-greeting prompts and FAQs: inspect the visitor-supplied official website when the external tool can browse; return a sourced brand brief for confirmation; match its palette, typography and tone; include up to four verified features with relevant consistent icons, a clear greeting, one CTA and optional approved contact details.
- Reuse the actual authorized logo asset only when retrieval and exact placement are supported. Otherwise request an uploaded original or manual placement; never promise exact logo reproduction by image generation.
- Update the existing festival business-poster guide, keeping its slug, links, attribution and image disclosures. Preserve the other six article records.

The two attached business posters inform visual hierarchy, feature/icon rows and branded footers only. Their files, brand names, logos and service claims were not copied into public assets. No reference upload, image generation, external website scan, paid request or new dependency was performed.

## Capability and evidence boundaries

The external custom workflow is conditional on browsing and image/compositing capabilities; it does not assert that every suggested provider supports them. Missing information requires user confirmation, not fabrication. Scraped phone/address/email details are not automatically included. Uploaded assets sent to external tools are outside the browser editor's local-only privacy promise.

The PicMagic editor itself is unchanged: fixed prepared artwork and existing text/upload/layout controls, no website scanning, logo fetching, service-icon row, custom-background import or auto-posting. Historical generated previews, image briefs, media bytes, provenance and original review hashes remain unchanged. The copy and guide explicitly disclose that current previews do not demonstrate the new website-matched workflow.

The exact four prompt before/after field sets are in `changes.json`. The release-content gate connects revised prompt text to the preserved premium review hashes. `article-review.json` records the one article's permitted fields and baseline/current fingerprints; it is not a live database backup.

## Validation

- Lint, typecheck and local production build passed (159 build entries; seed content, ads disabled, analytics unset).
- 332 unit tests and 9 mocked IndexNow tests passed; no IndexNow submission occurred.
- Content, SEO, release, festival and blog checks passed: 104 published templates and 89 drafts retained, zero missing assets and zero SEO errors.
- Two local Chromium desktop/mobile tests passed: all three full prompts copy correctly, the portrait metadata is complete, and the private guide preview renders at 320, 390, 768 and 1440 pixels without horizontal overflow.
- SEO review notices rose from 47 to 50 because the three festival variants share a deliberately consistent branding workflow. These remain visible editorial overlap notices; their festival scenes, artwork and established URLs are distinct. Nothing was silently merged, hidden or deindexed.

## Pending release

Production uses Supabase; editing these seed/review records alone does not change live content. A separate authorized release must back up the exact four prompt rows and one published blog row, compare the affected old fields with the baseline, rehearse one guarded transaction and rollback, and apply only the allowed editorial fields. Preserve all publication flags, existing URLs, dates of original publication, image assets, unrelated rows and drafts. Do not import the seed article's draft/indexability flags into its published production row.

Check hosting credits and deployment controls, deploy the validated code once if needed, apply the reviewed content transaction and invalidate catalogue/blog caches, then verify live metadata, prompt text, article and sitemap dates. Advertising and affiliate monetization remain disabled. The unrelated cleanup report and earlier search-release evidence were excluded from this change.
