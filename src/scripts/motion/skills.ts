/**
 * Skills accordion — one expandable capability list per proficiency meter.
 *
 * Markup API (see components/sections/Skills.astro):
 *
 *   [data-skill-accordion]   the wrapper; scopes one accordion group
 *   [data-skill-toggle]      the <button>; carries aria-expanded + aria-controls
 *   [data-skill-panel]       the panel it controls
 *   [data-skill-icon]        the chevron inside the button, rotated on toggle
 *
 * Only one panel is open at a time. The collapsed start state lives in
 * global.css so nothing flashes open before this module parses.
 */
import { gsap, MOTION_REDUCED, DURATION, EASE, ScrollTrigger } from './core';

/** Rotation applied to the chevron when its panel is open. */
const ICON_OPEN_ROTATION = 180;

/**
 * Set while an open/close pair is mid-flight so a fast second click can't start
 * a competing tween. GSAP would resolve the overlap, but `height: auto` is
 * measured at tween *creation* — a panel caught mid-collapse would measure its
 * current height and expand to that instead of its full size.
 */
let animating = false;

function panelOf(button: HTMLElement): HTMLElement | null {
  const id = button.getAttribute('aria-controls');
  return id ? document.getElementById(id) : null;
}

function iconOf(button: HTMLElement): HTMLElement | null {
  return button.querySelector<HTMLElement>('[data-skill-icon]');
}

export function initSkills(): void {
  const groups = gsap.utils.toArray<HTMLElement>('[data-skill-accordion]');
  if (groups.length === 0) return;

  /* Duration is resolved per click rather than captured once, so flipping the OS
     reduced-motion setting mid-session takes effect on the very next toggle. */
  const durationOf = (): number =>
    window.matchMedia(MOTION_REDUCED).matches ? 0 : DURATION.fast;

  function close(button: HTMLElement, duration: number): void {
    const panel = panelOf(button);
    const icon = iconOf(button);
    if (!panel) return;

    button.setAttribute('aria-expanded', 'false');

    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration,
      ease: EASE.inOut,
      overwrite: true,
    });

    if (icon) gsap.to(icon, { rotate: 0, duration, ease: EASE.inOut, overwrite: true });
  }

  function open(button: HTMLElement, duration: number): void {
    const panel = panelOf(button);
    const icon = iconOf(button);
    if (!panel) return;

    button.setAttribute('aria-expanded', 'true');

    gsap.to(panel, {
      /* GSAP measures the natural height at tween creation and animates to that
         number, then writes `auto` back on completion — so the panel stays
         responsive to later reflows (font swap, window resize). */
      height: 'auto',
      opacity: 1,
      duration,
      ease: EASE.inOut,
      overwrite: true,
    });

    if (icon) {
      gsap.to(icon, {
        rotate: ICON_OPEN_ROTATION,
        duration,
        ease: EASE.inOut,
        overwrite: true,
      });
    }
  }

  groups.forEach((group) => {
    const buttons = gsap.utils.toArray<HTMLElement>('[data-skill-toggle]', group);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (animating) return;

        const isOpen = button.getAttribute('aria-expanded') === 'true';
        const duration = durationOf();

        /* Accordion behaviour: whatever else is open closes alongside, in the
           same beat, so the two heights trade off against each other. */
        buttons.forEach((other) => {
          if (other !== button && other.getAttribute('aria-expanded') === 'true') {
            close(other, duration);
          }
        });

        if (isOpen) close(button, duration);
        else open(button, duration);

        animating = true;
        gsap.delayedCall(duration, () => {
          animating = false;
          /* The section just changed height, so every trigger below it is now
             measuring against stale positions. */
          ScrollTrigger.refresh();
        });
      });
    });
  });
}
