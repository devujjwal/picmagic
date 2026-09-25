# PicMagic crawler-accessibility audit

**Audit date:** 25 September 2026

**Production origin:** `https://picmagic.in`

**Audited deployment:** `5ab912ac8591501a3460c0433d7554bcd8f23849`

**Disposition:** no production change recommended from the evidence currently available

> Point-in-time audit of the deployment named above, not a continuing uptime or
> crawler-access guarantee. The temporary raw-data paths below are local audit
> artifacts, not repository dependencies; the per-request summary is preserved in
> this document. Retaining this report does not authorize its proposed follow-up
> requests or any production changes.

## 1. Executive finding

No site-level crawler block was reproduced. Eight production URLs were requested with seven User-Agent profiles using both `GET` and `HEAD`; all **112 of 112 requests returned HTTP 200**. Twelve additional homepage requests also returned 200, including requests labelled `Perplexity-User`.

The independent web reader that prompted this audit still failed on the homepage, `robots.txt`, a prompt detail page and the `www` hostname. It did not expose an HTTP status, block reason or transport error. The failure therefore remains unexplained. Changing production configuration now would be speculative and could reduce security or availability without addressing the actual cause.

User-Agent strings in this audit were simulated. The requests did not originate from the providers' verified crawler address ranges, so the results establish response parity for the tested request headers and network path, not guaranteed reachability from every crawler network.

## 2. Scope and decision standard

The audit asked whether PicMagic's production site denies ordinary crawlers or AI discovery agents through robots policy, application behaviour, Netlify controls, DNS, redirects, TLS, rendering, caching or its Supabase dependency.

The tested routes cover the discovery surface and representative dynamic HTML:

- `/`
- `/robots.txt`
- `/sitemap.xml`
- `/ai-prompts/women`
- `/collections/creative-transformations`
- `/ai-prompts/couple/barefoot-at-blue-hour`
- `/ai-prompts/kids/tiny-krishna-big-wonder`
- `/ai-prompts/men/katana-in-the-square-of-light`

A root cause is treated as confirmed only when a failing request can be tied to a specific response, rule, dependency failure or network event. A plausible code path or timing correlation is classified as possible, not confirmed.

## 3. Method and evidence boundaries

The primary matrix ran from `2026-09-25T04:13:36.243420Z` through `2026-09-25T04:14:27.777850Z`. Each route was tested with Browser, Generic, Googlebot, Bingbot, PerplexityBot, OAI-SearchBot and GPTBot profiles. For each profile, the audit recorded a `GET` and a `HEAD` response, including status, effective URL, remote IP, HTTP version, redirect count, TLS verification result, DNS/connect/TLS/TTFB/total timings, download size, content type, selected headers and—for `GET`—H1, canonical, robots metadata and extracted visible text.

The follow-up sequence made 12 more homepage `GET` requests across Browser, PerplexityBot, OAI-SearchBot and Perplexity-User profiles. A semantic comparison checked extracted text across User-Agents. The sitemap index and both child sitemaps were fetched. Source inspection covered robots generation, metadata delivery, redirects, caching and the Supabase catalog path. Netlify dashboard controls and the published deployment were inspected separately.

Evidence limitations:

- User-Agent spoofing does not prove what a verified provider network sees.
- This machine was behind Zscaler HTTPS inspection, so `ssl_verify_result: 0` validates the intercepted connection rather than independently validating the public certificate chain.
- `curl -6` returned an IPv4-mapped address; native IPv6 transport was not established.
- The independent reader supplied no status code, timestamped request identifier or detailed error.
- No live Supabase outage or production cold-cache failure was injected.
- Dashboard observations do not exclude Netlify's built-in network protection, which can block traffic without an Observability record.

The complete machine-readable records remain at `/tmp/picmagic-crawler-audit-20260925/matrix.json` and `/tmp/picmagic-crawler-audit-20260925/repeats.json` on the audit machine. The compact per-request table in section 4 preserves the result, TTFB, total time and body size for every matrix request.

## 4. Request results and full measurement matrix

Every route/User-Agent pair succeeded for both methods:

