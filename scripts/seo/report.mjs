import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { GoogleAuth } from 'google-auth-library';
import { audit } from './audit.mjs';
import { ANALYST_INSTRUCTIONS, opportunities, reportingWindows, searchComparisons, searchMetrics } from './metrics.mjs';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly'];
const skipped = (reason) => ({ status: 'not-configured', reason, data: null });
const failure = (error) => ({ status: 'error', reason: `Request failed${error?.response?.status ? ` (HTTP ${error.response.status})` : ''}. Check credentials, API permissions, and network access.`, data: null });

// Do not print raw Google errors: request objects can contain authorization headers.
async function collect(action) {
  try { return { status: 'ok', data: await action() }; }
  catch (error) { return failure(error); }
}

export async function querySearch(post, property, window, dimensions, maxRows = 50000) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const rows = [];
  const rowLimit = dimensions.length ? 25000 : 1;
  let truncated = false;
  for (let startRow = 0; startRow < maxRows; startRow += rowLimit) {
    const response = await post(url, { ...window, dimensions, dataState: 'final', type: 'web', rowLimit, startRow });
    const batch = response.rows ?? [];
    rows.push(...batch);
    if (batch.length < rowLimit || !dimensions.length) break;
    if (startRow + rowLimit >= maxRows) truncated = true;
  }
  return { rows, truncated };
}

async function searchData(post, property, windows) {
  const period = async (window) => {
    const [totals, queries, pages] = await Promise.all([
      querySearch(post, property, window, []),
      querySearch(post, property, window, ['query', 'page']),
      querySearch(post, property, window, ['page']),
    ]);
    return { totals: searchMetrics(totals.rows[0]), queries, pages };
  };
  const [current, previous] = await Promise.all([period(windows.current), period(windows.previous)]);
  return { property, current, previous, comparisons: searchComparisons(current.queries.rows, previous.queries.rows) };
}

