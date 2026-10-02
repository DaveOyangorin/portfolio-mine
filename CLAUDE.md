## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## SEO content policy

Preserve the existing visible text, pages, homepage sections, design, and layout.
Do not add pages, blog posts, FAQs, location sections, hidden keywords, or expanded
copy for SEO. Prefer technical SEO, metadata, structured data, image delivery,
performance, crawlability, analytics, and existing internal links.

AI acts as an analyst and monitor. Use real Search Console and GA4 evidence, then
recommend a concrete change for human approval before implementation. Any proposed
visible wording change needs strong search evidence and approximately equal text
length. Never automatically write or publish content. Reporting scripts must only
write private report artifacts, never portfolio source files or deployments.

Run `npm run check`, `npm test`, `npm run build`, and `npm run seo:audit` after SEO
changes. The audit compares every rendered page against the pre-SEO portfolio
baseline; do not regenerate that baseline to conceal a content or layout change.
