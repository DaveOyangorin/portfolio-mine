/** Identity, hero copy, and about copy — sourced from the live portfolio. */

import avatar from '../assets/avatar.jpg';
import type { Stat } from './types';

export const profile = {
  name: 'Dave Oyangorin',
  /** Roles as listed in the live hero subheading. */
  title: 'Digital Marketing Specialist, WordPress Developer & SEO Specialist',
  shortTitle: 'WordPress Developer & SEO Specialist',
  location: 'Negros Oriental, Philippines',

  heroHeading: 'Hello, my name is Dave Oyangorin',
  heroSubheading:
    "I started my career in web development, building responsive websites and working extensively with WordPress. Over the years, I expanded beyond development into SEO, digital marketing, CRM automation, paid advertising, content, and lead-generation systems. Today, I combine technical development with digital marketing to help businesses build websites that attract traffic, generate leads, and support measurable growth.",
  heroStatement:
    'I started my career in web development, building responsive websites and working extensively with WordPress. Over the years, I expanded beyond development into SEO, digital marketing, CRM automation, paid advertising, content, and lead-generation systems. Today, I combine technical development with digital marketing to help businesses build websites that attract traffic, generate leads, and support measurable growth.',

  about: [
    'My career started in web development, where I spent years building responsive websites, working with WordPress, and developing front-end interfaces using HTML, CSS, JavaScript, Vue.js, and Bootstrap.',
    'As I worked more closely with businesses and their websites, my role naturally expanded beyond development. Building the website was only one part of the challenge. Businesses also needed traffic, leads, automation, tracking, and a strategy for turning visitors into customers. That led me deeper into digital marketing.',
    'Today, my work combines WordPress development, technical SEO, digital marketing, marketing automation, CRM systems, paid advertising, analytics, funnels, and content distribution. I have worked with WordPress platforms including Elementor, Divi, Beaver Builder, and WP Bakery, along with GoHighLevel, Duda, Thinkific, Shopify, and modern front-end technologies. On the marketing side, I work with technical and on-page SEO, Google Ads, GA4, Google Tag Manager, lead-generation funnels, email automation, social media content, CRM workflows, and AI-assisted marketing systems. My goal is no longer simply to launch a website. It is to build and improve the digital systems around it so the website can contribute to business growth.',
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