| Route                         | Browser | Generic | Googlebot | Bingbot | PerplexityBot | OAI-SearchBot | GPTBot |
| ----------------------------- | ------- | ------- | --------- | ------- | ------------- | ------------- | ------ |
| Homepage                      | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| `robots.txt`                  | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| `sitemap.xml`                 | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| Women category                | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| Creative Transformations      | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| Barefoot at blue hour         | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| Tiny Krishna, big wonder      | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |
| Katana in the Square of Light | ✓       | ✓       | ✓         | ✓       | ✓             | ✓             | ✓      |

Each ✓ represents a successful `GET` and `HEAD`. In the detailed table, `GET` values are `status / TTFB ms / total ms / bytes`; `HEAD` values are `status / TTFB ms / total ms`. A zero-byte `HEAD` body is expected and omitted.

| Path                                            | User-Agent profile |                        GET |              HEAD |
| ----------------------------------------------- | ------------------ | -------------------------: | ----------------: |
| `/`                                             | Browser            | 200 / 5630 / 5656 / 172686 | 200 / 5592 / 5592 |
| `/`                                             | Generic            | 200 / 1488 / 1519 / 172686 | 200 / 1572 / 1573 |
| `/`                                             | Googlebot          |   200 / 843 / 876 / 172686 | 200 / 1211 / 1212 |
| `/`                                             | Bingbot            | 200 / 1084 / 1107 / 172686 | 200 / 1361 / 1362 |
| `/`                                             | PerplexityBot      |   200 / 778 / 904 / 172686 |   200 / 703 / 703 |
| `/`                                             | OAI-SearchBot      | 200 / 1347 / 1381 / 172686 | 200 / 1684 / 1684 |
| `/`                                             | GPTBot             |   200 / 701 / 732 / 172686 |   200 / 495 / 495 |
| `/robots.txt`                                   | Browser            |    200 / 1236 / 1238 / 107 | 200 / 1073 / 1073 |
| `/robots.txt`                                   | Generic            |      200 / 181 / 182 / 107 |   200 / 130 / 130 |
| `/robots.txt`                                   | Googlebot          |    200 / 1220 / 1222 / 107 |   200 / 727 / 728 |
| `/robots.txt`                                   | Bingbot            |      200 / 518 / 519 / 107 |   200 / 219 / 221 |
| `/robots.txt`                                   | PerplexityBot      |      200 / 218 / 220 / 107 |   200 / 327 / 328 |
| `/robots.txt`                                   | OAI-SearchBot      |      200 / 134 / 134 / 107 | 200 / 1475 / 1475 |
| `/robots.txt`                                   | GPTBot             |    200 / 1206 / 1206 / 107 |   200 / 134 / 136 |
| `/sitemap.xml`                                  | Browser            |      200 / 874 / 875 / 254 | 200 / 1108 / 1110 |
| `/sitemap.xml`                                  | Generic            |      200 / 141 / 141 / 254 |   200 / 142 / 142 |
| `/sitemap.xml`                                  | Googlebot          |      200 / 860 / 860 / 254 | 200 / 1035 / 1035 |
| `/sitemap.xml`                                  | Bingbot            |      200 / 223 / 226 / 254 |   200 / 188 / 188 |
| `/sitemap.xml`                                  | PerplexityBot      |      200 / 592 / 593 / 254 |   200 / 639 / 641 |
| `/sitemap.xml`                                  | OAI-SearchBot      |    200 / 1143 / 1146 / 254 | 200 / 1007 / 1018 |
| `/sitemap.xml`                                  | GPTBot             |      200 / 127 / 127 / 254 |   200 / 143 / 144 |
| `/ai-prompts/women`                             | Browser            |  200 / 1309 / 1416 / 84264 | 200 / 1055 / 1056 |
| `/ai-prompts/women`                             | Generic            |    200 / 864 / 881 / 84264 | 200 / 1193 / 1195 |
| `/ai-prompts/women`                             | Googlebot          |  200 / 1130 / 1143 / 84264 | 200 / 1268 / 1269 |
| `/ai-prompts/women`                             | Bingbot            |    200 / 741 / 759 / 84264 |   200 / 686 / 687 |
| `/ai-prompts/women`                             | PerplexityBot      |  200 / 1249 / 1298 / 84264 |   200 / 945 / 949 |
| `/ai-prompts/women`                             | OAI-SearchBot      |    200 / 707 / 727 / 84264 |   200 / 907 / 908 |
| `/ai-prompts/women`                             | GPTBot             |    200 / 805 / 821 / 84264 |   200 / 994 / 995 |
| `/collections/creative-transformations`         | Browser            |   200 / 849 / 878 / 132014 |   200 / 829 / 830 |
| `/collections/creative-transformations`         | Generic            | 200 / 1399 / 1449 / 132014 | 200 / 1196 / 1197 |
| `/collections/creative-transformations`         | Googlebot          |   200 / 762 / 785 / 132014 | 200 / 1313 / 1314 |
| `/collections/creative-transformations`         | Bingbot            |   200 / 807 / 830 / 132014 |   200 / 665 / 666 |
| `/collections/creative-transformations`         | PerplexityBot      | 200 / 1352 / 1375 / 132014 |   200 / 945 / 946 |
| `/collections/creative-transformations`         | OAI-SearchBot      |   200 / 766 / 882 / 132014 |   200 / 958 / 959 |
| `/collections/creative-transformations`         | GPTBot             | 200 / 1205 / 1251 / 132014 | 200 / 1030 / 1031 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | Browser            |    200 / 747 / 769 / 99781 | 200 / 1014 / 1022 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | Generic            |    200 / 780 / 799 / 99781 | 200 / 1007 / 1008 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | Googlebot          |    200 / 881 / 895 / 99781 |   200 / 872 / 874 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | Bingbot            |    200 / 735 / 751 / 99781 |   200 / 701 / 702 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | PerplexityBot      |  200 / 1364 / 1389 / 99781 | 200 / 1336 / 1337 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | OAI-SearchBot      |  200 / 1206 / 1223 / 99781 | 200 / 1012 / 1014 |
| `/ai-prompts/couple/barefoot-at-blue-hour`      | GPTBot             |    200 / 765 / 782 / 99781 |   200 / 905 / 906 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | Browser            |    200 / 739 / 756 / 97222 | 200 / 1193 / 1194 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | Generic            |    200 / 750 / 779 / 97222 | 200 / 1058 / 1060 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | Googlebot          |  200 / 1180 / 1207 / 97222 |   200 / 937 / 938 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | Bingbot            |  200 / 1128 / 1147 / 97222 | 200 / 1092 / 1094 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | PerplexityBot      |    200 / 838 / 854 / 97222 |   200 / 937 / 938 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | OAI-SearchBot      |  200 / 1319 / 1338 / 97222 | 200 / 1018 / 1018 |
| `/ai-prompts/kids/tiny-krishna-big-wonder`      | GPTBot             |    200 / 719 / 738 / 97222 |   200 / 670 / 672 |
| `/ai-prompts/men/katana-in-the-square-of-light` | Browser            | 200 / 1314 / 1336 / 101338 | 200 / 1367 / 1368 |
| `/ai-prompts/men/katana-in-the-square-of-light` | Generic            |   200 / 719 / 737 / 101338 |   200 / 693 / 694 |
| `/ai-prompts/men/katana-in-the-square-of-light` | Googlebot          | 200 / 1227 / 1244 / 101338 | 200 / 1033 / 1034 |
| `/ai-prompts/men/katana-in-the-square-of-light` | Bingbot            |   200 / 731 / 759 / 101338 |   200 / 967 / 968 |
| `/ai-prompts/men/katana-in-the-square-of-light` | PerplexityBot      |   200 / 733 / 761 / 101338 |   200 / 747 / 748 |
| `/ai-prompts/men/katana-in-the-square-of-light` | OAI-SearchBot      | 200 / 1168 / 1187 / 101338 | 200 / 1121 / 1122 |
| `/ai-prompts/men/katana-in-the-square-of-light` | GPTBot             |   200 / 884 / 910 / 101338 |   200 / 903 / 904 |

