/** Identity, hero copy, and about copy — sourced from the live portfolio. */

import avatar from '../assets/avatar.jpg';
import type { Stat } from './types';

export const profile = {
  name: 'Dave Oyangorin',
  /** Positioning used in metadata, JSON-LD jobTitle, and the hero. */
  title: 'Web Developer, SEO Specialist & Automation Specialist',
  shortTitle: 'Website, SEO & Automation Specialist',
  /** The hero headline, one role per line. */
  heroRoles: ['Web Developer', 'SEO Specialist', 'Automation Specialist'],
  location: 'Negros Oriental, Philippines',

  heroHeadline:
    'Websites that look sharp, load fast, and earn their place in search results.',
  heroStatement:
    'I build high-performing websites, optimize search visibility, and develop automation solutions that help businesses work smarter. My expertise combines front-end development, WordPress, technical SEO, CRM integrations, and workflow automation.',

  about: [
    "I'm a Web Developer, SEO Specialist, and Automation Specialist with experience building and optimizing business websites, marketing systems, and custom digital solutions.",
    'I started in front-end and WordPress development, working with HTML, CSS, JavaScript, Vue.js, and Bootstrap, and with builders such as Elementor, Divi, Beaver Builder, and WPBakery. As I worked closer to the businesses behind those sites, the job grew to include SEO, analytics, Google Ads, and CRM platforms such as GoHighLevel.',
    'My approach combines clean development, user-focused design, search engine optimization, and practical automation to deliver websites and systems that support real business goals.',
  ],

  /** How the work gets done. Each point is backed by the experience timeline. */
  approach: [
    {
      title: 'Start from the requirement',
      body: 'I work directly with clients and teams to pin down what the site, funnel, or automation has to do before I build it.',
    },
    {
      title: 'Build for every screen',
      body: 'Responsive layouts, tested across desktop, tablet, and mobile, with bugs fixed before launch.',
    },
    {
      title: 'Ship it measurable',
      body: 'Technical SEO, structured data, GA4, and Google Tag Manager go in with the build, not after it.',
    },
    {
      title: 'Automate the follow-up',
      body: 'Forms connect to CRM pipelines and workflows, so leads are routed and followed up without manual work.',
    },
  ],

  /** The opportunities Dave is looking for. */
  openTo:
    'Remote full-time or contract roles in web development, SEO, and marketing automation, plus website and automation projects for agencies and businesses.',

  avatar,
  avatarAlt: 'Portrait of Dave Oyangorin',

  /** CTA label used on the hero button; see MISSING-CONTENT.md for the file. */
  resumeLabel: 'Download CV',
} as const;

/**
 * Homepage counters. Derived strictly from content on the live site:
 * years from the WordPress skill, projects from the projects listing,
 * roles from the experience timeline, sites from the D3 role highlight.
 */
export const stats: Stat[] = [
  { label: 'Years building for the web', value: 6, suffix: '+' },
  { label: 'Client projects shipped', value: 10, suffix: '+' },
  { label: 'Client sites under SEO management', value: 12 },
  { label: 'Professional roles', value: 4 },
];
