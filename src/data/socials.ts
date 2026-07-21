/** External profiles, exactly as linked from the live site. */

import type { SocialLink } from './types';

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/DaveOyangorin',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dave-oyangorin-5727712b0/',
    icon: 'linkedin',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/finaldeath2',
    icon: 'facebook',
  },
];

/**
 * Direct contact details.
 *
 * The live site exposes no email address or phone number — its contact CTA is a
 * form posting to a backend. Fill `email` in to enable the mailto: CTAs; until
 * then the contact section falls back to LinkedIn. See MISSING-CONTENT.md.
 */
export const contact = {
  email: '' as string,
  phone: '' as string,
  location: 'Negros Oriental, Philippines',
  ctaHeading: 'Project in mind?',
  ctaSubheading: "Let's talk.",
  ctaBody:
    'Whether you need a new website, better rankings, or reliable ongoing maintenance — send me the details and I will get back to you.',
} as const;

/**
 * Résumé / CV download.
 *
 * The live site renders a "Download CV" button with no resolvable file URL.
 * Drop the PDF at `public/dave-oyangorin-cv.pdf` and set `available` to true.
 * See MISSING-CONTENT.md.
 */
export const resume = {
  available: false,
  path: '/dave-oyangorin-cv.pdf',
} as const;
