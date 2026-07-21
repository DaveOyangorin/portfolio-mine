/**
 * Renders public/og-image.svg to a PNG.
 *
 * Social platforms (Facebook, LinkedIn, X) do not render SVG previews, so the
 * PNG is what BaseHead.astro actually references. Re-run after editing the SVG:
 *
 *   npm run og
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const svgPath = fileURLToPath(new URL('../public/og-image.svg', import.meta.url));
const pngPath = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

const svg = await readFile(svgPath);
const png = await sharp(svg, { density: 144 }).resize(1200, 630).png({ quality: 90 }).toBuffer();

await writeFile(pngPath, png);

console.log(`og-image.png written (${(png.length / 1024).toFixed(1)} kB)`);
