/**
 * Skills, as a proficiency meter per discipline.
 *
 * Each entry is one bar in the Skills section; `items` is the capability
 * breakdown revealed when that bar is expanded. Ordered longest tenure first,
 * which is also the order the bars descend in.
 */

import type { SkillMeter } from './types';

export const skillMeters: SkillMeter[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    years: 5,
    suffix: '+',
    description: 'WordPress, Astro, Vue, and modern front-end builds.',
    items: [
      'WordPress Development',
      'Astro',
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'TypeScript',
      'Vue.js',
      'Tailwind CSS',
      'Responsive Web Design',
      'REST API Integration',
      'Website Performance Optimization',
      'Cross-Browser Compatibility',
    ],
  },
  {
    id: 'technical-seo',
    name: 'Technical SEO',
    years: 3,
    suffix: '+',
    description: 'Audits, Core Web Vitals, structured data, and indexing.',
    items: [
      'Technical SEO Audits',
      'Core Web Vitals',
      'Schema Markup',
      'JSON-LD',
      'Structured Data',
      'XML Sitemaps',
      'robots.txt',
      'Internal Linking',
      'Indexing Optimization',
      'Google Search Console',
      'Google Analytics 4',
      'Google Tag Manager',
      'Rank Math Pro',
      'Ahrefs',
      'SEMrush',
      'Screaming Frog',
    ],
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    years: 3,
    description: 'AI-assisted workflows, prompt engineering, and n8n automation.',
    items: [
      'AI-Assisted Development',
      'Prompt Engineering',
      'ChatGPT',
      'Claude',
      'Gemini',
      'GitHub Copilot',
      'AI Workflow Design',
      'AI Automation',
      'AI Content Optimization',
      'AI Research',
    ],
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation',
    years: 2,
    suffix: '+',
    description: 'Workflow and CRM automation that connects the tools together.',
    items: [
      'n8n',
      'GoHighLevel',
      'Workflow Automation',
      'CRM Automation',
      'API Integration',
      'Webhooks',
      'Zapier',
      'Make (Integromat)',
      'Email Automation',
    ],
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    years: 2,
    description: 'Lead generation, CRO, and campaign optimization.',
    items: [
      'Lead Generation',
      'Landing Page Optimization',
      'Conversion Rate Optimization',
      'Marketing Strategy',
      'Email Marketing',
      'Content Marketing',
      'Campaign Optimization',
      'Analytics & Reporting',
    ],
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    years: 2,
    description: 'Content planning, scheduling, and organic brand growth.',
    items: [
      'Content Planning',
      'Content Scheduling',
      'Community Management',
      'Brand Growth',
      'Engagement Strategies',
      'Social Media Analytics',
    ],
  },
  {
    id: 'funnel-design',
    name: 'Funnel Design',
    years: 1,
    description: 'Lead capture funnels and customer journey optimization.',
    items: [
      'Sales Funnel Strategy',
      'Landing Page Design',
      'Lead Capture Funnels',
      'Customer Journey Mapping',
      'CTA Optimization',
      'Funnel Optimization',
    ],
  },
];

/** Highest years value, used to scale the meters. The longest tenure reads 100%. */
export const maxSkillYears = Math.max(...skillMeters.map((meter) => meter.years));

/** Bar fill for one meter, as a whole percentage of the longest tenure. */
export function skillLevel(meter: SkillMeter): number {
  return Math.round((meter.years / maxSkillYears) * 100);
}

/** Every capability across every discipline — the `knowsAbout` list for JSON-LD. */
export const allSkillNames: string[] = skillMeters.flatMap((meter) => [
  meter.name,
  ...meter.items,
]);
