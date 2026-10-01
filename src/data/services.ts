/**
 * Services.
 *
 * ⚠️ The live site has no dedicated services section. These entries are
 * DERIVED — each one describes work that is already evidenced in the skills,
 * experience, or project data (nothing new is claimed). Review the wording
 * before launch, or delete this file and drop <Services /> from index.astro.
 * Tracked in MISSING-CONTENT.md.
 */

import type { Service } from './types';

export const services: Service[] = [
  {
    title: 'WordPress & Web Development',
    description:
      'Responsive, conversion-focused websites using WordPress, Elementor, Divi, Beaver Builder, WP Bakery, HTML, CSS, and JavaScript.',
    icon: 'wordpress',
    image: 'wordpress',
  },
  {
    title: 'SEO & Organic Growth',
    description:
      'Technical SEO, on-page optimization, keyword research, site architecture, schema, indexing, Core Web Vitals, and content optimization.',
    icon: 'search',
    image: 'seo',
  },
  {
    title: 'Front-End Development',
    description:
      'Clean, responsive interfaces using HTML, CSS, JavaScript, Vue.js, Bootstrap, and API integrations.',
    icon: 'code',
    image: 'front-end',
  },
  {
    title: 'Marketing Automation & CRM',
    description:
      'GoHighLevel funnels, pipelines, workflows, email campaigns, forms, calendars, tags, webhooks, and automated lead nurturing.',
    icon: 'wrench',
    image: 'maintenance',
  },
  {
    title: 'Google Ads & Digital Marketing',
    description:
      'Google Ads campaign setup and optimization, landing pages, lead generation, conversion tracking, analytics, and campaign performance improvements.',
    icon: 'megaphone',
    image: 'google-ads',
  },
  {
    title: 'Social Media & Content Marketing',
    description:
      'Content planning, publishing, short-form video content, YouTube optimization, content repurposing, and multi-platform distribution.',
    icon: 'share',
    image: 'social-media',
  },
];