Across the matrix, TTFB ranged from 127 ms to 5.630 s and total time from 127 ms to 5.656 s. The matrix used one observed remote address, `75.2.60.5`, with zero redirects on canonical URLs. The separate 12-request homepage run also returned 200 throughout, with identical 172,686-byte bodies, TTFB from 807 ms to 3.015 s and totals from 893 ms to 3.083 s.

## 5. HTML, metadata and response parity

All tested HTML responses contained useful initial HTML without JavaScript execution. Extracted text was identical across the seven User-Agent profiles for each route. The tested pages returned their expected H1, canonical URL and `index, follow` metadata:

| Route                                   | H1                                      | Canonical                              | Visible text characters |
| --------------------------------------- | --------------------------------------- | -------------------------------------- | ----------------------: |
| `/`                                     | See yourself in a story worth creating. | `https://picmagic.in`                  |                   3,229 |
| `/ai-prompts/women`                     | Women photo ideas                       | `https://picmagic.in/ai-prompts/women` |                   3,060 |
| `/collections/creative-transformations` | Creative transformations                | matching canonical route               |                   4,022 |
| Barefoot at blue hour                   | Barefoot at blue hour                   | matching canonical route               |                   6,518 |
| Tiny Krishna, big wonder                | Tiny Krishna, big wonder                | matching canonical route               |                   7,719 |
| Katana in the Square of Light           | Katana in the Square of Light           | matching canonical route               |                   7,396 |

