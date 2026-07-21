/** Shared content types for the portfolio data layer. */

import type { ImageMetadata } from 'astro';

/**
 * One discipline, rendered as a proficiency meter that expands to reveal the
 * tools and capabilities behind it.
 */
export interface SkillMeter {
  /** Stable slug, used to wire the button to its panel via aria-controls. */
  id: string;
  /** Display name, e.g. "Technical SEO". */
  name: string;
  /** Years of hands-on experience. Scales the bar. */
  years: number;
  /** Rendered straight after the number, e.g. "+" for "5+ years". */
  suffix?: string;
  /** One line of supporting context under the name. */
  description: string;
  /** The capability breakdown shown when expanded. Order is display order. */
  items: string[];
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
