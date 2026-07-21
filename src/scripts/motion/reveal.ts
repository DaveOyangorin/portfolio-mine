/**
 * Scroll reveals — the workhorse used by ~30 elements across the site.
 *
 * Markup API (unchanged from the IntersectionObserver version it replaces, so
 * no component had to be rewritten):
 *
 *   data-reveal                     opt in
 *   style="--reveal-delay: 90ms"    stagger within a group
 *   data-reveal-from="left|right"   slide in horizontally instead of upward
 *   data-reveal-scale               also settle up from 96% — for cards
 *
 * The matching `opacity: 0` start state lives in global.css so nothing flashes
 * before this module parses.
 */
import { gsap, mm, MOTION_OK, MOTION_REDUCED, DURATION, TRAVEL } from './core';

/** Reads `--reveal-delay` (authored in ms) off the element, in seconds. */
function delayOf(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
  if (!raw) return 0;
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms / 1000 : 0;
}

/** Start offset for the element, honouring an optional horizontal direction. */
function offsetOf(el: HTMLElement): { x: number; y: number } {
  const from = el.dataset.revealFrom;
  if (from === 'left') return { x: -32, y: 0 };
  if (from === 'right') return { x: 32, y: 0 };
  return { x: 0, y: TRAVEL };
}

export function initReveal(): void {
  const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (elements.length === 0) return;

  mm.add(MOTION_OK, () => {
    elements.forEach((el) => {
      const { x, y } = offsetOf(el);

      /* 0.96 is deliberately shallow. Anything deeper reads as a "pop" and,
         because scale drives layout-independent compositing, a large value on a
         wide card visibly softens its text mid-tween. */
      const scale = el.hasAttribute('data-reveal-scale') ? 0.96 : 1;

      gsap.fromTo(
        el,
        { opacity: 0, x, y, scale },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: DURATION.base,
          delay: delayOf(el),
          /* Drops the inline transform once settled, so hover lifts (plain CSS
             transforms) aren't fighting a leftover matrix from GSAP. */
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            /* Fires when the element is ~12% up the viewport: late enough to feel
               deliberate, early enough that nothing is ever caught mid-fade. */
            start: 'top 88%',
            once: true,
          },
        },
      );
    });
  });

  /* Reduced motion: content is simply present. No tweens, no triggers. */
  mm.add(MOTION_REDUCED, () => {
    gsap.set(elements, { opacity: 1, x: 0, y: 0 });
  });
}
