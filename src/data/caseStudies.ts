/**
 * Case-study detail for the featured projects, merged into `projects` by slug.
 *
 * Every statement here is a restatement of the project's own description in
 * projects.ts or of the matching role in experience.ts. Nothing is inferred
 * beyond that: there are no measured results, timelines, or client quotes on
 * file, so `results`, `process`, and most `challenges` are deliberately unset.
 * Add them only from documented evidence. See MISSING-CONTENT.md.
 *
 * Screens are captures of the public live sites taken for this portfolio.
 */

import type { CaseStudy, ProjectScreens } from './types';

import d3Desktop from '../assets/projects/screens/d3digital-marketing-desktop.webp';
import d3Mobile from '../assets/projects/screens/d3digital-marketing-mobile.webp';
import edpDesktop from '../assets/projects/screens/estatedocprep-desktop.webp';
import edpMobile from '../assets/projects/screens/estatedocprep-mobile.webp';
import thiDesktop from '../assets/projects/screens/totalhomeinteriors-desktop.webp';
import thiMobile from '../assets/projects/screens/totalhomeinteriors-mobile.webp';
import hrDesktop from '../assets/projects/screens/hidden-roots-desktop.webp';
import hrMobile from '../assets/projects/screens/hidden-roots-mobile.webp';
import afcnDesktop from '../assets/projects/screens/advancedfootnurse-shop-desktop.webp';
import afcnMobile from '../assets/projects/screens/advancedfootnurse-shop-mobile.webp';
import defenseDesktop from '../assets/projects/screens/defense-attorney-funnel-desktop.webp';
import defenseMobile from '../assets/projects/screens/defense-attorney-funnel-mobile.webp';

const CAPTURED = 'Nov 2026';

interface CaseStudyEntry {
  screens?: ProjectScreens;
  caseStudy: CaseStudy;
}

export const caseStudies: Record<string, CaseStudyEntry> = {
  estatedocprep: {
    screens: { desktop: edpDesktop, mobile: edpMobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Lead-generation website',
      role: 'WordPress developer and SEO',
      objective:
        'Turn visitors into living-trust customers and seminar or webinar registrants, and reach people searching for living trusts and probate avoidance in all 50 states.',
      contributions: [
        'Built out the offer pages in WordPress with Elementor.',
        'Built the webinar and seminar funnels and the lead capture.',
        'Ran technical and on-page SEO targeting living-trust and probate-avoidance searches.',
      ],
      related: ['estatedocprep-ambassador-funnel', 'estatedocprep-white-label-funnel'],
    },
  },

  'hidden-roots': {
    screens: { desktop: hrDesktop, mobile: hrMobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Website with CRM intake',
      role: 'GoHighLevel developer',
      objective:
        'Give a mental health provider operating in Virginia, Texas, and Ohio one site where referrals and enquiries reach the right state team.',
      challenges: [
        'Intake comes from three states, and each referral has to land with the matching state team.',
      ],
      contributions: [
        'Built the site in GoHighLevel.',
        'Structured the location pages for Virginia, Texas, and Ohio.',
        'Built the state-specific referral forms and the careers and testimonials sections.',
        'Wired the referral and contact forms into the CRM pipeline so intake reaches the right state team.',
      ],
    },
  },

  totalhomeinteriors: {
    screens: { desktop: thiDesktop, mobile: thiMobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Local service website',
      role: 'Designer, developer, and SEO (ongoing)',
      objective:
        'Rank for local soundproofing and window-treatment searches in New Jersey and the New York Metro area.',
      contributions: [
        'Designed and built the site in WordPress with Elementor.',
        'Handle ongoing maintenance.',
        'Run technical and on-page SEO for local soundproofing and window-treatment searches.',
      ],
      related: ['soundproof-nj'],
    },
  },

  'advancedfootnurse-shop': {
    screens: { desktop: afcnDesktop, mobile: afcnMobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Shopify storefront',
      role: 'Store maintenance and SEO',
      contributions: [
        'Maintain the product catalogue: therapeutic footwear, Footlogix care products, compression socks, and off-loading devices.',
        'Maintain the collection pages, checkout and payment options, and gift cards.',
        'Run on-page SEO for the clinic and mobile-visit service areas across Ontario and New Brunswick.',
      ],
      related: ['advancefootnurse'],
    },
  },

  'd3digital-marketing': {
    screens: { desktop: d3Desktop, mobile: d3Mobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Agency website',
      role: 'Web developer (in-house at D3 Digital Marketing)',
      period: 'Jul 2025 – Aug 2026',
      contributions: [
        'Built the conversion-focused website for the WAVES Growth Operating System.',
      ],
      related: ['bestkeptsecret-visibility'],
    },
  },

  'defense-attorney-funnel': {
    screens: { desktop: defenseDesktop, mobile: defenseMobile, captured: CAPTURED },
    caseStudy: {
      projectType: 'Sales funnel',
      role: 'Funnel builder and CRM automation',
      objective: 'Sell a $75 initial case review and strategy call for a criminal defense practice.',
      contributions: [
        'Built the offer page end to end: hero and value stack, case-review highlights, testimonials, FAQ, and booking CTA.',
        'Set up appointment scheduling and follow-up automation in the CRM.',
      ],
    },
  },
};
