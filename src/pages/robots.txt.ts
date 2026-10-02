/** Generates robots.txt at build time so the sitemap URL tracks `site`. */

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site).href;
  const preventIndexing = import.meta.env.DEV || (import.meta.env.VERCEL_ENV && import.meta.env.VERCEL_ENV !== 'production');

  const body = `User-agent: *
${preventIndexing ? 'Disallow: /' : 'Allow: /'}

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
