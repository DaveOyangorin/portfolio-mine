/**
 * Hero intro — the one timeline that runs on load rather than on scroll.
 *
 * Kept deliberately brief. The h1 and the portrait are the LCP candidates, so
 * every extra millisecond of fade is a millisecond added to the measured LCP;
 * the whole sequence is under 1s end to end and starts with no leading delay.
 */
import { gsap, mm, MOTION_OK, MOTION_REDUCED, DURATION, EASE } from './core';

/**
 * Resting opacity of the decorative hero layers. These live here rather than as
 * Tailwind opacity classes because GSAP animates *to* them — a class would be
 * overwritten by the inline style the tween writes.
 */
const GLOW_OPACITY = 0.07;
const FRAME_OPACITY = 0.3;

export function initHero(): void {
  const items = gsap.utils.toArray<HTMLElement>('[data-hero]');
  const image = document.querySelector<HTMLElement>('[data-hero-image]');
  const glow = document.querySelector<HTMLElement>('[data-hero-glow]');
  const frame = document.querySelector<HTMLElement>('[data-hero-frame]');

  if (items.length === 0 && !image) return;

  mm.add(MOTION_OK, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE.out } });

    /* Text stack: badge, heading, subtitle, statement, CTAs, socials — in DOM
       order, so the markup stays the source of truth for sequencing. */
    if (items.length > 0) {
      tl.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          stagger: 0.08,
          clearProps: 'transform',
        },
      );
    }

    /* Portrait rises with the text rather than after it — a scale from 0.94
       reads as "settling into place" without ever looking like a zoom. */
    if (image) {
      tl.fromTo(
        image,
        { opacity: 0, scale: 0.94, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: DURATION.slow, clearProps: 'transform' },
        0.15,
      );
    }

    /* Decorative accents drift in last and slowest; they are background texture,
       not content, so they must never pull the eye during the intro. */
    if (glow) {
      tl.fromTo(glow, { opacity: 0 }, { opacity: GLOW_OPACITY, duration: 1.4 }, 0.1);
    }

    if (frame) {
      tl.fromTo(
        frame,
        { opacity: 0, x: -12, y: -12 },
        { opacity: FRAME_OPACITY, x: 0, y: 0, duration: DURATION.slow },
        0.45,
      );
    }

    return () => {
      tl.kill();
    };
  });

  mm.add(MOTION_REDUCED, () => {
    gsap.set([...items, image].filter(Boolean), { opacity: 1, scale: 1, x: 0, y: 0 });
    if (glow) gsap.set(glow, { opacity: GLOW_OPACITY });
    if (frame) gsap.set(frame, { opacity: FRAME_OPACITY });
  });
}
