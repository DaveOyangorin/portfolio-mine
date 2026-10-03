# Portfolio SEO and measurement

The portfolio keeps its existing pages, copy, headings, sections, design, and
layout. SEO work belongs in metadata, technical delivery, measurement, and
private reports. There is no content generator or automatic implementation step.

## Implemented

- Production canonicals, sitemap URLs, and internal project links use trailing
  slashes consistently. Existing slugs are preserved.
- Existing page titles and descriptions are retained. Meta keywords are removed.
- Project social previews use the existing 1200×630 PNG instead of declaring
  incorrect dimensions for individual logos. Twitter image alt text is included.
- JSON-LD identifies the person, website, and current page. Project details have
  a CreativeWork and breadcrumbs matching the existing visible breadcrumb.
  Past employers are no longer declared as current employers. Schema images use
  optimized WebP assets, and JSON is escaped safely.
- The sitemap contains every existing indexable route and excludes the 404.
  Production robots allows crawling and points to the sitemap index. Local dev
  and Vercel preview builds block crawling and include `noindex` metadata.
- The existing responsive WebP pipeline, dimensions, alt text, and priority hero
  image are retained. Below-the-fold homepage cards are lazy-loaded. The main
  font is preloaded; prefetch runs on hover instead of downloading pages as their
  links enter the viewport. Existing motion and styling are preserved.
- Optional GA4 tracks page views, existing contact/project/download clicks, and
  LCP, INP, and CLS. Google scripts load after page load during an idle period.
- Audits check metadata, canonicals, robots, sitemap coverage, JSON-LD references,
  image files/dimensions, internal links/anchors, orphan pages, and content policy.
- Reports collect Google search queries, clicks, impressions, CTR, average
  position, organic GA4 sessions/engagement/key events, and Google index inspection.
  PageSpeed/CrUX and AI analysis are optional.

## Public measurement setup

1. Keep `SITE_URL` in `src/data/site.ts` set to the actual canonical production
   origin. The configured target for the portfolio is
   `https://dave-oyangorin-portfolio.vercel.app`. Assign this address in Vercel
   and deploy before verifying the property. Update it
   if a custom domain replaces this origin; do not invent location URLs.
2. Copy `.env.example` to `.env` locally. In Vercel, configure the same public
   variables for the production environment. Rebuild after changing them.
3. Add/verify the production property in Google Search Console. For a URL-prefix
   property, set `PUBLIC_GOOGLE_SITE_VERIFICATION` to the **content token**, not
   the entire HTML tag. Domain properties use Google's DNS verification instead.
4. Deploy, complete verification in Search Console, and submit
   `https://dave-oyangorin-portfolio.vercel.app/sitemap-index.xml` (or the custom-domain
   equivalent). A verification tag alone does not verify an account or submit a
   sitemap. Canonicals and sitemaps do not guarantee indexing.
5. Create a GA4 web data stream and set `PUBLIC_GA4_MEASUREMENT_ID` to its `G-…`
   ID. This public stream ID differs from the numeric reporting property ID.
   Avoid installing a second GA4 tag through GTM at the same time.

### Analytics consent and validation

The default `PUBLIC_GA4_REQUIRE_CONSENT=true` waits for consent. If an existing
consent manager grants analytics before initialization, set
`window.portfolioAnalyticsConsent = true`. Later grants or revocations use:

```js
window.dispatchEvent(new CustomEvent('portfolio:analytics-consent', { detail: true }));
// Revoke using detail: false.
```

This adds no banner or new visible UI. Set `PUBLIC_GA4_REQUIRE_CONSENT=false` only
if you have chosen a configuration that does not require prior opt-in. Collection
also respects Do Not Track, runs only on the configured production origin, and
is disabled for Vercel previews, development, and the 404. Verify actual page views
in GA4 Realtime after deployment and a consent grant; ad blockers may prevent them.

