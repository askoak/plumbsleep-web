# plumbsleep-web image inventory — 2026-06-12

WO: WO-2026-06-12-plumbweb-image-audit-and-update, task T1.
Ground truth verified live (d15): grep of `public/` tree at branch `engineer/wo-image-audit-20260612`,
OneDrive Renderings folder listed at 2026-06-12 17:42 EDT.

## 1. Image references by page

### index.html (homepage)
| Asset | Lines | Usage |
|---|---|---|
| `assets/plumb_render_system_sage_blue_front.png/.webp` | 95-96, 288-289, 344-345 | **WRONG GEOMETRY** — hero + 2 gallery slots |
| `assets/sketches/sketch_01_assembled.png/.webp` | 249-250, 281-282, 337-338 | gallery/cards |
| `assets/sketches/sketch_02_exploded.png/.webp` | 257-258 | gallery |
| `assets/sketches/sketch_03_man.png/.webp` | 156-157, 295-296, 351-352 | in-use cards |
| `assets/sketches/sketch_04_woman.png/.webp` | 164-165, 309-310, 365-366 | in-use cards |
| `assets/sketches/sketch_05_pregnant.png/.webp` | 323-324, 379-380 | in-use cards |
| `assets/cushion_family.jpg/.webp` | 223-224, 316-317, 372-373 | foam thickness illustration |
| `assets/hero_dune.jpg/.webp` | 302-303, 358-359, 477-478 | dune lifestyle |
| `assets/pairing.jpg/.webp` | 330-331, 386-387, 440-441 | sizing illustration |
| `assets/logos/logo_C.jpg/.webp` | 38-39, 610-611 | logo |
| `https://plumbsleep.com/assets/og_card.png` | 13, 17 | og:image + twitter:image |

### investors/index.html
| Asset | Lines | Usage |
|---|---|---|
| `/assets/investors/fig1_loading_geometry.svg` | 434 | figure — correct, keep |
| `/assets/investors/plumb_render_system_sage_blue_front.png/.webp` | 445-446 | **WRONG GEOMETRY** — product figure |
| `/assets/investors/fig3_thigh_distribution.svg` | 460 | figure — correct, keep |
| `/assets/sketches/sketch_01..06` | 488-545 | working sketches section |
| `/assets/hero_image.jpg/.webp` | 559-560 | annotated study |
| `/assets/hero_dune.jpg/.webp` | 568-569 | lifestyle |
| `/assets/cushion_family.jpg/.webp` | 577-578 | illustration |
| `/assets/pairing.jpg/.webp` | 586-587 | illustration |
| `/assets/color_palette.jpg/.webp` | 602-603 | palette |
| `/assets/logos/logo_C.jpg/.webp` | 144-145, 173-174 | logo |
| (no og:image meta tag on this page) | — | gap, pre-existing |

### press/index.html (press kit w/ download links)
`hero_image` (364-373), `cushion_family` (398-407), `hero_dune` (415-424),
`pairing` (381-390), `color_palette` (432-441), `logo_C` (168, 347-356, 516-517),
`og_card` (13). Each asset appears as display + download-link pair.

### expecting/index.html
`sketch_05_pregnant` (103-104), `sketch_06_sizing` (133-134), `logo_C`, `og_card`.

### clinicians, guarantee, expecting/redeem
`logo_C` + `og_card` only.

### test/index.html, 404.html
`logo_C` only (no og:image).

### price/49, price/69, price/89
No image references at all (text-only WTP variants).

## 2. Geometrically-wrong images flagged (per WO T1)

| File | Where used | Verdict |
|---|---|---|
| `public/assets/plumb_render_system_sage_blue_front.png` + `.webp` | homepage hero + 2 gallery slots | **WRONG** — visually confirmed: sleeve depicted as wide free-standing cylinder with pillow attached to its face |
| `public/assets/investors/plumb_render_system_sage_blue_front.png` + `.webp` | investors product figure | **WRONG** — same render, duplicate copy |

No other `plumb_render_system_*` variants (`_angled`, `_threequarter`, `_midnight_side`, `_assembled`)
are referenced anywhere in `public/`.

