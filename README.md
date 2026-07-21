# Dave Oyangorin — Portfolio

Static portfolio built with **Astro**, **TypeScript**, and **Tailwind CSS v4**.
No framework runtime, no database, no CMS, no content APIs — every piece of content
lives in typed files under `src/data/`.

> **Before deploying, read [MISSING-CONTENT.md](MISSING-CONTENT.md).** It lists the few
> items that could not be extracted from the live site (email address, CV file) and
> exactly where to add them.

---

## Commands

| Command           | Action                                        |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Dev server at <http://localhost:4321>         |
| `npm run build`   | Production build to `dist/`                   |
| `npm run preview` | Preview the production build locally          |
| `npm run check`   | Type-check `.astro` and `.ts` files           |
| `npm run og`      | Regenerate `public/og-image.png` from the SVG |

---

## Editing content

All content is in `src/data/`. Nothing else needs touching for routine updates.

| File            | Holds                                                     |
| --------------- | --------------------------------------------------------- |
| `site.ts`       | Canonical URL, meta title/description, keywords            |
| `profile.ts`    | Name, hero copy, about paragraphs, statistics              |
| `projects.ts`   | All ten projects — slugs, copy, tags, live URLs, images    |
| `experience.ts` | Work history timeline                                      |
| `skills.ts`     | Skills, years, and their categories                        |
| `services.ts`   | Services grid (**derived content** — see MISSING-CONTENT)  |
| `socials.ts`    | Social profiles, contact details, résumé config            |
| `nav.ts`        | Navigation items                                           |
| `types.ts`      | Shared types for all of the above                          |

Everything is typed, so `npm run check` catches a missing field or a bad slug before it
reaches the browser.

### Adding a project

1. Put the image in `src/assets/projects/`.
2. Import it at the top of `src/data/projects.ts`.
3. Append an entry to the `projects` array.

The detail page at `/projects/<slug>/`, the projects index, the tag filter, and the
sitemap all pick it up automatically.

---

## Architecture

```
src/
├── assets/          Local images (optimized at build time by Astro/sharp)
├── components/
│   ├── icons/       Icon.astro — one inline SVG sprite, no icon CDN
│   ├── layout/      Header, Footer
│   ├── sections/    Homepage sections
│   ├── seo/         BaseHead (meta), StructuredData (JSON-LD)
│   └── ui/          Reusable primitives (Button, Section, ProjectCard, …)
├── data/            All content — see table above
├── layouts/         Layout.astro — document shell + global scripts
├── pages/           Routes; robots.txt.ts generates robots at build time
└── styles/          global.css — design tokens and base styles
```

### Design system

Colours, fonts, and shadows are CSS custom properties in `src/styles/global.css`.
The emerald accent and the Inter / IBM Plex Mono pairing are carried over from the
previous site. Light and dark are both supported: semantic tokens (`--surface`,
`--text-body`, `--accent`, …) are remapped under `:root[data-theme='dark']`, so no
component hardcodes a colour.

The theme is applied by a small inline script in `<head>` **before first paint**, so
there is no flash of the wrong theme. The choice persists to `localStorage`; the default
follows `prefers-color-scheme`.

### JavaScript

The site ships **~2.4 kB** of JavaScript in total, all deferred:

- scroll reveal (IntersectionObserver)
- animated statistic counters
- nav scroll-spy
- mobile menu, theme toggle, scroll progress, back-to-top
- project tag filtering on `/projects`

Every one is progressive enhancement. Without JS, all content is visible (a `.no-js`
guard disables the reveal transforms), all links work, and the filter bar stays hidden
rather than rendering a dead control. All animation is disabled under
`prefers-reduced-motion: reduce`.

### Accessibility

Skip link, one `<h1>` per page, semantic landmarks, visible focus rings on all
interactive elements, `aria-current` on the active nav item, labelled icon buttons,
`aria-live` announcements for filter results, keyboard-dismissible mobile menu, and alt
text on every image. Decorative elements are `aria-hidden`.

### SEO

Per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards
(1200×630 PNG), JSON-LD (a `Person` + `WebSite` graph on the homepage, `CreativeWork` on
project pages), a generated `sitemap-index.xml`, and a `robots.txt` whose sitemap URL
tracks `SITE_URL`.

Project slugs deliberately match the previous site's URLs (`/projects/axpara`,
`/projects/concreatelevelingtech`, …) so existing inbound links and rankings carry over.

---

## Deploying to Vercel

The repo includes `vercel.json`. Import the project in Vercel and it will detect Astro:

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`

**Set `SITE_URL` in `src/data/site.ts` to the final domain before the first deploy** —
it drives canonicals, the sitemap, and OG URLs.

---

## Sources

Content was extracted from the live site at <https://dave-portfolio-phi.vercel.app/> and
its ten project detail pages. The old React project at `../developer-portfolio` was
**not** used as a content source — its data files still contain unmodified template
placeholders (a `janedoe.test@gmail.com` address and eight fictional projects).