Event names: `contact_click`, `cv_download_click`, `project_view_click`, and
`web_vital`. A contact click measures intent, not a completed lead. Mark relevant
events as key events in GA4 if appropriate. Enhanced Measurement can independently
collect outbound clicks and file downloads; avoid interpreting both as separate
leads. Audit its settings if URL/query privacy requires additional controls.

For Web Vitals explorations, register event-scoped dimensions `metric_name` and
`metric_rating`, and custom metric `metric_value`. Filter by metric name: LCP/INP
are milliseconds, CLS is unitless. Per-page field metrics may be sparse. The
weekly script uses PageSpeed's available CrUX results for field performance and
does not treat a Lighthouse run or TBT as measured INP.

## Read-only Google reporting credentials

1. Enable the **Search Console API** and **Google Analytics Data API** in your
   Google Cloud project.
2. Use a reporting service account or a supported Application Default Credential
   file. Give its email access to the correct Search Console property and GA4
   Viewer access to the numeric property. It does not need permission to change
   the website. The script requests only `webmasters.readonly` and
   `analytics.readonly` OAuth scopes.
3. Locally store the credential JSON outside `public/` and `src/`, for example in
   the git-ignored `.secrets/` folder. Set `GOOGLE_APPLICATION_CREDENTIALS` to its
   path. Never put credentials in a `PUBLIC_` variable or commit them.
4. Set `GSC_SITE_URL` to the exact verified property, e.g.
   `https://dave-oyangorin-portfolio.vercel.app/` or `sc-domain:your-domain.com`. Set
   `GA4_PROPERTY_ID` to the **numeric** ID. Both services must grant access
   separately, even if they share one service account.

Search Console data uses finalized web-search results and Pacific date boundaries.
The report compares seven days ending three days before the current Pacific date
against the preceding seven days. GA4 uses the same date labels in its property's
time zone, filtered to the production hostname and Organic Search. They measure
different things and their counts need not match. `SEO_REPORT_END_DATE=YYYY-MM-DD`
can select a historical comparison.

Ungrouped Google search totals are requested separately; query/page rows are
paginated up to 50,000 and marked if capped. Google still omits anonymized queries
and may limit rows. Missing previous queries are unknown, not zero. A positive
position change means a worse average position; it is not a fixed keyword rank.
GA4 reports preserve sampling/threshold metadata and flag capped breakdowns.

URL Inspection reports Google's stored index status, not a live indexing test.
It does not request indexing or submit URLs. Inspection failures are recorded per
URL. At most 50 existing pages are inspected per run.

## Commands and private reports

```sh
npm run check
npm test
npm run build
npm run seo:audit
npm run seo:audit -- --live
npm run seo:report -- --offline
npm run seo:report -- --live
npm run seo:report -- --live --ai
```

Reports are Markdown and JSON in the git-ignored `reports/` folder, outside the
website output. Offline mode validates the build and explicitly labels external
data unavailable. `--live` checks production status, canonicals, crawl directives,
robots, sitemaps, and the real 404 response. Production can differ from the local
build until deployment. These are structural checks, not proof of Google indexing
or a passing Core Web Vitals assessment.

Errors produce a failing exit code after preserving the report, including Google
API/inspection failures. Missing unconfigured sources are labelled clearly and
do not masquerade as zero traffic. Raw credential-bearing API errors are never
printed. The technical audit includes an asset-size inventory for investigation.

`tests/fixtures/portfolio-baseline.json` fingerprints the body of all 22 existing
pages as it existed before this SEO change. It checks text, classes, styles,
structure, and alt text, while allowing the existing automatic copyright year,
equivalent project URL slashes, and image
delivery attributes. New pages, hidden text, deleted content, or layout changes
fail the audit. Do not regenerate it just to make a failing audit pass. Only a
separately approved content/design change justifies updating the baseline.

## Optional PageSpeed and AI analysis

Set `PAGESPEED_API_KEY` to enable one mobile homepage Lighthouse run plus available
URL/origin CrUX data per report. Treat lab values separately from real-user values.
CrUX is a rolling field window, not the report's seven-day period; small sites may
have no field data. The GA4 Web Vitals hook measures future consenting visits.

