import type { Metric } from 'web-vitals';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    portfolioAnalyticsConsent?: boolean;
  }
}

const config = document.querySelector<HTMLMetaElement>('meta[name="portfolio-analytics"]');
if (config && location.origin === config.dataset.origin && navigator.doNotTrack !== '1') {
  /** GA4 measurement ID and GTM container ID; either may be empty. */
  const id = config.content;
  const gtm = config.dataset.gtm ?? '';
  const requireConsent = config.dataset.requireConsent === 'true';
  let started = false;

  // The visitor's banner choice, remembered across visits. Storage may be blocked.
  const STORAGE_KEY = 'analytics-consent';
  let stored: string | null = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* treat as no choice */ }
  let allowed = !requireConsent || window.portfolioAnalyticsConsent === true || stored === 'granted';

  const emit = (name: string, parameters: Record<string, unknown>) => {
    if (!allowed || !started) return;
    if (id) window.gtag?.('event', name, { ...parameters, transport_type: 'beacon' });
    // GTM triggers on { event } objects, so tags in the container can use these too.
    if (gtm) window.dataLayer!.push({ event: name, ...parameters });
  };
  const load = (src: string) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.append(script);
  };

  const start = () => {
    if (started || !allowed) return;
    started = true;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    if (id) {
      window.gtag('js', new Date());
      window.gtag('config', id, {
        page_location: `${location.origin}${location.pathname}`,
        page_referrer: document.referrer ? new URL(document.referrer).origin : '',
        allow_google_signals: false, allow_ad_personalization_signals: false,
      });
      load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
    }
    if (gtm) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      load(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`);
    }

    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
        emit('contact_click', { contact_method: url.protocol.slice(0, -1) });
      } else if (link.hasAttribute('download')) {
        emit('cv_download_click', { file_name: url.pathname.split('/').pop() });
      } else if (url.hostname === 'www.linkedin.com' && link.closest('#contact')) {
        emit('contact_click', { contact_method: 'linkedin' });
      } else if (url.origin === location.origin && url.pathname.startsWith('/projects/')) {
        emit('project_view_click', { project_path: url.pathname });
      }
    });

    void import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
      const send = (metric: Metric) => emit('web_vital', {
        metric_name: metric.name, metric_id: metric.id, metric_value: metric.value,
        metric_delta: metric.delta, metric_rating: metric.rating, non_interaction: true,
      });
      onCLS(send); onINP(send); onLCP(send);
    });
  };

  const schedule = () => {
    if (document.readyState === 'complete') {
      if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 2000 });
      else setTimeout(start, 0);
    } else window.addEventListener('load', schedule, { once: true });
  };
  window.addEventListener('portfolio:analytics-consent', (event) => {
    allowed = (event as CustomEvent<boolean>).detail === true;
    if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = !allowed;
    if (started) window.gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
    if (allowed) schedule();
  });
  if (allowed) schedule();

  // Consent banner (ConsentBanner.astro) and the footer's "Cookie settings" link.
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
  const reopen = document.querySelector<HTMLButtonElement>('[data-consent-open]');
  if (requireConsent && banner) {
    if (reopen) {
      reopen.hidden = false;
      reopen.addEventListener('click', () => {
        banner.hidden = false;
        banner.querySelector<HTMLButtonElement>('[data-consent-choice]')?.focus();
      });
    }
    banner.addEventListener('click', (event) => {
      const choice = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-consent-choice]')?.dataset.consentChoice : undefined;
      if (choice !== 'granted' && choice !== 'denied') return;
      try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* choice lasts this page only */ }
      banner.hidden = true;
      const wasRunning = started;
      window.dispatchEvent(new CustomEvent('portfolio:analytics-consent', { detail: choice === 'granted' }));
      // Tags already loaded keep running until the page unloads, so reload to stop them.
      if (choice === 'denied' && wasRunning) location.reload();
    });
    if (stored !== 'granted' && stored !== 'denied' && window.portfolioAnalyticsConsent !== true) banner.hidden = false;
  }
}
