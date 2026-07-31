# DUNEX SPA Frontend

DUNEX is a mobile-first single-page website for a fashion modelling agency brand experience.

## Stack

- React 18 + Vite
- CSS Custom Properties + Grid/Flexbox
- Native IntersectionObserver animations
- Data-driven content from local JSON files

## Run Locally

```bash
npm install
npm run dev
```

App runs on http://localhost:3000.

## Build

```bash
npm run build
npm run preview
```

## Key Sections Implemented

- Fixed transparent nav (solid on scroll) with mobile slide menu
- Full-height hero with cinematic video backdrop and CTA
- About cards with 3D hover tilt and animated counters
- Masterclasses city cards with registration modal
- Model gallery with category filtering and profile modal
- Video showcase with controls, progress bar, and thumbnail navigation
- Testimonial carousel with autoplay and hover pause
- News grid with load-more pagination
- Contact form with inquiry type, map embed, and social links
- Footer with newsletter signup

## Content Files

- src/data/masterclasses.json
- src/data/models.json
- src/data/videos.json
- src/data/testimonials.json
- src/data/news.json

All external media URLs are placeholders and should be replaced with licensed brand assets before production launch.

## Local Fallback Placeholders

If external CDN media fails, the app falls back to local placeholders in:

- public/placeholders/model-fallback.svg
- public/placeholders/editorial-fallback.svg
- public/placeholders/video-fallback.svg

Replace these placeholder files with your own branded fallback media for final production quality.

## SEO Files

- public/robots.txt
- public/sitemap.xml

Update domain values (`dunex.example.com`) before deployment.