For automatic AI analysis, set server-only `OPENAI_API_KEY` and `SEO_AI_MODEL` to
an available model supporting Responses structured outputs, then explicitly pass
`--ai`. No model or key is embedded in the website. This makes a billed API call
that sends aggregate audit, search, and analytics evidence to OpenAI with
`store:false`. Without those settings, AI analysis is labelled unavailable; the
normal report remains useful for manual analysis, including through ChatGPT.

The model receives no website editing tools and cannot implement changes. Its
structured output must name existing indexable URLs and require human approval.
Visible-wording reviews require a matching query/page signal with at least 100
impressions in both periods. This is an investigation floor, not proof of benefit:
review longer periods, query intent, device/country mix, and actual snippets before
approving a small wording change. Replacement copy is not generated.

AI recommendations must preserve length and design and prioritize metadata,
technical issues, image delivery, performance, and existing links. Record each
approved change and deployment date; compare the following 2–4 weeks and retain
the previous values for reversal. No report creates pages, publishes copy, commits
source changes, or deploys the portfolio.

## Weekly GitHub reporting

`.github/workflows/seo.yml` runs checks on main/master pushes and pull requests.
After it is committed to the repository's default branch, the weekly report runs
Mondays at approximately **09:00 Asia/Manila**. It can also be run manually.
GitHub schedules can be delayed and require Actions to be enabled.

Configure repository **variables**:

The portfolio repository is public. On public repositories this workflow only
collects and uploads technical audit results, with no Google account or AI
credentials passed to the report script. To schedule full account reports, run
the same source/workflow in a private reporting repository. Artifact access
follows repository access; the account-report step requires a private repository.

| Variable | Value |
| --- | --- |
| `GSC_SITE_URL` | Exact verified property |
| `GA4_PROPERTY_ID` | Numeric property ID |
| `SEO_AI_MODEL` | Optional available structured-output model |
| `SEO_AI_ENABLED` | `true` only to enable weekly AI API calls |

Configure repository **secrets**:

| Secret | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Complete credential JSON |
| `PAGESPEED_API_KEY` | Optional PageSpeed key |
| `OPENAI_API_KEY` | Optional AI API key |

Reports are uploaded as Actions artifacts for 90 days, including partial failures.
Full account reports are generated only on private repositories; public repositories
upload only technical results already observable on the public website.
They are never placed in `public/`, committed, published as pages, emailed, or
posted to other services. Account data is accessed only during scheduled/manual
report steps, not during PR validation. Keep long-term reports in your chosen
private storage if you need history beyond artifact retention.

## Initial validation

The local production build preserved all 22 pages and passed metadata, sitemap,
robots, image, linking, and schema checks. On October 2, 2026, the previously
configured origin `dave-portfolio-phi.vercel.app` returned 404 for robots and
sitemap endpoints. The repository's actual deployment at
`portfolio-mine-theta.vercel.app` served those endpoints, but its canonicals and
robots sitemap reference incorrectly pointed to the old origin. The local
canonical origin now matches the repository deployment. The fixes need deployment;
they are not yet changes to the live site. Search Console/GA4/AI account data was not
available during this implementation and no ranking gains are claimed.

## Reference documentation

- [Astro components](https://docs.astro.build/en/basics/astro-components/),
  [routing](https://docs.astro.build/en/guides/routing/),
  [images](https://docs.astro.build/en/guides/images/),
  [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/).
- [Search Console query API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
  and [URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).
- [GA4 reporting](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
  and [Google Auth Library](https://docs.cloud.google.com/nodejs/docs/reference/google-auth-library/latest).
- [PageSpeed API](https://developers.google.com/speed/docs/insights/v5/get-started)
  and [Web Vitals library](https://github.com/GoogleChrome/web-vitals).
- [OpenAI Responses documentation](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [GitHub workflow schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
