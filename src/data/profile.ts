/** Identity, hero copy, and about copy — sourced from the live portfolio. */

import avatar from '../assets/avatar.jpg';
import type { Stat } from './types';

export const profile = {
  name: 'Dave Oyangorin',
  /** Roles as listed in the live hero subheading. */
  title: 'WordPress Developer, SEO Specialist & Front-End Web Developer',
  shortTitle: 'WordPress Developer & SEO Specialist',
  location: 'Negros Oriental, Philippines',

  heroHeading: 'Hello, my name is Dave Oyangorin',
  heroSubheading:
    "Hello, I'm Dave Oyangorin, a WordPress Developer, SEO Specialist, and Front-End Web Developer based in Negros Oriental, Philippines.",
  heroStatement:
    'I assist businesses in creating fast, responsive, and SEO-friendly websites that not only look appealing but also rank well on Google, delivering tangible results.',

  about: [
    'I help companies build optimized digital properties with a focus on performance, user experience, and search visibility — turning site visitors into paying customers.',
    'My work spans WordPress development across Elementor, Divi, Beaver Builder, and WP Bakery, alongside platforms like Duda, GoHighLevel, and Thinkific. On the front end I build responsive interfaces with HTML, CSS, JavaScript, Vue.js, and Bootstrap.',
    'Beyond building, I handle ongoing maintenance, technical and on-page SEO, Google Ads campaigns, and social media scheduling — so client sites keep ranking and keep converting long after launch.',
  ],

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
