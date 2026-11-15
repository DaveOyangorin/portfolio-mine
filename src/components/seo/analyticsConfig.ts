/** Build-time analytics settings shared by Analytics, ConsentBanner, and Footer. */
import { GTM_ID } from '../../data/site';

const ga4 = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID?.trim() || '';
if (ga4 && !/^G-[A-Z0-9]+$/.test(ga4)) throw new Error('PUBLIC_GA4_MEASUREMENT_ID must be a GA4 G-… ID.');
const gtm = import.meta.env.PUBLIC_GTM_ID?.trim() || GTM_ID;
if (gtm && !/^GTM-[A-Z0-9]+$/.test(gtm)) throw new Error('PUBLIC_GTM_ID must be a GTM-… container ID.');
const isPreview = import.meta.env.VERCEL_ENV && import.meta.env.VERCEL_ENV !== 'production';

export const analytics = {
  ga4,
  gtm,
  requireConsent: import.meta.env.PUBLIC_GA4_REQUIRE_CONSENT !== 'false',
  /** Analytics runs only on production builds of indexable pages. */
  enabled: (noindex = false) => Boolean(import.meta.env.PROD && !isPreview && !noindex && (ga4 || gtm)),
};

/** Whether the page renders the consent banner and the footer's settings link. */
export const showsConsent = (noindex = false) => analytics.enabled(noindex) && analytics.requireConsent;
