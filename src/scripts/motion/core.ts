/**
 * Shared GSAP setup.
 *
 * Every motion module imports gsap from here rather than from 'gsap' directly,
 * so the plugin is registered exactly once and the timing vocabulary below is
 * the single place durations and eases are defined.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile browsers fire a resize every time the address bar collapses. Without
 * this, ScrollTrigger recalculates every trigger mid-scroll and the page judders.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Duration scale, in seconds. Reused so nothing drifts out of step. */
export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
} as const;

/**
 * `power3.out` is the workhorse: quick to start, long gentle settle. It reads as
 * "premium" precisely because the tail is slow enough to notice but never waited on.
 */
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
} as const;

/** Travel distance for fade-up reveals. Small on purpose — big moves read as cheap. */
export const TRAVEL = 18;

gsap.defaults({ ease: EASE.out, duration: DURATION.base });

export { gsap, ScrollTrigger };

/**
 * A single matchMedia instance for the whole site.
 *
 * Modules register their animations under `(prefers-reduced-motion: no-preference)`
 * and their static end-state under `(prefers-reduced-motion: reduce)`. GSAP then
 * reverts the correct set automatically when the user flips the OS setting
 * mid-session — which is why this is preferred over a one-time boolean check.
 */
export const mm = gsap.matchMedia();

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';
