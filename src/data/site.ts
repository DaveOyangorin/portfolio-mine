/**
 * Global site constants.
 *
 * `SITE_URL` is imported by astro.config.mjs, so this module must stay free of
 * Astro-specific imports (it is evaluated in a plain Node context at build time).
 */

/** Canonical origin. Update this when a custom domain is attached in Vercel. */
export const SITE_URL = 'https://dave-oyangorin-portfolio.vercel.app';

export const SITE_TITLE = 'Dave Oyangorin — Web Developer, SEO & Automation Specialist';

export const SITE_DESCRIPTION =
  'Dave Oyangorin is a web developer, WordPress developer, and SEO specialist in the Philippines who builds fast websites, technical SEO, and GoHighLevel CRM automation.';

/**
 * Keywords reflecting the services actually offered.
 * (The previous site carried template keywords targeting Ranchi, India — removed.)
 */
export const SITE_KEYWORDS = [
  'web developer',
  'WordPress developer',
  'SEO specialist',
  'front-end web developer',
  'GoHighLevel specialist',
  'CRM automation specialist',
  'website performance optimization',
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
