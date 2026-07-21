/**
 * Global site constants.
 *
 * `SITE_URL` is imported by astro.config.mjs, so this module must stay free of
 * Astro-specific imports (it is evaluated in a plain Node context at build time).
 */

/** Canonical origin. Update this when a custom domain is attached in Vercel. */
export const SITE_URL = 'https://dave-portfolio-phi.vercel.app';

export const SITE_TITLE = 'Dave Oyangorin — WordPress Developer & SEO Specialist';

export const SITE_DESCRIPTION =
  'Dave Oyangorin is a WordPress developer, SEO specialist, and front-end web developer based in Negros Oriental, Philippines, building fast, responsive, search-optimized websites.';

/**
 * Keywords reflecting the services actually offered.
 * (The previous site carried template keywords targeting Ranchi, India — removed.)
 */
export const SITE_KEYWORDS = [
  'WordPress developer',
  'SEO specialist',
  'front-end web developer',
  'Elementor developer',
  'Divi developer',
  'GoHighLevel',
  'technical SEO',
  'on-page SEO',
  'Google Ads',
  'website maintenance',
  'Philippines web developer',
] as const;

export const SITE_LOCALE = 'en_US';
export const SITE_LANG = 'en';
