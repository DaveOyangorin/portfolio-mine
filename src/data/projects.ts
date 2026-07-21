/**
 * Client projects, transcribed from the live site's /projects listing and
 * detail pages. Slugs match the original URLs so existing links keep working.
 *
 * None of these are open source, so no `repoUrl` is set.
 */

import advancefootnurseImg from '../assets/projects/advancefootnurse.webp';
import axparaImg from '../assets/projects/axpara.png';
import climaspecImg from '../assets/projects/climaspec.png';
import d3Img from '../assets/projects/d3-digital-marketing.webp';
import linkedxlImg from '../assets/projects/linkedxl.webp';
import smcdataImg from '../assets/projects/smcdata.jpg';
import totalhomeinteriorsImg from '../assets/projects/totalhomeinteriors.avif';
import txconcretelevelingImg from '../assets/projects/txconcreteleveling.png';
import vamepleaseImg from '../assets/projects/vameplease.png';
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'd3digital-marketing',
    title: 'D3 Digital Marketing',
    description:
      'Built a clean, conversion-focused website for the WAVES Growth Operating System.',
    tags: [
      'WordPress',
      'Divi',
      'Beaver Builder',
      'WP Bakery',
      'CSS',
      'SEO',
      'Google Ads',
      'GoHighLevel',
      'Canva',
    ],
    liveUrl: 'https://www.d3digitalmedia.com/',
    image: d3Img,
    // White wordmark — needs a dark plate to be legible.
    imageTone: 'dark',
    featured: true,
  },
  {
    slug: 'linkedxl',
    title: 'LinkedXL',
    description:
      "Architect a custom business operating system that integrates the LinkedXL process with your organization's unique strengths, resources, and culture so you can win.",
    tags: [
      'WordPress',
      'Elementor',
      'AI Automation',
      'Social Media Management',
      'SEO',
      'Digital Marketing',
      'CSS',
      'Figma',
    ],
    liveUrl: 'https://linkedxl.com/',
    image: linkedxlImg,
    featured: true,
  },
  {
    slug: 'concreatelevelingtech',
    title: 'txconcreteleveling',
    description:
      'Built for a North American manufacturer of structural thermal breaks. B2B lead-gen site with product pages (ClimaSpec TB/CI), solution pages (balcony/canopy, façade, foundations, parapet/roof penetrations, windows/doors), and services (CAD/BIM, thermal modeling, specs). Fully responsive, SEO-ready, with resources, FAQs, and a blog on ASHRAE 90.1 and thermal breaks.',
    tags: ['WordPress', 'Divi', 'SEO', 'JavaScript', 'CSS', 'HTML'],
    liveUrl: 'https://www.txconcreteleveling.com/',
    image: txconcretelevelingImg,
    featured: true,
  },
  {
    slug: 'vameplease',
    title: 'VAMEPLEASE',
    description:
      'A modern consulting agency website designed to attract and convert business owners looking to scale. It highlights strategic services like website development, CRM management, automation, and SEO, supported by a clear process, strong messaging, and multiple call-to-actions.',
    tags: [
      'WordPress',
      'Elementor',
      'HTML',
      'CSS',
      'Figma',
      'SEO',
      'Digital Marketing',
      'Google Ads',
    ],
    liveUrl: 'https://vameplease.com/',
    image: vamepleaseImg,
    featured: true,
  },
  {
    slug: 'totalhomeinteriors',
    title: 'Totalhomeinteriors.tech',
    description:
      'I designed and built this site using Elementor. My role includes ongoing maintenance, as well as technical SEO and on-page SEO optimization to ensure the site ranks well for local soundproofing and window treatment searches in New Jersey and the New York Metro area.',
    tags: [
      'WordPress',
      'Elementor',
      'HTML',
      'CSS',
      'SEO',
      'Digital Marketing',
      'Google Ads',
    ],
    liveUrl: 'https://totalhomeinteriors.tech/',
    image: totalhomeinteriorsImg,
    featured: true,
  },
  {
    slug: 'smcdata',
    title: 'SMCDATA',
    description:
      'I manage and maintain this website, which is built on a custom platform. My responsibilities include ongoing site maintenance, technical SEO, and on-page SEO optimization to ensure strong visibility for supply chain and ERP solution searches in the manufacturing and distribution sectors.',
    tags: ['WordPress', 'Beaver Builder', 'HTML', 'CSS', 'SEO', 'Digital Marketing'],
    liveUrl: 'https://smcdata.com/',
    image: smcdataImg,
    featured: true,
  },
  {
    slug: 'axpara',
    title: 'Axapara Inc',
    description:
      'Clean, responsive, and visually engaging web pages using HTML, CSS, and JavaScript.',
    tags: ['Vue JS', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'PostgreSQL', 'SEO'],
    liveUrl: 'https://axpara.com/talent/v2/about-us',
    image: axparaImg,
    featured: false,
  },
  {
    slug: 'advancefootnurse',
    title: 'Advancefootnurse',
    description:
      'I manage and maintain this website using the Thinkific platform. My role includes ongoing site updates, technical SEO, and on-page SEO optimization. Additionally, I handle social media scheduling and posting via Publer to maintain consistent brand presence across platforms.',
    tags: [
      'WordPress',
      'CSS',
      'SEO',
      'Social Media Management',
      'Digital Marketing',
      'Google Ads',
    ],
    liveUrl: 'https://www.advancedfootnurse.com/',
    image: advancefootnurseImg,
    featured: false,
  },
  {
    slug: 'climaspec',
    title: 'Climaspec',
    description:
      'ClimaSpec is a leading provider of engineered structural thermal break systems and design support services focused on reducing thermal bridging and improving building envelope performance, helping professionals construct more sustainable, energy-efficient structures that meet modern building codes.',
    // The live detail page lists no tech tags for this project.
    tags: [],
    liveUrl: 'https://climaspec.com/',
    image: climaspecImg,
    featured: false,
  },
  {
    slug: 'heavenly-silk',
    title: 'Heavenly Silk',
    description:
      'I manage and update this site via the Duda platform according to client requests. This includes custom content changes, gallery updates, and form adjustments to ensure the site reflects the exact needs of Heavenly Silk Flowers.',
    tags: ['Duda', 'WordPress', 'HTML', 'CSS', 'SEO'],
    liveUrl: 'https://www.heavenlysilkflowers.com/',
    // The live site serves no image for this project — renders ProjectPlaceholder.
    image: null,
    featured: false,
  },
];

/** Projects shown in the homepage highlight grid. */
export const featuredProjects = projects.filter((project) => project.featured);

/** Looks up a project by slug, for the detail route. */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
