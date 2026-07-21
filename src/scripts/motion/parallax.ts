/**
 * Parallax for decorative background elements only.
 *
 * Deliberately restrained: a `scrub` drift of a few dozen pixels on elements
 * that carry no information. Content never parallaxes — moving text at a
 * different rate to its container is the fastest way to make a site feel cheap
 * and is a common motion-sickness trigger.
 *
 *   data-parallax="-60"   px travelled across the element's scroll span
 */
import { gsap, mm, MOTION_OK, MOTION_REDUCED } from './core';

export function initParallax(): void {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]');
  if (layers.length === 0) return;

  mm.add(MOTION_OK, () => {
    layers.forEach((el) => {
      const distance = Number(el.dataset.parallax ?? '-60');
      if (!Number.isFinite(distance) || distance === 0) return;

      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          /* A slight lag behind the scrollbar; `true` would pin it exactly and
             lose the softness that makes the effect read as depth. */
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
  });

  mm.add(MOTION_REDUCED, () => {
    gsap.set(layers, { y: 0 });
  });
}
