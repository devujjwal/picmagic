# PicMagic

Turn your photos into something magical.

A mobile-first photo inspiration library, guided enhancement/photo/reel prompt creators, and protected editorial studio. Public users need no account, photo upload or AI API key.

Live site: [picmagic.in](https://picmagic.in). Editorial login: [PicMagic Admin](https://picmagic.in/admin/login). See the [launch record](docs/LAUNCH.md) for verified hosting, DNS and Search Console outcomes.

Source: [private GitHub repository](https://github.com/devujjwal/picmagic). Pushes to `main` trigger Netlify's validation, build and production deployment. See [automatic deployment](docs/DEPLOYMENT.md#automatic-deployment-from-github) for the workflow and recovery steps.

## Run locally

Use Node 22 (`nvm use`) and the pinned pnpm version.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

The explicit `CONTENT_SOURCE=seed` setting runs the public catalog locally. Use the port printed by Next.js. Configure Supabase to use the real admin studio.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm check:content
```

Browser tests use `http://localhost:3002` by default; override `E2E_BASE_URL` for another server. Run against a disposable local backend for admin mutation tests.

See [deployment and Search Console setup](docs/DEPLOYMENT.md), [architecture](docs/ARCHITECTURE.md), and [implementation/verification report](docs/IMPLEMENTATION.md).

The production origin is `https://picmagic.in`. AdSense is configured with CMP-controlled manual placements; Google site review is pending. GA4 remains disabled. See [AdSense operations](docs/ADSENSE.md) for status and activation checks.
