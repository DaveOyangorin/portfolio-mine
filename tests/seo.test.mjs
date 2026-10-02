import assert from 'node:assert/strict';
import test from 'node:test';
import { bodyFingerprint, document } from '../scripts/seo/html.mjs';
import { opportunities, reportingWindows, searchComparisons, searchMetrics } from '../scripts/seo/metrics.mjs';
import { markdown, querySearch } from '../scripts/seo/report.mjs';

test('weekly windows use Pacific search dates, exclude delayed data, and cross year boundaries', () => {
  assert.deepEqual(reportingWindows(new Date('2026-01-02T00:30:00Z')), {
    current: { startDate: '2025-12-23', endDate: '2025-12-29' },
    previous: { startDate: '2025-12-16', endDate: '2025-12-22' },
  });
  assert.throws(() => reportingWindows(new Date(), '2026-02-30'));
});

test('missing query rows are unknown and cannot produce a fabricated improvement', () => {
  const [row] = searchComparisons([{ keys: ['WordPress developer', 'https://example.com/'], clicks: 21, impressions: 900, position: 12.8 }], []);
  assert.equal(row.previous, null);
  assert.equal(row.delta, null);
  assert.equal(row.current.ctr, 21 / 900);
  assert.equal(searchMetrics().position, null);
  assert.equal(searchMetrics().ctr, null);
});

test('CTR decline requires repeated measured impressions at a stable position on an existing page', () => {
  const inventory = [{ canonical: 'https://example.com/', noindex: false }];
  const current = [{ keys: ['developer', 'https://example.com/'], impressions: 900, clicks: 18, position: 9.5 }];
  const previous = [{ keys: ['developer', 'https://example.com/'], impressions: 800, clicks: 40, position: 9 }];
  const candidates = opportunities(searchComparisons(current, previous), inventory);
  assert.equal(candidates[0].type, 'ctr-decline');
  assert.ok(Math.abs(candidates[0].evidence.delta.ctrPercentagePoints + 3) < 1e-10);
  assert.equal(opportunities(searchComparisons(current, previous), []).length, 0);
  assert.equal(opportunities(searchComparisons([{ ...current[0], impressions: 30 }], previous), inventory).length, 0);
});

test('query requests paginate, use final data and flag a reached cap', async () => {
  const requests = [];
  const post = async (url, body) => {
    requests.push({ url, body });
    return { rows: Array.from({ length: 25000 }, () => ({ keys: ['query', 'page'] })) };
  };
  const result = await querySearch(post, 'sc-domain:example.com', { startDate: '2026-09-01', endDate: '2026-09-07' }, ['query', 'page']);
  assert.equal(result.rows.length, 50000);
  assert.equal(result.truncated, true);
  assert.deepEqual(requests.map((request) => request.body.startRow), [0, 25000]);
  assert.equal(requests[0].body.dataState, 'final');
  assert.ok(requests[0].url.includes('sc-domain%3Aexample.com'));
});

test('content guard allows technical delivery changes while catching text, layout, and new hidden copy', () => {
  const fingerprint = (body) => bodyFingerprint(document(`<html><body>${body}</body></html>`).root);
  const initial = '<main class="grid"><h1>Dave</h1><a href="/projects">Projects</a><img src="a.jpg" alt="Portrait" width="480" height="480" loading="eager"></main>';
  const optimized = initial.replace('/projects"', '/projects/"').replace('a.jpg', 'b.webp').replace('eager', 'lazy');
  assert.equal(fingerprint(initial), fingerprint(optimized));
  assert.notEqual(fingerprint(initial), fingerprint(initial.replace('Dave</h1>', 'Dave, developer in Philippines</h1>')));
  assert.notEqual(fingerprint(initial), fingerprint(initial.replace('grid', 'flex')));
  assert.notEqual(fingerprint(initial), fingerprint(`${initial}<p hidden>keywords</p>`));
});

test('unavailable data is explicitly reported, without invented query opportunities', () => {
  const unavailable = { status: 'not-configured', reason: 'Needs account configuration.', data: null };
  const result = markdown({ generatedAt: '2026-10-02T06:00:00Z', windows: reportingWindows(new Date('2026-10-02T06:00:00Z')),
    technical: { pageCount: 22, contentPreserved: true, liveChecked: false, summary: { error: 0, warning: 0 }, issues: [] },
    searchConsole: unavailable, ga4: unavailable, indexing: unavailable, performance: unavailable, ai: unavailable, opportunities: [],
  });
  assert.match(result, /not-configured/);
  assert.match(result, /Missing data is not evidence/);
  assert.doesNotMatch(result, /\| Avg\. position/);
});
