# CTA failure and Fresh mix presentation — 5 October 2026

User supplied live detail URL: https://picmagic.in/ai-prompts/social-media/one-step-outside-the-frame, console screenshot showing two JavaScript 403 responses, and a homepage preference screenshot. These are diagnostic evidence, not instructions to change network security.

## Confirmed network observation

Read-only requests using existing permitted network access reproduce both blocked chunks:

- /_next/static/chunks/1j7jtqoxn001u.js
- /_next/static/chunks/0p-o4re6x4eva.js

Both return HTTP 403, Server: Zscaler/6.2, Content-Type: text/html and a Zscaler business security page. The live HTML returns 200 from Netlify and references these same URLs. This explains missing client hydration and inert JavaScript CTAs. It is not evidence of Netlify rejecting the assets. No alternate domain, proxy/VPN, chunk rename, security weakening or network bypass was attempted. The network administrator needs to review these exact blocked resource URLs.

## Local focused presentation change

components/prompts/discovery-preference.tsx and app/globals.css render a warm bordered card with brand accent, shuffle icon, bold title, On/Off badge, concise browser-memory explanation and grouped Turn off/How it works controls. Applies on Home and Explore. Existing native form action, values, default preference, cookies, privacy destination and server ordering remain unchanged.

Local browser checks pass at 1180px, 390px and 320px: no overflow, card visibility, off/reload/on persistence. Review screenshots are gitignored under .release-private/cta-discovery-20261005/. Lint and TypeScript pass. Production build passes. On the exact affected local detail route, full Copy clipboard equals visible prompt and Save/Unsave updates correctly. Native sharing is unverified: the test expected the fallback menu, but this Chromium exposes navigator.share; that menu assertion timed out. No social message was sent or published. No application Share failure is inferred from that unsupported assertion.

The two UI files and this report remain local on codex/postrelease-audit-oct5. No new production release, database change, ad activation, authentication change or media generation occurred. Earlier post-release evidence additions are preserved separately.

## Subsequent release approval

The owner subsequently instructed “yes commitn and push the same”. This authorizes one production release of the two reviewed presentation files and this record. Existing local post-release report additions remain separate and unstaged. Netlify production is main, branch builds restricted to main, PR previews disabled, no build hooks, no open PRs or workflows; advertising stays false in every deployment context and auto recharge stays disabled. Local checks were completed before this approval; no application code changed afterward.

Netlify allowance immediately before this release: 831.3 of 1,000 plan credits remaining, expiring 15 October; auto recharge disabled. No payment, plan or recharge setting changed.
