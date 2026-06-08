# plumbsleep.com

Public landing site for **Plumb** — a wearable thigh band for adult side sleepers.
Tagline: *Sleep, aligned.*

This repo is a pure static site. No build step. Netlify serves `public/`.

## Structure

```
public/
  index.html       — single-page landing
  styles.css       — site styles
  robots.txt
  sitemap.xml
  assets/          — hero images, cushion family render, color study
    logos/         — five logo-vote candidates (A–E)
netlify.toml       — publish config + security headers
```

## Local preview

```bash
cd public && python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Pushes to `main` auto-deploy on Netlify.

## Forms

Two Netlify Forms collect responses (private — no public tally):

- `plumb-feedback` — one-sentence reaction + optional prototype signup
- `plumb-logo-vote` — A/B/C/D/E selection + optional comment

## Domains

- **Primary**: plumbsleep.com
- **Aliases (301 → primary)**: plumbsleep.net, plumbsleep.store, plumbsleep.info, plumbsleep.shop

## Status

Concept stage. Not a medical device. Sharing for feedback.