## 3. Legacy site assets ↔ OneDrive curated source mapping (visually verified)

| Site asset | OneDrive curated source | Status in Mike's 2026-06-12 curation |
|---|---|---|
| `hero_image.jpg` | `plumb_illustration_sleeve_cover_pillow_study.png` | KEPT → site asset stays |
| `hero_dune.jpg` | `plumb_lifestyle_dune_pillow.png` | KEPT → stays |
| `cushion_family.jpg` | `plumb_illustration_foam_thickness.png` | KEPT → stays (but see T5 dimension-claim flag) |
| `pairing.jpg` | `plumb_illustration_sizing_pairing.png` | KEPT → stays (same T5 flag) |
| `color_palette.jpg` | `plumb_palette_color_system.png` | KEPT → stays |
| `logos/logo_C.jpg` | (no logo files in Renderings folder) | not governed by Renderings curation; stays |
| `sketches/sketch_01..06` | earlier exports; exact OneDrive source mapping uncertain (e.g. `sketch_02_exploded` resembles deleted `plumb_sketch_concept_exploded_kit`) | flagged for architect — see results `next_actions_for_architect` |
| `investors/fig1/fig2/fig3 SVGs` | (SVGs removed from Renderings in curation) | WO explicitly says keep — keep |

## 4. OneDrive Renderings ground truth at execution time (31 PNGs)

`1. plumb_render_system_sage_blue_front.png` (NOTE: Mike kept this with a "1. " prefix —
tension with WO wrong-geometry directive; flagged for architect),
plumb_diagram_attachment_family, plumb_diagram_loading_geometry, plumb_diagram_thigh_distribution,
plumb_illustration_foam_thickness, plumb_illustration_sizing_pairing,
plumb_illustration_sleeve_cover_pillow_study, plumb_illustration_system_study_man,
plumb_lifestyle_dune_pillow, plumb_lifestyle_inuse_sidesleeper, plumb_palette_color_system,
plumb_render_cover_sage, plumb_render_foam_bare, plumb_render_kit_sage_bedding,
plumb_render_kit_sage_flatlay, plumb_render_system_midnight_side, plumb_render_system_sage_assembled,
plumb_render_system_sage_blue_angled, plumb_sketch_concept_fit_guide, plumb_sketch_concept_three_views,
plumb_sketch_detail_sleeve_rim_01, plumb_sketch_detail_sleeve_rim_02, plumb_sketch_inuse_man_01,
plumb_sketch_inuse_man_03, plumb_sketch_inuse_man_xl_01, plumb_sketch_inuse_pregnant_01,
plumb_sketch_inuse_pregnant_02, plumb_sketch_inuse_woman_01, plumb_sketch_inuse_woman_02,
plumb_sketch_inuse_woman_xl_01, plumb_spec_foam_orthographic_03_softer.

Deleted by Mike since the 2026-06-12 afternoon state (must NOT be reintroduced):
posters (sidesleeper/technical schematic, sleep_kit_annotated), `plumb_render_kit_sage_three_components`
(WO's first-choice components image — using `plumb_render_kit_sage_flatlay` per WO alternative),
`plumb_render_swatch_midnight_dune`, `plumb_render_system_sage_blue_front` (un-prefixed),
`plumb_render_system_sage_blue_threequarter`, `plumb_render_kit_sage_components_grid`,
`plumb_sketch_concept_exploded_kit`, `plumb_sketch_inuse_man_02/_04/_05`,
`plumb_spec_foam_orthographic_01/_02_clean`, all SVGs, all " - Copy" duplicates.

## 5. Other observations

- `og_card.png` (18 KB) — current card; T4 regenerates from `plumb_render_kit_sage_bedding`.
- `assets/investors/fig2_attachment_family.svg` on disk but unreferenced (orphan, harmless).
- investors, test, 404, price/* pages have no og:image meta tags (pre-existing gap, noted only).
- `hero_image.jpg` annotated study correctly presents attachment as "TBD — magnetic, snap, or pouch"
  (compliant with locked-decision rules).
