/**
 * Skills, grouped by category.
 *
 * Tools are listed, never rated: there are no proficiency percentages or
 * invented levels. Tenure lives in the experience timeline instead.
 *
 * Sources: the previous skills data, the experience timeline, project tags,
 * and the categories Dave supplied for the redesign (Asana, Slack, Cursor,
 * Claude Code, and Google Apps Script were added from that brief).
 */

import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Responsive, accessible front ends that load fast.',
    items: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'TypeScript',
      'Vue.js',
      'Astro',
      'Bootstrap',
      'Tailwind CSS',
      'Responsive Web Design',
      'REST API Integration',
      'Website Performance Optimization',
      'Cross-Browser Compatibility',
    ],
  },
  {
    id: 'cms',
    name: 'CMS & Website Builders',
    description: 'WordPress builds and the hosted platforms clients already use.',
    items: [
      'WordPress',
      'Elementor',
      'Divi',
      'Beaver Builder',
      'WPBakery',
      'Shopify',
      'Duda',
      'Thinkific',
    ],
  },
  {
    id: 'seo-marketing',
    name: 'SEO & Digital Marketing',
    description: 'Technical and on-page SEO, tracking, and paid search.',
    items: [
      'Technical SEO',
      'On-Page SEO',
      'Local SEO',
      'Core Web Vitals',
      'Schema Markup & JSON-LD',
      'XML Sitemaps & robots.txt',
      'Google Search Console',
      'Google Analytics 4',
      'Google Tag Manager',
      'Conversion Tracking',
      'Google Ads',
      'Semrush',
      'Ahrefs',
      'Screaming Frog',
      'Rank Math Pro',
      'Landing Page Optimization',
      'Content & Social Media',
    ],
  },
  {
    id: 'automation-crm',
    name: 'Automation & CRM',
    description: 'Funnels, pipelines, and workflows that route and follow up leads.',
    items: [
      'GoHighLevel',
      'CRM Configuration',
      'Workflow Automation',
      'Email Automation',
      'Lead Management',
      'Forms & Funnels',
      'Appointment Booking',
      'Webhooks & API Integration',
      'Google Apps Script',
      'n8n',
      'Zapier',
      'Make',
    ],
  },
  {
    id: 'design-productivity',
    name: 'Design & Productivity',
    description: 'Hand-off, version control, and team collaboration.',
    items: ['Figma', 'Git & GitHub', 'Asana', 'Slack'],
  },
  {
    id: 'ai',
    name: 'AI-Assisted Development',
    description: 'AI tools used to speed up development and marketing work.',
    items: [
      'ChatGPT',
      'Claude',
      'Claude Code',
      'Cursor',
      'GitHub Copilot',
      'Gemini',
      'Prompt Engineering',
      'AI Workflow Design',
    ],
  },
];

/** Every capability across every category — the `knowsAbout` list for JSON-LD. */
export const allSkillNames: string[] = skillGroups.flatMap((group) => group.items);