async function ga4Data(post, property, windows, hostname) {
  if (!/^\d+$/.test(property)) throw new Error('GA4_PROPERTY_ID must be numeric.');
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`;
  const totalsMetrics = ['sessions', 'engagedSessions', 'activeUsers', 'engagementRate', 'keyEvents'];
  const filter = { andGroup: { expressions: [
    { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Organic Search' } } },
    { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: hostname } } },
  ] } };
  async function period(window) {
    const request = { dateRanges: [window], dimensionFilter: filter, returnPropertyQuota: true };
    const [totals, landingPages, events] = await Promise.all([
      post(url, { ...request, metrics: totalsMetrics.map((name) => ({ name })) }),
      post(url, { ...request, dimensions: [{ name: 'landingPage' }], metrics: [{ name: 'sessions' }, { name: 'keyEvents' }], limit: '1000' }),
      post(url, { ...request, dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], limit: '1000' }),
    ]);
    return {
      totals: Object.fromEntries(totalsMetrics.map((name, i) => [name, Number(totals.rows?.[0]?.metricValues?.[i]?.value ?? 0)])),
      landingPages: (landingPages.rows ?? []).map((row) => ({ path: row.dimensionValues[0].value, sessions: Number(row.metricValues[0].value), keyEvents: Number(row.metricValues[1].value) })),
      events: (events.rows ?? []).map((row) => ({ name: row.dimensionValues[0].value, count: Number(row.metricValues[0].value) })),
      metadata: totals.metadata,
      incomplete: (landingPages.rowCount ?? 0) > 1000 || (events.rowCount ?? 0) > 1000,
    };
  }
  return { property, hostname, channel: 'Organic Search', current: await period(windows.current), previous: await period(windows.previous) };
}

async function inspections(post, property, inventory) {
  const results = [];
  // This portfolio is small. A bounded inspection avoids surprising quota use if routes grow.
  for (const page of inventory.filter((page) => !page.noindex).slice(0, 50)) {
    const result = await collect(() => post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      inspectionUrl: page.canonical, siteUrl: property, languageCode: 'en-US',
    }));
    results.push({ url: page.canonical, ...result,
      ...(result.status === 'ok' ? { data: result.data.inspectionResult?.indexStatusResult ?? null } : {}),
    });
  }
  return { inspected: results.length, truncated: inventory.filter((page) => !page.noindex).length > 50, results };
}

async function pageSpeed(origin, key) {
  const url = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  url.search = new URLSearchParams({ url: `${origin}/`, key, strategy: 'mobile', category: 'performance' }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error('PageSpeed request failed.');
  const result = await response.json();
  const lighthouse = result.lighthouseResult;
  const metrics = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index'];
  return {
    url: `${origin}/`, strategy: 'mobile',
    lab: { performanceScore: lighthouse?.categories?.performance?.score ?? null,
      metrics: Object.fromEntries(metrics.map((name) => [name, lighthouse?.audits?.[name]?.numericValue ?? null])),
      opportunities: Object.entries(lighthouse?.audits ?? {}).filter(([, value]) => value.details?.type === 'opportunity' && value.score !== null && value.score < 1)
        .map(([id, value]) => ({ id, title: value.title, savingsMs: value.details.overallSavingsMs ?? 0 })),
    },
    field: result.loadingExperience ?? null,
    originField: result.originLoadingExperience ?? null,
    note: 'Lab results are one simulated mobile run. CrUX field data covers a rolling window, may be absent for low traffic, and is not a weekly measurement. TBT is not INP.',
  };
}

const recommendationSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    limitations: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        category: { type: 'string', enum: ['technical', 'metadata', 'performance', 'measurement', 'visible-wording-review'] },
        page: { type: 'string' }, action: { type: 'string' },
        evidence: { type: 'array', items: { type: 'string' } },
        expectedBenefit: { type: 'string' }, measurement: { type: 'string' },
        approvalRequired: { type: 'boolean', enum: [true] },
      },
      required: ['category', 'page', 'action', 'evidence', 'expectedBenefit', 'measurement', 'approvalRequired'],
    } },
  }, required: ['summary', 'limitations', 'recommendations'],
};

async function analyze(report) {
  // Send aggregate evidence only, with no credentials, raw user IDs, or website editing tools.
  const evidence = {
    windows: report.windows, technical: report.technical,
    searchConsole: report.searchConsole.status === 'ok' ? {
      status: 'ok', current: report.searchConsole.data.current.totals, previous: report.searchConsole.data.previous.totals,
      queryRowsTruncated: report.searchConsole.data.current.queries.truncated,
      topQueries: report.searchConsole.data.comparisons.slice(0, 50),
    } : report.searchConsole,
    ga4: report.ga4, indexing: report.indexing, performance: report.performance,
    opportunities: report.opportunities,
  };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', signal: AbortSignal.timeout(120000),
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.SEO_AI_MODEL, store: false, max_output_tokens: 5000,
      instructions: ANALYST_INSTRUCTIONS, input: JSON.stringify(evidence),
      text: { format: { type: 'json_schema', name: 'seo_analysis', strict: true, schema: recommendationSchema } },
    }),
  });
  if (!response.ok) throw new Error('AI request failed.');
  const result = await response.json();
  if (result.status !== 'completed') throw new Error('AI response was incomplete.');
  const output = result.output?.flatMap((item) => item.content ?? []).filter((item) => item.type === 'output_text').map((item) => item.text).join('');
  const analysis = JSON.parse(output);
  const knownPages = new Set(report.technical.inventory.filter((page) => !page.noindex).map((page) => page.canonical));
  if (!Array.isArray(analysis.recommendations) || analysis.recommendations.some((item) => !item.approvalRequired || !knownPages.has(item.page))) {
    throw new Error('AI recommendations failed the approval/existing-page policy.');
  }
  for (const item of analysis.recommendations) {
    if (item.category === 'visible-wording-review' && !report.opportunities.some((candidate) =>
      candidate.evidence.page === item.page && candidate.evidence.previous?.impressions >= 100)) {
      throw new Error('A visible wording recommendation had no repeated search evidence.');
    }
  }
  return { ...analysis, model: result.model, usage: result.usage, implementationStatus: 'awaiting-human-approval' };
}

const md = (value) => String(value ?? 'unavailable').replaceAll('|', '\\|').replace(/[\r\n]/g, ' ');
const number = (value, places = 2) => value === null || value === undefined ? 'unavailable' : Number(value).toFixed(places);

export function markdown(report) {
  const lines = [
    '# Weekly portfolio SEO report', '',
    `Generated: ${new Date(report.generatedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (Asia/Manila).`, '',
    `Current: ${report.windows.current.startDate}–${report.windows.current.endDate}; previous: ${report.windows.previous.startDate}–${report.windows.previous.endDate}.`, '',
    'Search Console dates use Pacific time; GA4 uses the property time zone. Both use the same date labels with a three-day data delay.', '',
    '## Data availability', '', '| Source | Status | Detail |', '| --- | --- | --- |',
    ...['searchConsole', 'ga4', 'indexing', 'performance', 'ai'].map((source) => `| ${source} | ${report[source].status} | ${md(report[source].reason ?? 'Collected')} |`), '',
    '## Technical audit', '',
    `${report.technical.pageCount} existing pages. Visible content/layout preserved: ${report.technical.contentPreserved}. Production crawl checked: ${report.technical.liveChecked}.`, '',
    `Errors: ${report.technical.summary.error}; warnings: ${report.technical.summary.warning}.`, '',
    ...report.technical.issues.map((issue) => `- ${md(issue.severity)} / ${md(issue.page)} / ${md(issue.code)}: ${md(issue.message)}`), '',
  ];
  if (report.searchConsole.status === 'ok') {
    const { current, previous, comparisons } = report.searchConsole.data;
    lines.push('## Search performance', '', '| Metric | Current | Previous |', '| --- | --- | --- |');
    for (const metric of ['clicks', 'impressions', 'ctr', 'position']) {
      const values = [current.totals[metric], previous.totals[metric]].map((value) => metric === 'ctr' ? `${number(value === null ? null : value * 100)}%` : number(value));
      lines.push(`| ${metric} | ${values.join(' | ')} |`);
    }
    lines.push('', 'Property totals come from a separate ungrouped API request. Query/page rows omit anonymized searches and may be limited by Google; do not sum them to reconstruct property totals.', '',
      `Query row cap reached: current=${current.queries.truncated}, previous=${previous.queries.truncated}. Positive position deltas mean a worse average position.`, '',
      '| Query | Existing page | Impressions | Clicks | CTR | Avg. position | CTR change (pp) | Position change |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const row of comparisons.slice(0, 50)) lines.push(`| ${md(row.query)} | ${md(row.page)} | ${row.current.impressions} | ${row.current.clicks} | ${number(row.current.ctr === null ? null : row.current.ctr * 100)}% | ${number(row.current.position)} | ${number(row.delta?.ctrPercentagePoints)} | ${number(row.delta?.position)} |`);
  }
  if (report.ga4.status === 'ok') {
    lines.push('', '## GA4 organic search', '', '| Metric | Current | Previous |', '| --- | --- | --- |');
    for (const metric of Object.keys(report.ga4.data.current.totals)) lines.push(`| ${metric} | ${number(report.ga4.data.current.totals[metric])} | ${number(report.ga4.data.previous.totals[metric])} |`);
    lines.push('', `GA4 data flags: ${md(JSON.stringify(report.ga4.data.current.metadata ?? {}))}. Key events depend on your GA4 configuration; contact clicks are intent signals, not confirmed leads.`);
  }
  if (report.indexing.status === 'ok' || report.indexing.status === 'partial') {
    lines.push('', '## Google index inspection', '', '| URL | Status | Verdict | Coverage | Google canonical |', '| --- | --- | --- | --- | --- |');
    for (const row of report.indexing.data.results) lines.push(`| ${md(row.url)} | ${row.status} | ${md(row.data?.verdict)} | ${md(row.data?.coverageState)} | ${md(row.data?.googleCanonical)} |`);
  }
  if (report.performance.status === 'ok') lines.push('', '## Mobile performance', '', '```json', JSON.stringify(report.performance.data, null, 2), '```');
  lines.push('', '## Opportunities for review', '',
    ...(report.opportunities.length ? report.opportunities.map((item) => `- ${md(item.type)} — ${md(item.evidence.query)} → ${md(item.evidence.page)}: ${md(item.action)}`) : ['No data-backed query opportunities identified. Missing data is not evidence that SEO is healthy.']), '',
    '## AI analysis', '',
    ...(report.ai.status === 'ok' ? [report.ai.data.summary, '', ...report.ai.data.limitations.map((item) => `- Limitation: ${md(item)}`), '', ...report.ai.data.recommendations.map((item) => `- **Approval required** (${md(item.category)}, ${md(item.page)}): ${md(item.action)} Evidence: ${md(item.evidence.join('; '))}. Measure: ${md(item.measurement)}.`)] : [`AI analysis ${report.ai.status}: ${report.ai.reason}`]), '',
    '## Change and measurement policy', '',
    'Review evidence → approve a concrete change → implement on the existing page → annotate the deployment date → compare the following 2–4 weeks. Preserve copy length and design. Reports never edit or deploy the website.', '',
  );
  return lines.join('\n');
}

export async function generateReport({ live = false, ai = false, offline = false } = {}) {
  const technical = await audit({ live: live && !offline });
  const windows = reportingWindows(new Date(), process.env.SEO_REPORT_END_DATE || undefined);
  const report = { generatedAt: new Date().toISOString(), windows, technical };
  let post;
  if (!offline && (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON)) {
    try {
      const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) : undefined;
      const auth = new GoogleAuth({ ...(credentials ? { credentials } : {}), scopes: SCOPES });
      const client = await auth.getClient();
      post = async (url, data) => (await client.request({ url, method: 'POST', data, timeout: 30000 })).data;
    } catch { report.authentication = { status: 'error', reason: 'Google credential configuration could not be loaded.' }; }
  }
  const noGoogle = offline ? 'Offline mode: Google APIs were not contacted.' : 'Configure Google credentials and grant property access.';
  const gsc = process.env.GSC_SITE_URL;
  const ga4 = process.env.GA4_PROPERTY_ID;
  report.searchConsole = post && gsc ? await collect(() => searchData(post, gsc, windows)) : skipped(gsc ? noGoogle : 'Set the exact GSC_SITE_URL property and configure Google credentials.');
  report.ga4 = post && ga4 ? await collect(() => ga4Data(post, ga4, windows, new URL(technical.origin).hostname)) : skipped(ga4 ? noGoogle : 'Set the numeric GA4_PROPERTY_ID.');
  report.indexing = post && gsc ? await collect(() => inspections(post, gsc, technical.inventory)) : skipped(noGoogle);
  if (report.indexing.status === 'ok' && report.indexing.data.results.some((row) => row.status === 'error')) {
    report.indexing.status = 'partial';
    report.indexing.reason = 'One or more URL inspections failed; inspect the per-URL results.';
  }
  report.performance = !offline && process.env.PAGESPEED_API_KEY ? await collect(() => pageSpeed(technical.origin, process.env.PAGESPEED_API_KEY)) : skipped('Set PAGESPEED_API_KEY for mobile lab and available CrUX field data.');
  report.opportunities = report.searchConsole.status === 'ok' ? opportunities(report.searchConsole.data.comparisons, technical.inventory) : [];
  report.ai = !offline && ai && process.env.OPENAI_API_KEY && process.env.SEO_AI_MODEL
    ? await collect(() => analyze(report)) : skipped('AI is optional: provide OPENAI_API_KEY and SEO_AI_MODEL, then pass --ai.');
  report.warnings = [
    'Query data is incomplete by design (anonymized queries and Google API row limits). Missing rows are not zero performance.',
    'One-week changes do not prove causation; segmentation, seasonality, and low traffic can distort comparisons.',
    'A local technical audit cannot establish Google index status; URL Inspection is separate.',
  ];
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = await generateReport({ live: process.argv.includes('--live'), ai: process.argv.includes('--ai'), offline: process.argv.includes('--offline') });
  await mkdir('reports', { recursive: true });
  const filename = `reports/seo-${report.windows.current.endDate}`;
  await writeFile(`${filename}.json`, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(`${filename}.md`, markdown(report));
  console.log(`Weekly report: ${filename}.md and .json`);
  for (const source of ['searchConsole', 'ga4', 'indexing', 'performance', 'ai']) console.log(`${source}: ${report[source].status}`);
  const failed = ['searchConsole', 'ga4', 'indexing', 'performance', 'ai'].some((source) => report[source].status === 'error');
  const inspectionFailed = report.indexing.data?.results?.some((row) => row.status === 'error');
  if (failed || inspectionFailed || report.authentication?.status === 'error' || report.technical.summary.error) process.exitCode = 1;
}
