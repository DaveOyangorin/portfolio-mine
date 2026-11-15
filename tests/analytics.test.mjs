import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setImmediate } from 'node:timers/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = ts.transpileModule(await readFile('src/scripts/analytics.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function browser({ configured = true, consent = 'true', origin = 'https://portfolio.example', dnt = '0', ga4 = 'G-TEST123', gtm = '', stored = null, banner = null } = {}) {
  const listeners = {};
  const documentListeners = {};
  const scripts = [];
  const observers = {};
  class Element {
    constructor(href) { this.href = href; }
    closest(selector) { return selector === 'a[href]' ? this : null; }
    hasAttribute() { return false; }
  }
  const window = {
    requestIdleCallback: (callback) => callback(),
    addEventListener: (name, callback) => { listeners[name] = callback; },
    dispatchEvent: (event) => listeners[event.type]?.(event),
  };
  runInNewContext(source, {
    window, exports: {}, URL, Element, setTimeout, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    localStorage: { getItem: () => stored, setItem: (key, value) => { stored = value; } },
    navigator: { doNotTrack: dnt },
    location: { origin, pathname: '/', href: `${origin}/?private=secret#contact` },
    document: {
      readyState: 'complete', referrer: 'https://search.example/results?private=secret',
      querySelector: (selector) => selector === '[data-consent-banner]' ? banner : configured && selector === 'meta[name="portfolio-analytics"]' ? { content: ga4, dataset: { origin: 'https://portfolio.example', requireConsent: consent, gtm } } : null,
      createElement: () => ({}), head: { append: (script) => scripts.push(script) },
      addEventListener: (name, callback) => { documentListeners[name] = callback; },
    },
    require: (name) => {
      assert.equal(name, 'web-vitals');
      return Object.fromEntries(['CLS', 'INP', 'LCP'].map((metric) => [`on${metric}`, (callback) => { observers[metric] = callback; }]));
    },
  });
  return {
    scripts, observers, window, stored: () => stored,
    choose: (choice) => banner.listeners.click({ target: Object.assign(new Element(), { dataset: { consentChoice: choice }, closest() { return this; } }) }),
    consent: (allowed) => listeners['portfolio:analytics-consent']?.({ detail: allowed }),
    click: (href) => documentListeners.click?.({ target: new Element(href) }),
    calls: () => (window.dataLayer ?? []).map((args) => Array.from(args)),
  };
}

test('analytics sends nothing without configuration, on another origin, or with Do Not Track', () => {
  for (const options of [{ configured: false }, { consent: 'false', origin: 'https://preview.example' }, { consent: 'false', dnt: '1' }]) {
    const context = browser(options);
    context.consent(true);
    assert.equal(context.scripts.length, 0);
    assert.equal(context.calls().length, 0);
  }
});

test('consent grants initialize once, revocation blocks events, and a later grant resumes them', async () => {
  const context = browser();
  assert.equal(context.scripts.length, 0);
  context.consent(true);
  await setImmediate();
  assert.equal(context.scripts.length, 1);
  assert.ok(context.observers.LCP && context.observers.INP && context.observers.CLS);
  context.click('https://portfolio.example/projects/axpara/?private=secret');
  const firstEvents = context.calls().filter((args) => args[0] === 'event');
  assert.equal(firstEvents.length, 1);
  assert.equal(firstEvents[0][2].project_path, '/projects/axpara/');
  context.consent(false);
  context.click('mailto:person@example.com');
  assert.equal(context.calls().filter((args) => args[0] === 'event').length, 1);
  assert.equal(context.window['ga-disable-G-TEST123'], true);
  context.consent(true);
  context.click('mailto:person@example.com');
  assert.equal(context.scripts.length, 1);
  const last = context.calls().filter((args) => args[0] === 'event').at(-1);
  assert.equal(last[1], 'contact_click');
  assert.equal(last[2].contact_method, 'mailto');
  assert.ok(!JSON.stringify(last).includes('person@example.com'));
});

test('page-view configuration strips query/fragments and metric reports exclude DOM attribution', async () => {
  const context = browser({ consent: 'false' });
  await setImmediate();
  const config = context.calls().find((args) => args[0] === 'config')[2];
  assert.equal(config.page_location, 'https://portfolio.example/');
  assert.equal(config.page_referrer, 'https://search.example');
  assert.equal(config.allow_google_signals, false);
  context.observers.LCP({ name: 'LCP', id: 'metric-id', value: 2100, delta: 2100, rating: 'good', entries: [{ element: 'private DOM text' }] });
  const metric = context.calls().find((args) => args[0] === 'event' && args[1] === 'web_vital');
  assert.equal(metric[2].metric_value, 2100);
  assert.equal(metric[2].metric_name, 'LCP');
  assert.ok(!JSON.stringify(metric).includes('private DOM text'));
});

test('a GTM-only setup starts the container and pushes events GTM can trigger on', async () => {
  const context = browser({ consent: 'false', ga4: '', gtm: 'GTM-TEST1' });
  await setImmediate();
  assert.deepEqual(context.scripts.map((script) => script.src), ['https://www.googletagmanager.com/gtm.js?id=GTM-TEST1']);
  const layer = context.window.dataLayer;
  assert.ok(layer.some((entry) => entry.event === 'gtm.js' && typeof entry['gtm.start'] === 'number'));
  assert.ok(!context.calls().some((args) => args[0] === 'config'));
  context.click('https://portfolio.example/projects/axpara/');
  const pushed = layer.find((entry) => entry.event === 'project_view_click');
  assert.equal(pushed.project_path, '/projects/axpara/');
});

test('Do Not Track also blocks the GTM container', () => {
  const context = browser({ consent: 'false', ga4: '', gtm: 'GTM-TEST1', dnt: '1' });
  assert.equal(context.scripts.length, 0);
});

function fakeBanner() {
  const listeners = {};
  return {
    hidden: true, listeners,
    addEventListener: (name, callback) => { listeners[name] = callback; },
    querySelector: () => null,
  };
}

test('the banner shows without a stored choice, and Accept stores consent and loads GTM', async () => {
  const banner = fakeBanner();
  const context = browser({ ga4: '', gtm: 'GTM-TEST1', banner });
  assert.equal(banner.hidden, false);
  assert.equal(context.scripts.length, 0);
  context.choose('granted');
  await setImmediate();
  assert.equal(banner.hidden, true);
  assert.equal(context.stored(), 'granted');
  assert.deepEqual(context.scripts.map((script) => script.src), ['https://www.googletagmanager.com/gtm.js?id=GTM-TEST1']);
});

test('a stored grant loads GTM on later visits and keeps the banner hidden', async () => {
  const banner = fakeBanner();
  const context = browser({ ga4: '', gtm: 'GTM-TEST1', banner, stored: 'granted' });
  await setImmediate();
  assert.equal(banner.hidden, true);
  assert.equal(context.scripts.length, 1);
});

test('a stored decline keeps GTM off and the banner hidden', async () => {
  const banner = fakeBanner();
  const context = browser({ ga4: '', gtm: 'GTM-TEST1', banner, stored: 'denied' });
  await setImmediate();
  assert.equal(banner.hidden, true);
  assert.equal(context.scripts.length, 0);
});
