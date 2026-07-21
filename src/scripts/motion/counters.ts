/**
 * Statistic counters.
 *
 * The final value is already in the HTML (for no-JS and for crawlers), so this
 * tweens a proxy object and writes the rounded value out on each frame rather
 * than animating anything layout-affecting.
 */
import { gsap, mm, MOTION_OK, MOTION_REDUCED, EASE } from './core';

export function initCounters(): void {
  const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
  if (counters.length === 0) return;

  mm.add(MOTION_OK, () => {
    counters.forEach((el) => {
      const target = Number(el.dataset.counter ?? '0');
      if (!Number.isFinite(target)) return;

      const proxy = { value: 0 };

      gsap.to(proxy, {
        value: target,
        duration: 1.6,
        ease: EASE.out,
        /* Zeroed here rather than up front, so a counter whose trigger never
           fires keeps its server-rendered value. Jumping straight to the footer
           (End key, a deep anchor, browser scroll restoration) can skip past a
           `once` trigger entirely — eager zeroing would strand it at 0. */
        onStart: () => {
          el.textContent = '0';
        },
        /* Digits are proportionally spaced, so the box would resize on every
           frame; `tabular-nums` on the element keeps the width fixed instead. */
        onUpdate: () => {
          el.textContent = String(Math.round(proxy.value));
        },
        /* Guarantees the exact target even if the tween is interrupted. */
        onComplete: () => {
          el.textContent = String(target);
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    });
  });

  mm.add(MOTION_REDUCED, () => {
    counters.forEach((el) => {
      el.textContent = String(Number(el.dataset.counter ?? '0'));
    });
  });
}
