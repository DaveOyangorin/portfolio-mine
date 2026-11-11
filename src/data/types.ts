/** Shared content types for the portfolio data layer. */

import type { ImageMetadata } from 'astro';

/**
 * One skill category in the Skills section. Deliberately has no proficiency
 * score: tools are listed, not rated.
 */
export interface SkillGroup {
  /** Stable slug, used for the heading id. */
  id: string;
  /** Display name, e.g. "SEO & Digital Marketing". */
  name: string;
  /** One line of supporting context under the name. */
  description: string;
  /** Tools and capabilities. Order is display order. */
  items: string[];
}

/** Homepage project category; also shown as the card's route plate. */
export type ProjectCategory =
  | 'Website Development'
  | 'SEO & Digital Marketing'
  | 'CRM & Automation'
  | 'E-commerce';

/**
 * Case-study detail. Every field is optional and a section renders only when
 * its field is set — nothing is padded with placeholder copy.
 *
 * Only record what is documented: the project description, the matching
 * experience entry, or material supplied by Dave. Never invent objectives,
 * challenges, or results.
 */
export interface CaseStudy {
  /** e.g. "Lead-generation website". */
  projectType?: string;
  /** Dave's role, e.g. "Web developer (in-house)". */
  role?: string;
  /** Employer or engagement period, when known from the experience timeline. */
  period?: string;
  /** What the client or business set out to achieve, as documented. */
  objective?: string;
  /** Documented problems or requirements. */
  challenges?: string[];
  /** What Dave personally delivered. */
  contributions?: string[];
  /** Actual delivery stages, in order. */
  process?: string[];
  /** Verified outcomes only. Leave unset rather than estimate. */
  results?: string[];
  /** Collaborators to credit. */
  credits?: string;
  /** Slugs of related projects, linked from the case study. */
  related?: string[];
}

/** Desktop + mobile captures of the live site, shown on the case study. */
export interface ProjectScreens {
  desktop: ImageMetadata;
  mobile?: ImageMetadata;
  /** When the live site was captured, e.g. "Nov 2026". */
  captured: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  /** Human-readable range, e.g. "Jan 2025 – Mar 2026". */
  period: string;
  /** ISO dates powering <time> elements and JSON-LD. */
  startDate: string;
  /** `null` means the role is current. */
  endDate: string | null;
  /** Short duration label, e.g. "14 months". */
  duration: string;
  highlights: string[];
}

export interface Project {
  /** URL segment under /projects/. Must be unique. */
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Public URL of the live site. */
  liveUrl: string;
  /**
   * Source repository, when one is public.
   * All current projects are client sites with no public repo.
   */
  repoUrl?: string;
  /** Imported local asset; `null` renders the ProjectPlaceholder component. */
  image: ImageMetadata | null;
  /**
   * Backdrop for the logo plate.
   *
   * These are transparent client logos with their ink colour baked in, so the
   * plate cannot follow the site theme — a white-ink logo disappears on white.
   * Use 'dark' for light-ink logos, 'light' (the default) for dark-ink ones.
   * The plate stays the same colour in both light and dark mode.
   */
  imageTone?: 'light' | 'dark';
  /** Marks the project for the homepage highlight grid. */
  featured: boolean;
  category: ProjectCategory;
  /**
   * Label for the live link. GoHighLevel funnels are served from preview URLs,
   * so they read "View funnel" rather than "Live website".
   */
  liveLabel?: string;
  screens?: ProjectScreens;
  caseStudy?: CaseStudy;
}

/** A verified testimonial. Only add entries the client has approved. */
export interface Testimonial {
  quote: string;
  name: string;
  /** Position and/or company, only if verified. */
  role?: string;
  /** Slug of the related project, if any. */
  projectSlug?: string;
}

export interface Service {
  title: string;
  description: string;
  /** Key of an icon in components/icons/ServiceIcon.astro. */
  icon: string;
  /**
   * Basename (no extension) of a file in src/assets/services/, e.g. 'wordpress'
   * resolves wordpress.webp / .png / .jpg / .jpeg / .avif.
   *
   * Resolved at build time by a glob in sections/Services.astro rather than a
   * static import here, so a name pointing at a file that does not exist yet is
   * not a build error — the card just falls back to its icon until the file
   * lands. Drop the image in and it appears on the next build.
   */
  image?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  /** Key of an icon in components/icons/SocialIcon.astro. */
  icon: string;
}

export interface Stat {
  label: string;
  value: number;
  /** Rendered after the animated number, e.g. "+". */
  suffix?: string;
}
