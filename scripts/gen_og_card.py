"""
Generate Plumb OG card — 1200x630 type-led social preview.
Run from repo root: python scripts/gen_og_card.py

Outputs:
  public/assets/og_card.png   (1200x630, ~100KB target)
  public/assets/og_card.webp  (fallback)
"""

from PIL import Image, ImageDraw, ImageFont
import os, sys

OUT_PNG  = "public/assets/og_card.png"
OUT_WEBP = "public/assets/og_card.webp"

W, H = 1200, 630

# Brand palette (matches styles.css)
BG       = "#fafaf7"   # warm cream
ACCENT   = "#2d4a3e"   # institutional green  — wordmark
MUTED    = "#6a6a65"   # secondary text        — descriptor
RULE_COL = "#cfcfca"   # hairline dividers
URL_COL  = "#b8b8b0"   # very quiet url

# Font paths
FONT_ROOT = "C:/Windows/Fonts"
F_BOLD    = os.path.join(FONT_ROOT, "arialbd.ttf")   # Arial Bold  — wordmark
F_REG     = os.path.join(FONT_ROOT, "segoeui.ttf")   # Segoe UI    — descriptor + url


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def draw_tracked_text(d, x, y, text, font, tracking_px, fill):
    """Draw text with manual letter-spacing (tracking_px added between each char)."""
    cx = x
    for ch in text:
        d.text((cx, y), ch, font=font, fill=fill)
        bbox = d.textbbox((0, 0), ch, font=font)
        cx += (bbox[2] - bbox[0]) + tracking_px
    return cx  # returns end x


def measure_tracked_text(d, text, font, tracking_px):
    total = 0
    for i, ch in enumerate(text):
        bbox = d.textbbox((0, 0), ch, font=font)
        total += (bbox[2] - bbox[0])
        if i < len(text) - 1:
            total += tracking_px
    return total


def main():
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img)

    try:
        font_wm   = ImageFont.truetype(F_BOLD, 130)
        font_desc = ImageFont.truetype(F_REG,  36)
        font_url  = ImageFont.truetype(F_REG,  22)
    except OSError as e:
        sys.exit(f"Font load error: {e}")

    # ── PLUMB wordmark ──────────────────────────────────────────────────────────
    # Wide tracking: 0.18em ≈ 0.18 × 130 ≈ 23px between chars
    TRACKING = 23
    wm_text  = "PLUMB"
    wm_w     = measure_tracked_text(d, wm_text, font_wm, TRACKING)

    # Measure height from a sample char
    bbox_h = d.textbbox((0, 0), "P", font=font_wm)
    wm_h   = bbox_h[3] - bbox_h[1]

    # Vertical centre point: slightly above centre (golden-ish)
    centre_y = H * 0.44
    wm_x     = (W - wm_w) / 2
    wm_y     = centre_y - wm_h / 2

    draw_tracked_text(d, wm_x, wm_y, wm_text, font_wm, TRACKING, fill=ACCENT)

    # ── Hairline rule ────────────────────────────────────────────────────────────
    rule_y = wm_y + wm_h + 26
    rule_half = 100
    d.line(
        [(W // 2 - rule_half, rule_y), (W // 2 + rule_half, rule_y)],
        fill=RULE_COL,
        width=1,
    )

    # ── Descriptor line ──────────────────────────────────────────────────────────
    desc      = "A wearable thigh sleeve for side sleepers."
    bbox_desc = d.textbbox((0, 0), desc, font=font_desc)
    desc_w    = bbox_desc[2] - bbox_desc[0]
    desc_h    = bbox_desc[3] - bbox_desc[1]
    desc_x    = (W - desc_w) / 2
    desc_y    = rule_y + 22

    d.text((desc_x, desc_y), desc, font=font_desc, fill=MUTED)

    # ── URL — very quiet, bottom centre ─────────────────────────────────────────
    url       = "plumbsleep.com"
    bbox_url  = d.textbbox((0, 0), url, font=font_url)
    url_w     = bbox_url[2] - bbox_url[0]
    url_x     = (W - url_w) / 2
    url_y     = H - 52

    d.text((url_x, url_y), url, font=font_url, fill=URL_COL)

    # ── Save ─────────────────────────────────────────────────────────────────────
    img.save(OUT_PNG,  "PNG",  optimize=True)
    img.save(OUT_WEBP, "WEBP", quality=88)

    size_kb = os.path.getsize(OUT_PNG) // 1024
    print(f"Saved {OUT_PNG}  ({size_kb} KB)")
    print(f"Saved {OUT_WEBP}")


if __name__ == "__main__":
    main()
