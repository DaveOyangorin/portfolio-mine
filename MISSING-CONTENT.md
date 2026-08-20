# Missing content checklist

Everything below could **not** be extracted from <https://dave-portfolio-phi.vercel.app/>.
Nothing here has been invented or guessed — each item is either left blank with a
working fallback, or flagged. Fill these in and the site is complete.

---

## 1. Email address — **blocked**

The live site publishes no email anywhere in its markup. Its contact CTA posts to a
backend form, so there is no address to read.

**Effect right now:** the hero and contact CTAs fall back to your LinkedIn profile.

**To fix:** set the address in [`src/data/socials.ts`](src/data/socials.ts):

```ts
export const contact = {
  email: 'you@example.com', // ← add this
```

The mailto: buttons, the footer link, and the `email` field in JSON-LD all switch on
automatically.

---

## 2. Résumé / CV file — **blocked**

The live site renders a "Download CV" button, but it resolves to no file URL — there is
nothing to download from it.

**Effect right now:** the hero shows a "View LinkedIn" button instead; the contact
section omits the download button.

**To fix:** drop the PDF at `public/dave-oyangorin-cv.pdf`, then in
[`src/data/socials.ts`](src/data/socials.ts):

```ts
export const resume = {
  available: true, // ← flip this
  path: '/dave-oyangorin-cv.pdf',
};
```

---

## 3. Phone number — **blocked**

Not published on the live site. Optional — add to `contact.phone` in
[`src/data/socials.ts`](src/data/socials.ts) if you want it shown.

---

## 4. Certifications — **not present on the live site**

Your brief asked for a certifications section. The live site has none: no
certifications, awards, or achievements section exists anywhere on it.

**Nothing was fabricated.** No certifications section was built. If you have
certifications to show, send me the list (name, issuer, date, credential URL) and I
will add `src/data/certifications.ts` plus a matching section.

---

## 5. Services — **derived, needs your review**

Your brief asked for a services section. The live site has none.

Rather than invent services, the six entries in
[`src/data/services.ts`](src/data/services.ts) were **derived only from work already
evidenced** in your skills, experience, and projects — WordPress development, SEO,
front-end, maintenance, Google Ads, social media. No new capability is claimed.

**Action:** read the wording and adjust, or delete the file and remove `<Services />`
from `src/pages/index.astro`.

---

## 6. Project images — **missing for seven projects**

No image exists locally for these entries:

- `heavenly-silk` — the live site serves no image for it.
- `hidden-roots`, `estatedocprep-ambassador-funnel`, `estatedocprep-white-label-funnel`,
  `defense-attorney-funnel`, `soundproof-nj`, `bestkeptsecret-visibility` — the
  GoHighLevel sites and funnels, added from links only. The LeadConnector preview URLs
  block scraping, so no screenshot could be captured automatically.

**Effect right now:** each renders `ProjectPlaceholder.astro` — a branded tile with the
project's initials.

**To fix:** drop a screenshot into `src/assets/projects/`, then in
[`src/data/projects.ts`](src/data/projects.ts) import it and set `image:` on that entry.

---

## 7. Climaspec tech stack — **missing**

The Climaspec detail page on the live site lists no technology tags. Its `tags` array is
empty and the tech-stack block is hidden for that project. Add the tags to
[`src/data/projects.ts`](src/data/projects.ts) when you have them.

---

## 8. GitHub repository links — **none exist**

All projects are client websites with no public repository. The live site links only
to live sites, never to source. Project cards therefore show "Visit site" only.

The `Project` type already supports `repoUrl?: string` — set it on any project that gains
a public repo and a "View source" button appears automatically.

---

## 9. `SITE_URL` — confirm before launch

[`src/data/site.ts`](src/data/site.ts) is set to
`https://dave-portfolio-phi.vercel.app`. This drives canonical URLs, the sitemap,
robots.txt, and OG tags.

**If you deploy to a new Vercel URL or a custom domain, update this first** — otherwise
canonicals will point at the old site and you will split your SEO signals between two
domains.

---

## Fixed along the way

- **Meta keywords were wrong on the live site.** They targeted "Website Development in
  Ranchi, India" — leftovers from the original template, unrelated to you. Replaced in
  `src/data/site.ts` with keywords matching your actual services and location.
- **Page title was just "Dave".** Now a descriptive, keyword-bearing title.
- **`twitter:card` was `summary`** (small thumbnail). Now `summary_large_image`.
- **Skill and social icons were hotlinked from `img.icons8.com`.** Replaced with local
  inline SVGs — no third-party requests, no external dependency.
