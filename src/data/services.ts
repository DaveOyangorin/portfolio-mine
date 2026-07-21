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
    title: 'WordPress Development',
    description:
      'Custom websites built with Elementor, Divi, Beaver Builder, and WP Bakery — from landing pages to full business sites, responsive on every screen.',
    icon: 'wordpress',
  },
  {
    title: 'SEO Optimization',
    description:
      'Technical and on-page SEO — site structure, page speed, metadata, and keyword targeting — so your pages rank for the searches that matter to your business.',
    icon: 'search',
  },
  {
    title: 'Front-End Development',
    description:
      'Clean, responsive interfaces with HTML, CSS, JavaScript, Vue.js, and Bootstrap, integrated cleanly with your backend systems and APIs.',
    icon: 'code',
  },
  {
    title: 'Website Maintenance',
    description:
      'Ongoing updates, content changes, and troubleshooting through organized ticketing — across WordPress, Duda, GoHighLevel, and Thinkific.',
    icon: 'wrench',
  },
  {
    title: 'Google Ads & Digital Marketing',
    description:
      'Campaign setup, monitoring, and optimization that puts budget behind the pages most likely to convert.',
    icon: 'megaphone',
  },
  {
    title: 'Social Media Management',
    description:
      'Scheduling and publishing through tools like Publer to keep a consistent brand presence across platforms.',
    icon: 'share',
  },
];
