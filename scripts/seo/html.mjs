import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function nodes(root, predicate) {
  const found = [];
  const visit = (node) => {
    if (predicate(node)) found.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(root);
  return found;
}

export const attr = (node, name) => node?.attrs?.find((entry) => entry.name === name)?.value;
export const content = (node) => node?.nodeName === '#text'
  ? node.value : (node?.childNodes ?? []).map(content).join('');
export const tags = (root, name) => nodes(root, (node) => node.tagName === name);

export function document(html) {
  const root = parse(html);
  const meta = (name) => attr(tags(root, 'meta').find((node) =>
    attr(node, 'name') === name || attr(node, 'property') === name), 'content');
  return {
    root, meta,
    title: content(tags(root, 'title')[0]),
    description: meta('description'),
    canonical: attr(tags(root, 'link').find((node) => attr(node, 'rel') === 'canonical'), 'href'),
    noindex: /\bnoindex\b/i.test(meta('robots') ?? ''),
  };
}

// Preserve the rendered body, including classes, inline styles, text, and alt text.
// Only technical image attributes, script code, and equivalent URL slashes may vary.
export function bodyFingerprint(root) {
  const ignored = new Set(['src', 'srcset', 'sizes', 'loading', 'decoding', 'fetchpriority']);
  function normalize(node) {
    if (node.nodeName === '#comment' || node.tagName === 'script') return null;
    if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ')
      .replace(/© \d{4}(?= Dave Oyangorin\. All rights reserved\.)/, '© [year]');
    const attrs = (node.attrs ?? []).filter((entry) => !(node.tagName === 'img' && ignored.has(entry.name)))
      .map(({ name, value }) => [name, name === 'href' ? value.replace(/^\/projects\/?(?=#|$)/, '/projects/') : value]);
    return [node.nodeName, attrs, (node.childNodes ?? []).map(normalize).filter((item) => item !== null)];
  }
  return createHash('sha256').update(JSON.stringify(normalize(tags(root, 'body')[0]))).digest('hex');
}

export async function htmlFiles(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const file = join(prefix, entry.name);
    if (entry.isDirectory() && entry.name !== '_astro') result.push(...await htmlFiles(directory, file));
    else if (entry.isFile() && file.endsWith('.html')) result.push(file.replaceAll('\\', '/'));
  }
  return result.sort();
}

export async function builtPages(directory = 'dist') {
  return Promise.all((await htmlFiles(directory)).map(async (file) => ({
    file,
    path: file === 'index.html' ? '/' : file.endsWith('/index.html')
      ? `/${file.slice(0, -10)}` : `/${file}`,
    ...document(await readFile(join(directory, file), 'utf8')),
  })));
}
