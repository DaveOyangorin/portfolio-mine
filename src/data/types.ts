/** Shared content types for the portfolio data layer. */

import type { ImageMetadata } from 'astro';

/** A named group used to bucket skills in the UI. */
export type SkillCategory =
  | 'CMS & Builders'
  | 'SEO & Marketing'
  | 'Front-End'
  | 'Design & Tools';

export interface Skill {
  /** Display name, exactly as shown on the live site. */
  name: string;
  /** Years of hands-on experience. */
  years: number;
  category: SkillCategory;
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
}

export interface Service {
  title: string;
  description: string;
  /** Key of an icon in components/icons/ServiceIcon.astro. */
  icon: string;
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
