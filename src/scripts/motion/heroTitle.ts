/**
 * Hero headline — per-letter entrance, powered by anime.js.
 *
 * anime.js is used only here: its elastic eases give the springy, letter-by-
 * letter feel this effect needs, while everything scroll-driven stays on GSAP.
 * Registered through the shared `mm` matchMedia so reduced-motion reverts work
 * exactly like the GSAP modules — the revert restores the unsplit markup, which
 * is itself the correct static end state, so no reduced-motion block is needed.
 */
import { animate, stagger } from 'animejs';
import { mm, MOTION_OK } from './core';

/**
 * Wraps every letter of the headline in its own span so anime.js can stagger
 * them. Letters are grouped into `whitespace-nowrap` word spans because bare
 * inline-block letters would happily line-break mid-word.
 *
 * The `.text-gradient` class is moved from the name's wrapper onto each of its
 * letters: Blink and WebKit stop clipping `background-clip: text` through any
 * descendant that carries its own transform, so a letter animating inside a
 * gradient parent would render invisible.
 */
function splitLetters(root: HTMLElement): HTMLElement[] {
  const letters: HTMLElement[] = [];

  const splitTextNode = (textNode: Text, letterClass: string): void => {
    const fragment = document.createDocumentFragment();

    for (const word of (textNode.textContent ?? '').split(/(\s+)/)) {
      if (word === '') continue;

      if (/^\s+$/.test(word)) {
        fragment.append(' ');
        continue;
      }

      const wordSpan = document.createElement('span');
      wordSpan.className = 'inline-block whitespace-nowrap';

      for (const char of word) {
        const charSpan = document.createElement('span');
        charSpan.className = letterClass;
        charSpan.textContent = char;
        letters.push(charSpan);
        wordSpan.append(charSpan);
      }

      fragment.append(wordSpan);
    }

    textNode.replaceWith(fragment);
  };

  const splitElement = (el: HTMLElement): void => {
    const isGradient = el.classList.contains('text-gradient');
    if (isGradient) el.classList.remove('text-gradient');

    const letterClass = isGradient ? 'inline-block text-gradient' : 'inline-block';

    for (const child of [...el.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        splitTextNode(child as Text, letterClass);
      } else if (child instanceof HTMLElement) {
        splitElement(child);
      }
    }
  };

  splitElement(root);
  return letters;
}

export function initHeroTitle(): void {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;

  mm.add(MOTION_OK, () => {
    const originalHtml = title.innerHTML;

    /* The label replaces the split-up content for assistive tech, which would
       otherwise read the headline letter by letter. */
    title.setAttribute('aria-label', title.textContent?.replace(/\s+/g, ' ').trim() ?? '');

    const letters = splitLetters(title);

    /* The elastic settle runs long, but the letters are readable almost
       immediately — opacity lands within 350ms so the h1 stays a viable LCP. */
    const animation = animate(letters, {
      y: { from: '0.6em', duration: 900, ease: 'outElastic(1, 0.75)' },
      opacity: { from: 0, duration: 350, ease: 'out(2)' },
      delay: stagger(26, { start: 80 }),
    });

    return () => {
      animation.revert();
      title.innerHTML = originalHtml;
      title.removeAttribute('aria-label');
    };
  });
}
