import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { attr, bodyFingerprint, builtPages, content, document, nodes, tags } from './html.mjs';

export const xmlLocations = (xml) => [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
  .map((match) => match[1].trim().replaceAll('&amp;', '&'));

export async function audit({ directory = 'dist', live = false, preserveContent = true } = {}) {
  const pages = await builtPages(directory);
  if (!pages.length) throw new Error('No built pages. Run npm run build first.');
  const origin = new URL(pages.find((page) => page.path === '/').canonical).origin;
  const issues = [];
  const add = (severity, page, code, message) => issues.push({ severity, page, code, message });
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const baseline = preserveContent ? JSON.parse(await readFile('tests/fixtures/portfolio-baseline.json', 'utf8')) : null;
  const byPath = new Map(pages.map((page) => [page.path, page]));
  const referenced = new Set(['/']);
  const seenTitles = new Map();
  const seenDescriptions = new Map();
  const imageCache = new Map();

  async function asset(url, page) {
    const location = new URL(url, origin);
    if (location.origin !== origin) return null;
    const file = resolve(directory, `.${decodeURIComponent(location.pathname)}`);
    if (!file.startsWith(`${resolve(directory)}${process.platform === 'win32' ? '\\' : '/'}`)) {
      add('error', page, 'asset-path', 'Asset resolves outside the build directory.');
      return null;
    }
    try { await access(file); return file; }
    catch { add('error', page, 'missing-asset', `Missing asset: ${location.pathname}`); return null; }
  }

  for (const page of pages) {
    if (baseline && baseline[page.path] !== bodyFingerprint(page.root)) {
      add('error', page.path, 'content-policy', 'Rendered content or layout differs from the approved portfolio baseline.');
    }
    const expected = new URL(page.path === '/404.html' ? '/404/' : page.path, origin).href;
    if (page.canonical !== expected) add('error', page.path, 'canonical', `Expected ${expected}; found ${page.canonical ?? 'none'}.`);
    if (page.noindex !== (isPreview || page.path === '/404.html')) add('error', page.path, 'indexability', 'Unexpected robots indexing directive.');
    if (tags(page.root, 'h1').length !== 1) add('error', page.path, 'h1', 'Each existing page must have one h1.');
    if (!attr(tags(page.root, 'html')[0], 'lang')) add('error', page.path, 'language', 'Missing document language.');
    for (const [name, value, seen] of [['title', page.title, seenTitles], ['description', page.description, seenDescriptions]]) {
      if (!value?.trim()) add('error', page.path, name, `Missing ${name}.`);
      if (!page.noindex && seen.has(value)) add('error', page.path, `duplicate-${name}`, `Matches ${seen.get(value)}.`);
      seen.set(value, page.path);
    }
    // Lengths are diagnostic hints, not ranking rules or reasons to expand copy.
    if (page.title.length > 65) add('info', page.path, 'title-length', 'Long title: review truncation only if actual CTR data supports a change.');
    if (page.description?.length > 170) add('info', page.path, 'description-length', 'Long description: evaluate snippets using actual search data.');
    if (page.meta('og:url') !== expected) add('error', page.path, 'og-url', 'Open Graph URL does not match the canonical.');
    const social = page.meta('og:image');
    if (!social) add('error', page.path, 'social-image', 'Missing social preview image.');
    else {
      const file = await asset(social, page.path);
      if (file) {
        if (!imageCache.has(file)) imageCache.set(file, await sharp(file).metadata());
        const size = imageCache.get(file);
        if (String(size.width) !== page.meta('og:image:width') || String(size.height) !== page.meta('og:image:height')) {
          add('error', page.path, 'social-dimensions', 'Declared social image dimensions do not match the file.');
        }
      }
    }
    const ids = nodes(page.root, (node) => attr(node, 'id')).map((node) => attr(node, 'id'));
    if (ids.length !== new Set(ids).size) add('error', page.path, 'duplicate-id', 'Duplicate document IDs.');
    for (const image of tags(page.root, 'img')) {
      if (attr(image, 'alt') === undefined) add('error', page.path, 'image-alt', 'Image is missing an alt attribute.');
      if (!(Number(attr(image, 'width')) > 0 && Number(attr(image, 'height')) > 0)) add('error', page.path, 'image-size', 'Image is missing intrinsic dimensions.');
      if (attr(image, 'fetchpriority') === 'high' && attr(image, 'loading') === 'lazy') add('error', page.path, 'image-priority', 'A priority image is lazy-loaded.');
      const sources = [attr(image, 'src'), ...(attr(image, 'srcset') ?? '').split(',').map((item) => item.trim().split(/\s+/)[0])].filter(Boolean);
      for (const source of new Set(sources)) await asset(source, page.path);
    }
    for (const link of tags(page.root, 'a')) {
      const href = attr(link, 'href');
      if (!href || /^(mailto:|tel:)/.test(href)) continue;
      const url = new URL(href, new URL(page.path, origin));
      if (url.origin !== origin) continue;
      const path = url.pathname.endsWith('/') || url.pathname.split('/').pop().includes('.') ? url.pathname : `${url.pathname}/`;
      const target = byPath.get(path);
      if (target) {
        referenced.add(path);
        if (url.hash && !nodes(target.root, (node) => attr(node, 'id') === decodeURIComponent(url.hash.slice(1))).length) {
          add('error', page.path, 'broken-anchor', `Missing anchor: ${href}`);
        }
        if (path !== url.pathname) add('warning', page.path, 'link-redirect', `Internal link needs a trailing slash: ${href}`);
      } else await asset(url.href, page.path);
    }
    const schemas = tags(page.root, 'script').filter((node) => attr(node, 'type') === 'application/ld+json');
    if (!page.noindex && !schemas.length) add('error', page.path, 'schema-missing', 'Missing structured data.');
    for (const script of schemas) {
      try {
        const schema = JSON.parse(content(script));
        if (schema['@context'] !== 'https://schema.org') add('error', page.path, 'schema-context', 'Unexpected schema context.');
        const graph = schema['@graph'] ?? [schema];
        const defined = new Set(graph.map((entry) => entry['@id']).filter(Boolean));
        function references(value) {
          if (!value || typeof value !== 'object') return;
          if (value['@id'] && Object.keys(value).length === 1 && !defined.has(value['@id'])) {
            add('error', page.path, 'schema-reference', `Undefined entity: ${value['@id']}`);
          }
          for (const nested of Object.values(value)) references(nested);
        }
        references(schema);
        for (const entry of graph) if (typeof entry.image === 'string') await asset(entry.image, page.path);
      } catch { add('error', page.path, 'schema-json', 'Structured data is invalid JSON.'); }
    }
  }
  if (baseline) for (const path of Object.keys(baseline)) if (!byPath.has(path)) add('error', path, 'content-policy', 'An existing page was removed.');
  for (const page of pages) if (!page.noindex && !referenced.has(page.path)) add('error', page.path, 'orphan-page', 'No existing internal link points to this page.');

  const sitemapIndex = await readFile(join(directory, 'sitemap-index.xml'), 'utf8');
  const sitemapUrls = [];
  for (const url of xmlLocations(sitemapIndex)) {
    const file = await asset(url, '/sitemap-index.xml');
    if (file) sitemapUrls.push(...xmlLocations(await readFile(file, 'utf8')));
  }
  const sitemap = new Set(sitemapUrls);
  if (sitemap.size !== sitemapUrls.length) add('error', '/sitemap-index.xml', 'sitemap-duplicates', 'Duplicate sitemap URLs.');
  for (const page of pages) {
    // Preview builds retain the production sitemap; preview robots prevents crawling.
    const expectedInSitemap = page.path !== '/404.html';
    if (sitemap.has(page.canonical) !== expectedInSitemap) add('error', page.path, 'sitemap-coverage', 'Sitemap membership does not match the production route.');
  }
  for (const url of sitemap) if (!pages.some((page) => page.canonical === url)) add('error', url, 'sitemap-unknown', 'Sitemap URL has no built page.');
  const robots = await readFile(join(directory, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) add('error', '/robots.txt', 'robots-sitemap', 'Robots does not reference the canonical sitemap index.');
  if (/Disallow:\s*\/\s*$/m.test(robots) !== Boolean(isPreview)) add('error', '/robots.txt', 'robots-crawl', 'Unexpected crawl policy.');

  const inventory = pages.map(({ path, title, description, canonical, noindex }) => ({ path, title, description, canonical, noindex }));
  if (live) {
    const paths = [...inventory.filter((page) => !page.noindex).map((page) => page.path), '/robots.txt', '/sitemap-index.xml', ...xmlLocations(sitemapIndex).map((url) => new URL(url).pathname)];
    for (let offset = 0; offset < paths.length; offset += 4) {
      await Promise.all(paths.slice(offset, offset + 4).map(async (path) => {
        try {
          const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(20000) });
          if (response.status !== 200) add('error', path, 'live-status', `Production returned HTTP ${response.status}.`);
          if (byPath.has(path) && /noindex|none/i.test(response.headers.get('x-robots-tag') ?? '')) add('error', path, 'live-noindex', 'Production X-Robots-Tag prevents indexing.');
          const body = await response.text();
          if (byPath.has(path)) {
            const actual = document(body);
            if (actual.noindex) add('error', path, 'live-noindex', 'Production HTML prevents indexing.');
            if (actual.canonical !== new URL(path, origin).href) add('error', path, 'live-canonical', 'Production canonical is missing or does not match this URL.');
            if (actual.title !== byPath.get(path).title || actual.description !== byPath.get(path).description) add('info', path, 'deployment-differs', 'Production metadata differs from this build.');
          } else if (path === '/robots.txt') {
            if (/Disallow:\s*\/\s*$/m.test(body)) add('error', path, 'live-robots', 'Production robots blocks crawling.');
            if (!body.includes(`Sitemap: ${origin}/sitemap-index.xml`)) add('warning', path, 'live-sitemap', 'Production robots does not reference this sitemap.');
          } else if (!body.includes('<loc>') || !/xml/i.test(response.headers.get('content-type') ?? '')) add('error', path, 'live-sitemap', 'Production sitemap is not XML with URL entries.');
        } catch { add('error', path, 'live-unreachable', 'Production request failed or timed out.'); }
      }));
    }
    try {
      const response = await fetch(new URL('/__seo_missing_page_check__/', origin), { signal: AbortSignal.timeout(20000) });
      if (response.status !== 404) add('error', '/__seo_missing_page_check__/', 'soft-404', `Missing route returned ${response.status} instead of 404.`);
    } catch { add('warning', '/', '404-unchecked', 'Could not check the production 404 response.'); }
  }
  const files = await readdirAssets(directory);
  const assets = await Promise.all(files.map(async (file) => ({ file, bytes: (await stat(join(directory, file))).size })));
  return {
    generatedAt: new Date().toISOString(), origin, liveChecked: live,
    contentPreserved: baseline ? !issues.some((issue) => issue.code === 'content-policy') : null,
    pageCount: pages.length, inventory, issues,
    assets: assets.sort((a, b) => b.bytes - a.bytes).slice(0, 15),
    summary: Object.fromEntries(['error', 'warning', 'info'].map((level) => [level, issues.filter((issue) => issue.severity === level).length])),
  };
}

async function readdirAssets(directory) {
  const { readdir } = await import('node:fs/promises');
  return (await readdir(join(directory, '_astro'))).map((name) => `_astro/${name}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = await audit({ live: process.argv.includes('--live') });
  await mkdir('reports', { recursive: true });
  await writeFile('reports/technical-audit.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.pageCount} existing pages; content preserved: ${report.contentPreserved}. Errors: ${report.summary.error}; warnings: ${report.summary.warning}.`);
  for (const issue of report.issues.filter((issue) => issue.severity !== 'info')) console.log(`${issue.severity}: ${issue.page}: ${issue.code}: ${issue.message}`);
  console.log('Full audit: reports/technical-audit.json');
  if (report.summary.error) process.exitCode = 1;
}