The tested evidence rules out JavaScript-only core content and does not show CSP preventing ordinary HTML retrieval. Per-request CSP nonces caused expected response-level differences, but the extracted page content did not vary by User-Agent.

## 6. Robots and sitemap policy

Production `robots.txt` returned HTTP 200 and contained:

```text
User-Agent: *
Allow: /
Disallow: /api/

Host: https://picmagic.in
Sitemap: https://picmagic.in/sitemap.xml
```

PerplexityBot, Perplexity-User, OAI-SearchBot, GPTBot, Googlebot and Bingbot have no more-specific group, so they inherit the wildcard permission. The repository's `app/robots.ts` expresses the same rule.

The sitemap index returned HTTP 200 and listed `https://picmagic.in/sitemap-pages.xml` and `https://picmagic.in/sitemap-images.xml`. Both child sitemaps also returned 200 during the audit. An `llms.txt` file would not repair a transport or provider-network failure and is not recommended as a fetch remedy.

**Conclusion: crawler access is confirmed allowed by the observed robots policy.**

## 7. Netlify controls and network protection

The inspected Netlify dashboard showed:

- no active firewall rules;
- no active rate limits;
- WAF disabled;
- password protection off; and
- published deployment commit `5ab912ac8591501a3460c0433d7554bcd8f23849`.

