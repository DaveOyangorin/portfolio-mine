/**
 * Header motion: intro, scroll frosting, scroll-spy, and the mobile menu.
 *
 * This owns all of the header's behaviour so Header.astro stays markup-only.
 * The mobile menu is the one piece here that is interaction- rather than
 * scroll-driven, and it stays functional under reduced motion — the panel just
 * appears instead of sliding.
 */
import {
  gsap,
  ScrollTrigger,
  mm,
  MOTION_OK,
  MOTION_REDUCED,
  DURATION,
  EASE,
} from './core';

const ACTIVE_CLASS = 'text-[var(--accent)]';

/** Frosts the nav shell once the page has moved off the very top. */
function initHeaderScroll(): void {
  const shell = document.querySelector<HTMLElement>('[data-nav-shell]');
  if (!shell) return;

  const frostClasses = ['glass', 'shadow-[var(--shadow-card)]'];
  const sync = (frosted: boolean) => {
    frostClasses.forEach((cls) => shell.classList.toggle(cls, frosted));
  };

  /* A ScrollTrigger rather than a scroll listener: it is batched with every
     other trigger into one scroll handler, so this costs no extra frame work.
     The visual change itself is a CSS transition on the class.

     No `trigger`, so start/end are absolute scroll positions — active from 12px
     down to the bottom of the page. `onRefresh` matters as much as `onToggle`:
     landing directly on an #anchor starts the page mid-scroll, where onToggle
     alone would never fire and the header would sit unfrosted over content. */
  ScrollTrigger.create({
    start: 12,
    end: 'max',
    onToggle: (self) => sync(self.isActive),
    onRefresh: (self) => sync(self.isActive),
  });

  /* The browser's jump to an #anchor can land *after* ScrollTrigger's first
     refresh, so the trigger measures a scroll position of 0 and the header
     stays unfrosted over content. Reading the real position here covers it. */
  sync(window.scrollY > 12);
}

/** Highlights the nav link whose section currently owns the viewport. */
function initScrollSpy(): void {
  const links = gsap.utils.toArray<HTMLAnchorElement>('[data-spy-link]');
  if (links.length === 0) return;

  const setActive = (id: string | null) => {
    links.forEach((link) => {
      const isActive = link.dataset.spyLink === id;
      link.classList.toggle(ACTIVE_CLASS, isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  links.forEach((link) => {
    const section = document.getElementById(link.dataset.spyLink ?? '');
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      /* A band across the middle of the viewport. Whichever section is crossing
         it is the one being read, which tracks intent better than "topmost". */
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) setActive(section.id);
      },
    });
  });
}

/** Mobile menu open/close, with a staggered reveal of the links. */
function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const panel = menu.querySelector<HTMLElement>('[data-mobile-panel]') ?? menu;
  const links = gsap.utils.toArray<HTMLElement>('[data-mobile-link]', menu);
  const iconOpen = document.querySelector<SVGElement>('[data-menu-icon-open]');
  const iconClose = document.querySelector<SVGElement>('[data-menu-icon-close]');

  let isOpen = false;
  let tl: gsap.core.Timeline | null = null;

  /* `hidden` is the accessibility source of truth — it keeps the panel out of
     the tab order and the accessibility tree while closed. Animation only ever
     runs between toggling it. */
  const setChrome = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    iconOpen?.classList.toggle('hidden', open);
    iconOpen?.classList.toggle('block', !open);
    iconClose?.classList.toggle('hidden', !open);
    iconClose?.classList.toggle('block', open);
  };

  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setOpen = (open: boolean) => {
    if (open === isOpen) return;
    isOpen = open;
    setChrome(open);

    tl?.kill();

    if (reducedMotion()) {
      menu.hidden = !open;
      gsap.set([panel, ...links], { clearProps: 'all' });
      return;
    }

    if (open) {
      menu.hidden = false;
      tl = gsap
        .timeline({ defaults: { ease: EASE.out } })
        .fromTo(
          panel,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: DURATION.fast },
        )
        .fromTo(
          links,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: DURATION.fast, stagger: 0.04, clearProps: 'transform' },
          '-=0.2',
        );
    } else {
      tl = gsap.timeline({
        defaults: { ease: EASE.inOut },
        /* Hide only once the exit has finished, or the panel would vanish
           instantly and the animation would never be seen. */
        onComplete: () => {
          menu.hidden = true;
        },
      });
      tl.to(panel, { opacity: 0, y: -10, duration: 0.25 });
    }
  };

  /* Toggling off `isOpen` rather than `menu.hidden`: during the close animation
     the panel is still un-hidden (it hides on complete), so reading the attribute
     would misreport the state to a click landing mid-transition. */
  toggle.addEventListener('click', () => setOpen(!isOpen));

  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

export function initNav(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');

  mm.add(MOTION_OK, () => {
    if (header) {
      const tween = gsap.fromTo(
        header,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: DURATION.base, clearProps: 'transform' },
      );
      return () => tween.kill();
    }
  });

  mm.add(MOTION_REDUCED, () => {
    if (header) gsap.set(header, { opacity: 1, y: 0 });
  });

  initHeaderScroll();
  initScrollSpy();
  initMobileMenu();
}
