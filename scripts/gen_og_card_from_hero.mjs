// Generate og_card.png/.webp (1200x630) as a clean derivative of the canonical
// hero render, per WO-2026-06-12-plumbweb-image-audit-and-update T4.
// Supersedes gen_og_card.py (type-led card) as the og-card generator.
// Run from repo root: node scripts/gen_og_card_from_hero.mjs
import sharp from 'sharp';
import { statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const SRC = join(root, 'public', 'assets', 'renders', 'plumb_render_kit_sage_bedding.png');
const OUT_PNG = join(root, 'public', 'assets', 'og_card.png');
const OUT_WEBP = join(root, 'public', 'assets', 'og_card.webp');

// 1200x630 center crop. No text overlay (brand image discipline: no text in images).
const base = sharp(SRC).resize(1200, 630, { fit: 'cover', position: 'attention' });
await base.clone().png({ compressionLevel: 9, quality: 90, palette: true }).toFile(OUT_PNG);
await base.clone().webp({ quality: 82 }).toFile(OUT_WEBP);
console.log(`og_card.png  ${Math.round(statSync(OUT_PNG).size / 1024)} KB`);
console.log(`og_card.webp ${Math.round(statSync(OUT_WEBP).size / 1024)} KB`);
