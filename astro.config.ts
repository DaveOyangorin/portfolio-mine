// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/data/site';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => !new URL(url).pathname.startsWith('/404') })],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Inline small stylesheets to cut render-blocking requests.
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
