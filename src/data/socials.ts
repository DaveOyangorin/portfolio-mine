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
  ctaHeading: "Let's build something",
  ctaSubheading: 'that works.',
  ctaBody:
    "I'm open to opportunities in web development, SEO, digital marketing, and automation. Whether you're hiring a developer or need help improving your website and digital workflows, I'd be glad to discuss your project.",
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
