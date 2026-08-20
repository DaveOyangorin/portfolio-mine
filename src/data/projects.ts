/**
 * Client projects, transcribed from the live site's /projects listing and
 * detail pages. Slugs match the original URLs so existing links keep working.
 *
 * None of these are open source, so no `repoUrl` is set.
 */

import advancedfootnurseShopImg from '../assets/projects/advancedfootnurse-shop.png';
import advancefootnurseImg from '../assets/projects/advancefootnurse.webp';
import axparaImg from '../assets/projects/axpara.png';
import climaspecImg from '../assets/projects/climaspec.png';
import d3Img from '../assets/projects/d3-digital-marketing.webp';
import estatedocprepImg from '../assets/projects/estatedocprep.png';
import linkedxlImg from '../assets/projects/linkedxl.webp';
import mandyslaundryImg from '../assets/projects/mandyslaundry.png';
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
    slug: 'advancedfootnurse-shop',
    title: 'AFCN Shop',
    description:
      "The Shopify storefront for Advanced Foot Care Nurse and Wellness Centre — \"The One Stop Foot Care Shop\". I maintain the catalogue of therapeutic footwear, Footlogix care products, compression socks and off-loading devices, plus collection pages, checkout and payment options, gift cards, and on-page SEO for their clinic and mobile-visit service areas across Ontario and New Brunswick.",
    tags: [
      'Shopify',
      'Liquid',
      'E-commerce',
      'CSS',
      'SEO',
      'Social Media Management',
      'Digital Marketing',
    ],
    liveUrl: 'https://shop.advancedfootnurse.com/',
    image: advancedfootnurseShopImg,
    featured: false,
  },
  {
    slug: 'estatedocprep',
    title: 'Estate Doc Prep',
    description:
      'A conversion-focused site for an online estate planning service that lets homeowners, parents, and retirees create an affordable, attorney-written living trust in about an hour. Built out the offer pages, webinar and seminar funnels, and lead capture, with technical and on-page SEO targeting living trust and probate-avoidance searches across all 50 states.',
    tags: [
      'WordPress',
      'Elementor',
      'HTML',
      'CSS',
      'Landing Pages',
      'SEO',
      'Digital Marketing',
      'Google Ads',
    ],
    liveUrl: 'https://estatedocprep.com/',
    image: estatedocprepImg,
    featured: false,
  },
  {
    slug: 'mandys-laundry',
    title: "Mandy's Laundry",
    description:
      "A local-service site for a Van Nuys laundromat — \"We Do Laundry, You Do Life!\". Structured the service pages around wash & fold, pickup and delivery, self-service, and commercial accounts for restaurants, medical offices, and hotels, with local SEO and service-area pages covering Los Angeles and Ventura County.",
    tags: [
      'WordPress',
      'Elementor',
      'HTML',
      'CSS',
      'Local SEO',
      'Digital Marketing',
      'Google Ads',
    ],
    liveUrl: 'https://mandyslaundry.com/',
    image: mandyslaundryImg,
    featured: false,
  },
  {
    slug: 'heavenly-silk',
    title: 'Heavenly Silk',
    description:
      'I manage and update this site via the Duda platform according to client requests. This includes custom content changes, gallery updates, and form adjustments to ensure the site reflects the exact needs of Heavenly Silk Flowers.',
    tags: ['Duda', 'GoHighLevel', 'WordPress', 'HTML', 'CSS', 'SEO'],
    liveUrl: 'https://www.heavenlysilkflowers.com/',
    // The live site serves no image for this project — renders ProjectPlaceholder.
    image: null,
    featured: false,
  },
  {
    slug: 'hidden-roots',
    title: 'Hidden Roots LLC',
    description:
      'A GoHighLevel-built site for a mental health provider offering crisis intervention, skill development, and tailored treatment plans across Virginia, Texas, and Ohio. Structured the location pages, state-specific referral forms, careers and testimonials sections, and wired the referral and contact forms into the CRM pipeline so intake reaches the right state team.',
    tags: [
      'GoHighLevel',
      'Landing Pages',
      'CRM',
      'Automation',
      'HTML',
      'CSS',
      'SEO',
    ],
    liveUrl: 'https://hiddenrootsllc.com/',
    image: null,
    featured: false,
  },
  {
    slug: 'estatedocprep-ambassador-funnel',
    title: 'Estate Doc Prep — Ambassador Funnel',
    description:
      'A GoHighLevel funnel recruiting referral partners for EstateDocPrep.com. Walks applicants through what ambassadors do, how the four-step program works, and the resources they can share — seminars, webinars, and free living trust accounts — before landing on a qualifying application form wired straight into the CRM pipeline.',
    tags: [
      'GoHighLevel',
      'Funnel Building',
      'Landing Pages',
      'CRM',
      'Automation',
      'Copywriting',
    ],
    liveUrl: 'https://sites.leadconnectorhq.com/preview/XPrpzn9TR3ZhU0mLTrsG',
    image: null,
    featured: false,
  },
  {
    slug: 'estatedocprep-white-label-funnel',
    title: 'Estate Doc Prep — White Label Funnel',
    description:
      'A B2B GoHighLevel funnel pitching EstateDocPrep.com’s white label program to insurance agencies, real estate offices, financial advisors, tax preparers, and mortgage professionals. Lays out the partner-branded sales process, intake workflow, CRM pipeline stages, and training, then qualifies applicants through a multi-step partner application.',
    tags: [
      'GoHighLevel',
      'Funnel Building',
      'Landing Pages',
      'CRM',
      'Automation',
      'Copywriting',
    ],
    liveUrl: 'https://sites.leadconnectorhq.com/preview/0Tw8EXQGHloyrm9Hm25j',
    image: null,
    featured: false,
  },
  {
    slug: 'defense-attorney-funnel',
    title: 'Defense Attorney Case Review Funnel',
    description:
      'A GoHighLevel funnel selling a $75 initial case review and strategy call for a criminal defense practice. Built the offer page end to end — hero and value stack, case review highlights, testimonials, FAQ, and booking CTA — with appointment scheduling and follow-up automation handled in the CRM.',
    tags: [
      'GoHighLevel',
      'Funnel Building',
      'Landing Pages',
      'Appointment Booking',
      'CRM',
      'Copywriting',
    ],
    liveUrl: 'https://sites.leadconnectorhq.com/preview/Twba3dvzJVqOLx0jx0wr',
    image: null,
    featured: false,
  },
  {
    slug: 'soundproof-nj',
    title: 'Soundproof NJ',
    description:
      'A GoHighLevel site for Total Home Interiors’ commercial contracting arm — custom acoustic solutions, complete build-outs, AV, building automation, and enterprise network infrastructure across New Jersey and the NY Metro area. Organized the industry pages for restaurants, offices, studios, schools, houses of worship, and healthcare, with a free-consultation CTA feeding the CRM.',
    tags: [
      'GoHighLevel',
      'Funnel Building',
      'Landing Pages',
      'CRM',
      'Local SEO',
      'Digital Marketing',
    ],
    liveUrl: 'https://soundproofnj.com/home-page-page',
    image: null,
    featured: false,
  },
  {
    slug: 'bestkeptsecret-visibility',
    title: 'Best Kept Secret — Visibility Page',
    description:
      'A GoHighLevel registration funnel for D3 Digital Media’s five-day live workshop for consultants, coaches, and independent experts. Built the long-form sales page, three-tier pricing (General, VIP, Platinum), bonus stack, guarantee, and deadline-driven CTAs, with checkout and enrollment automation running through the CRM.',
    tags: [
      'GoHighLevel',
      'Funnel Building',
      'Landing Pages',
      'CRM',
      'Automation',
      'Copywriting',
      'Digital Marketing',
    ],
    liveUrl: 'https://bestkeptsecret.ai/bks---visibility-page',
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
