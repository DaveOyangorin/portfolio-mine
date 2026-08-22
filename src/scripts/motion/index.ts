/**
 * Motion entry point. Imported once, from Layout.astro.
 *
 * Order matters slightly: the hero timeline starts immediately, while every
 * scroll-driven module only creates triggers. The refreshes at the end run once
 * all triggers exist, so their start/end positions are measured together rather
 * than each module forcing its own layout read.
 */
import { ScrollTrigger } from './core';
import { initReveal } from './reveal';
import { initHero } from './hero';
import { initHeroTitle } from './heroTitle';
import { initNav } from './nav';
import { initCounters } from './counters';
import { initParallax } from './parallax';
import { initSkills } from './skills';

/** Set once the visitor takes control, so nothing yanks the page under them. */
let userScrolled = false;

const markUserScroll = () => {
  userScrolled = true;
};

/**
 * Re-applies the URL's #anchor.
 *
 * Creating a ScrollTrigger runs an internal refresh that saves and restores the
 * scroll position. On a page loaded directly at an #anchor the browser's scroll
 * to that target is still in flight at that moment (html sets
 * `scroll-behavior: smooth`), so the restore pins the page at the top and the
 * visitor lands on the hero instead of the section they asked for.
 *
 * Jumping instantly is also the right behaviour for a deep link — the smooth
 * animation belongs to in-page nav clicks, which are unaffected by any of this.
 */
function restoreAnchor(): void {
  if (userScrolled) return;

  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
}

function start(): void {
  /* Registered before anything else so a visitor who scrolls during setup is
     never overridden by the anchor restores below. */
  window.addEventListener('wheel', markUserScroll, { passive: true, once: true });
  window.addEventListener('touchstart', markUserScroll, { passive: true, once: true });
  window.addEventListener('keydown', markUserScroll, { once: true });

  initNav();
  initHero();
  initHeroTitle();
  initReveal();
  initCounters();
  initParallax();
  initSkills();

  restoreAnchor();

  /* Two things move trigger positions after this module runs: web fonts
     reflowing the text, and images settling. Both refreshes are cheap and
     resolve immediately when there is nothing to wait for. Each is followed by
     an anchor restore, for the same save/restore reason described above. */
  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
    restoreAnchor();
  });

  window.addEventListener(
    'load',
    () => {
      ScrollTrigger.refresh();
      restoreAnchor();
    },
    { once: true },
  );
}

start();
