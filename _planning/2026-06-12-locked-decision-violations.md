# Locked-decision violations audit — 2026-06-12

WO: WO-2026-06-12-plumbweb-image-audit-and-update, task T5.
Scope: visible text + imagery on public pages asserting TBD design decisions
(attachment mechanism, cover closure, exact contour), per d12/d15.
Canonical reference per WO: plumb-coordination `package/130_canonical_final_design_spec.md`.

## Finding 1 — ARCHITECTURE NARRATIVE CONFLICT (headline, substantive, architect decision required)

The site carries TWO contradictory product architectures simultaneously:

**Single-piece sleeve-and-case** ("case sewn permanently to the sleeve", citing
package/154 ratification):
- `index.html` — meta description (L7), og:description (L12), body copy (L129, 143, 233, 491, 501),
  gallery figcaption (L226), Product JSON-LD description (L654), FAQ JSON-LD (L702, 712)
- `expecting/index.html` — meta description (L7), body copy (L88, 96, 99, 179), JSON-LD (L247)
- `investors/index.html` — §3.5 component table (L237-238), §3.5.4 entire section (L387-431:
  architecture "held constant (single-piece sleeve-and-case, ratified at package/154)";
  Stage 1 variable = case-flap closure variants a/b/c/d: tuck-only / low-strength magnetic
  flap / hook-and-loop / case-tension-only), BOM table (L722, 730), patent question (L217, 919),
  manufacturing complexity claim (L1076)

**Three-piece modular kit** (sleeve + removable washable cover + foam pillow —
matches canonical spec 130, d14/d22 sizing nomenclature, and the WO-directed imagery):
- `clinicians/index.html` L91-96 ("contoured hourglass cushion held in a removable washable cover")
- `press/index.html` L236, 248, 461, 475 ("three-piece sleep-alignment kit … removable washable cover")
- `price/49|69|89/index.html` L33 (same three-piece description)
- All T3 replacement imagery (bedding hero shows separate covered pillow + folded spare
  covers; flatlay shows three separate components; fig2 SVG shows 3-arm attachment family)

**Sharpest collision:** investors §3.5.4 (L421-425) states the 3-arm modular topology
(magnetic / kam-snap / pouch) "is excluded by first-principles force math" — citing
`research/synthesis/arch_synthesis_single_piece_vs_three_arm_20260611.md` — and L427
references "Figure 2 — Closure-variant family tree". But the WO directs fig2_attachment_family.svg
("keep the SVG diagrams (fig1, fig2, fig3) — those are correct"), which depicts exactly that
3-arm family (magnetic snap / kam-snap tab / exterior pouch). After the WO-mandated swap,
Figure 2 and its surrounding section text contradict each other. Caption was written
neutrally (describes what the figure shows, no Stage-1-selection claim) to minimize, not
resolve, the contradiction.

**Timeline tension for architect:** package/154 (single-piece ratification, synthesis dated
2026-06-11) post-dates package/86 (modular ratification) numerically and chronologically; yet
spec 130 (frontmatter dated 2026-06-12, "LIVING — supersedes"), today's d14/d22 nomenclature
rules, Mike's curated imagery, and this WO all use modular-kit framing. Either the single-piece
pivot was reversed (→ site needs a copy-migration WO across index/expecting/investors incl.
JSON-LD and FAQ structured data) or spec 130 is stale (→ spec needs correction and Figure 2
needs a closure-variant SVG instead). NOT editable under this WO's T5 trivial-edit authority.

## Finding 2 — Attachment mechanism (TBD per spec 130)

- COMPLIANT: investors §3.5.4 presents closure variants explicitly as TBD/Stage-1.
- VIOLATION (substantive, tied to Finding 1): "sewn permanently" assertions on index/expecting
  lock the sleeve↔pillow attachment as sewn — contradicts spec 130's three TBD variants
  (A magnetic snap / B kam-snap / C exterior pouch). Not editable as trivial copy: the claim
  is load-bearing across meta tags, FAQ schema, and body narrative.
- No "magnetic attachment"-style decided-mechanism marketing copy found on any public page
  (magnets appear only inside clearly-labeled TBD variant discussion).

## Finding 3 — Sizing / dimension claims

- "5-inch baseline / 6-inch" pillow-thickness claims appear on clinicians (L95-96),
  expecting (L125), investors (L243, 355, 377-379), press (L248, 387, 404), index (L237,
  454-455, 511). Spec 130 says: Pillow Regular = 5" foam + 1" plush (6" total), Pillow XL =
  5" foam + 1.5" plush (6.5" total), nomenclature locked per d22 as Pillow Regular/XL —
  not "5-inch/6-inch". Substantive (woven through tables, FAQ, JSON-LD on six pages) — flagged,
  not edited.
- Same "5 inch / 6 inch" labels are baked into the pixel content of the curated illustrations
  (`plumb_illustration_foam_thickness`, `plumb_illustration_sizing_pairing` — kept by Mike in
  the curated folder, so approved visuals as-is). Image-vs-spec mismatch noted for architect.
- Exact plan dims "12 × 7 × 5 inches" (investors L243) fall within spec 130's own safe-spec
  text; homepage copy hedges ("About twelve inches", L511). No contour-curvature or
  waist-ratio disclosures found anywhere. COMPLIANT with the FTO note.

## Finding 4 — Cover closure imagery

- No zipper or envelope-closure copy or imagery on any public page.
- The new bedding hero shows a small snap-like tab on the covered pillow's front seam
  (present in Mike's curated source render — approved by curation; noted only).

## Trivial edits applied under T5 authority

None — every candidate edit traced back to the Finding 1 architecture conflict or the
Finding 3 nomenclature conflict, both substantive. (Alt-text/caption updates accompanying
the T3 image swaps were made under T3's authority and kept decision-neutral.)

## Mitigating context

`investors/index.html` is `noindex, nofollow` and labeled confidential — its
locked-decision exposure is to invited readers, not the indexed public web.
