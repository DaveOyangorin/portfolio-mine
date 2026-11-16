/**
 * /llms.txt (https://llmstxt.org): a plain-text summary for AI assistants.
 *
 * Built only from existing site data, so it never says anything the site
 * doesn't. It focuses on the homepage: who Dave is and the three core
 * services (Website, SEO, Automation).
 */

import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION } from '../data/site';
import { profile } from '../data/profile';
import { services } from '../data/services';
import { skillGroups } from '../data/skills';
import { projects } from '../data/projects';
import { socials, contact } from '../data/socials';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const lines = [
    `# ${profile.name} — ${profile.title}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    ...profile.about.flatMap((paragraph) => [paragraph, '']),
    `Location: ${profile.location}. Open to: ${profile.openTo}`,
    '',
    '## Main page',
    '',
    `- [${profile.name} — portfolio](${url('/')}): who I am, services, experience, and how to contact me`,
    '',
    '## Services',
    '',
    ...services.map((service) => `- ${service.title}: ${service.description}`),
    '',
    '## Skills',
    '',
    ...skillGroups.map((group) => `- ${group.name}: ${group.items.join(', ')}`),
    '',
    '## Client work',
    '',
    `- [All projects](${url('/projects/')})`,
    ...projects.map((project) => `- [${project.title}](${url(`/projects/${project.slug}/`)}) (${project.category})`),
    '',
    '## Contact',
    '',
    ...(contact.email ? [`- Email: ${contact.email}`] : []),
    ...socials.map((social) => `- ${social.label}: ${social.url}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