These observations and the successful matrix rule out an explicit configured site firewall, rate-limit or password gate within the inspected state and samples. They do not prove that every source network can reach the site. Netlify documents built-in network protection and notes that some blocked requests may not appear in Observability: [Netlify block-reason reference](https://docs.netlify.com/manage/monitoring/observability/reference/block-reason/).

## 8. DNS, redirects, TLS and IP-family limits

Google and Cloudflare DNS agreed on apex IPv4 `75.2.60.5`. No apex AAAA record was observed. HTTP, `www` and the Netlify hostname redirected to the canonical HTTPS apex without loops in the tested paths. Canonical matrix requests had zero redirects.

Public TLS validation was not independently established from this machine because Zscaler intercepted HTTPS. The successful local verification proves the inspected client trusted that intercepted chain. It does not prove the public chain as seen from an un-intercepted external network. Native IPv6 was likewise not tested: the attempted `curl -6` path returned an IPv4-mapped address.

These limitations do not demonstrate a fault; they define two checks that should be repeated from an independent, non-intercepted network.

## 9. Rendering and caching interpretation

The application is dynamically rendered. `app/layout.tsx` calls the request-time `headers()` API to read a CSP nonce, which opts the route into dynamic rendering. `next.config.ts` sets `htmlLimitedBots: /.*/`; in the installed Next.js version this disables streaming metadata for every User-Agent and supplies metadata in blocking HTML. It is not an AI-crawler deny list. See the [Next.js `htmlLimitedBots` documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots).

Observed HTML responses used `Cache-Control: private, no-store`. That header controls reuse of the HTML response; it is not a crawler access prohibition. Separately, `lib/content.ts` wraps the catalog in Next.js `unstable_cache` with `revalidate: 3600`, so catalog data has a one-hour Data Cache lifetime even though the final HTML is not publicly cacheable.

## 10. Supabase dependency and resilience risk

Production uses `SupabaseRepository`. A catalog cache miss starts three database queries concurrently: published prompts, categories and active collections. If any query reports an error, `getCatalog()` logs a redacted code and throws `The library is temporarily unavailable. Please try again.` There is no repository-level timeout and no automatic production fallback to the bundled seed catalog.

Source-level failure testing confirmed the throwing path. Existing valid cached catalog data can continue to support rendering, including Next.js stale-data behaviour during a failed revalidation. A truly uncached or unusable-cache request remains dependent on Supabase success. The homepage's empty-library presentation does not catch this thrown repository error.

This is a real resilience risk, not a confirmed explanation for the independent reader failure. No live database failure was observed, and the audit did not establish whether a production fault would surface as an HTTP 500 or as an error after response streaming had begun.

## 11. Candidate causes ranked by evidence

| Candidate explanation                                                        | Classification                                           | Evidence                                                                                                                                                                                         |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fetch-provider policy, network path or infrastructure filtering              | **POSSIBLE**                                             | The independent reader failed even on static `robots.txt` while all requests from the audited path succeeded. No provider error detail is available.                                             |
| Fetcher timeout during a slow response                                       | **POSSIBLE**                                             | A separate initial homepage TTFB was 8.76 s; the matrix maximum was 5.63 s. Most later HTML responses were about 0.7–1.4 s. Zscaler prevents attributing the whole delay to Netlify or PicMagic. |
| Supabase failure on a cold catalog-cache miss                                | **POSSIBLE**                                             | The uncaught failure path exists, but no live dependency failure was observed. It also does not directly explain failure on static `robots.txt`.                                                 |
| General DNS or redirect fault                                                | **UNLIKELY**                                             | Public resolvers agreed, canonical redirects completed and all matrix requests reached the expected origin.                                                                                      |
| Explicit robots denial, configured site WAF or User-Agent-specific rejection | **RULED OUT within inspected configuration and samples** | Live robots policy, dashboard state, response parity and 112 successful requests.                                                                                                                |
| JavaScript-only content or CSP preventing ordinary HTML retrieval            | **RULED OUT for tested responses**                       | Meaningful, canonical, indexable HTML arrived without script execution.                                                                                                                          |

No candidate meets the evidence threshold for a confirmed root cause.

## 12. Next steps, verification and change boundaries

1. Repeat a small sample—homepage, `robots.txt` and one prompt detail—from an existing independent network without HTTPS interception. Record public TLS validation and genuine IPv4/IPv6 behaviour. The risk is minimal request traffic.
2. Reproduce the original provider failure with an exact UTC timestamp and affected URL. Correlate that timestamp with Netlify requests and request IDs. If the request is absent, prepare a support packet for the fetch provider and Netlify, but do not send it automatically. Redact credentials, cookies and unrelated traffic.
3. If independent tests confirm server-side delay, investigate function cold starts and Supabase cache misses before proposing bounded timeouts or fallback data. Any eventual change must account for stale-content and premature-timeout risk.
4. Consider firewall or DNS changes only after identifying a specific failing rule, address or transport path. Unfocused changes risk unnecessary exposure or an availability regression.
5. Preserve the current CSP, proxy behaviour, `Cache-Control`, Next.js configuration and `robots.txt` unless new evidence identifies one of them as causal. Do not add `llms.txt` as a transport workaround.

Success is not another spoofed User-Agent 200 response from the already-successful audit machine. Verification requires successful ordinary HTML retrieval from the previously failing environment, or a provider-supplied error/block reason that identifies the responsible layer.

This audit authorized documentation only. It made no production-setting, application, database, DNS, firewall, content-ordering or deployment change. Existing uncommitted work remains outside this report.
