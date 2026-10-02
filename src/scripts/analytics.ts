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
  const id = config.content;
  let started = false;
  let allowed = config.dataset.requireConsent !== 'true' || window.portfolioAnalyticsConsent === true;

  const emit = (name: string, parameters: Record<string, unknown>) => {
    if (allowed && started) window.gtag?.('event', name, { ...parameters, transport_type: 'beacon' });
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
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: `${location.origin}${location.pathname}`,
      page_referrer: document.referrer ? new URL(document.referrer).origin : '',
      allow_google_signals: false, allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);

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
    (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = !allowed;
    if (started) window.gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
    if (allowed) schedule();
  });
  if (allowed) schedule();
}
