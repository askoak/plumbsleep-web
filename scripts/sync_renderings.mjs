// Sync curated OneDrive Renderings into public/assets/{renders,sketches,illustrations,diagrams}/
// per WO-2026-06-12-plumbweb-image-audit-and-update T2.
// Source folder is Mike-curated: whatever exists there is canonical; deleted files must not return.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const SRC = 'C:\\Users\\Hello\\OneDrive - Michael Oak Advisors\\99_Public Folder\\Plumb\\plumb-coordination\\Renderings';
const DST = join(import.meta.dirname, '..', 'public', 'assets');

function subdirFor(name) {
  if (name.startsWith('plumb_render_') || name.startsWith('plumb_lifestyle_')) return 'renders';
  if (name.startsWith('plumb_sketch_')) return 'sketches';
  if (name.startsWith('plumb_illustration_') || name.startsWith('plumb_palette_')) return 'illustrations';
  if (name.startsWith('plumb_diagram_') || name.startsWith('plumb_spec_')) return 'diagrams';
  return 'renders';
}

// Hero-class shots get 1500px max width; inline imagery gets 800px (per WO T2c).
const HERO_WIDTH = 1500, INLINE_WIDTH = 800;

const files = readdirSync(SRC).filter(f => f.toLowerCase().endsWith('.png'));
for (const dir of ['renders', 'sketches', 'illustrations', 'diagrams']) {
  mkdirSync(join(DST, dir), { recursive: true });
}

for (const file of files) {
  // Normalize Mike's ordering prefixes like "1. " out of web filenames.
  const clean = basename(file).replace(/^\d+\.\s*/, '');
  const dir = subdirFor(clean);
  const maxW = dir === 'renders' ? HERO_WIDTH : INLINE_WIDTH;
  const stem = clean.replace(/\.png$/i, '');
  const img = sharp(join(SRC, file)); // handles webp-masquerading-as-png (palette file)
  const meta = await img.metadata();
  const width = Math.min(meta.width, maxW);
  const pngOut = join(DST, dir, `${stem}.png`);
  const webpOut = join(DST, dir, `${stem}.webp`);
  await img.clone().resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9, palette: false }).toFile(pngOut);
  await img.clone().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webpOut);
  console.log(`${file} -> ${dir}/${stem} @${width}px`);
}
console.log('done');
