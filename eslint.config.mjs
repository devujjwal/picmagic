import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
export default defineConfig([
  ...next,
  ...ts,
  globalIgnores([
    ".next/**",
    ".next-release/**",
    ".next-adsense-october/**",
    ".next-targeted/**",
    ".next-blog-qa/**",
    ".next-blog-preview/**",
    ".next-affiliate-qa/**",
    ".next-festival-qa/**",
    ".next-festival-final/**",
    ".next-premium-qa/**",
    ".next-premium-build/**",
    ".netlify/**",
    ".release-private/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
