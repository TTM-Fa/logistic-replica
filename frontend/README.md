# Shenatech — Next.js

Port of the original single-file `output/index.html` to a Next.js 15 (App Router, TypeScript) project.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm run start
```

## Project structure

```
shenatech-next/
├─ app/
│  ├─ layout.tsx       # Root: fonts, metadata (incl. favicon), LanguageProvider
│  ├─ page.tsx         # Composes Nav + Hero + … + Footer
│  ├─ effects.tsx      # Client-side GSAP/ScrollTrigger, scroll progress, mouse parallax
│  └─ globals.css      # All styles (ported verbatim from the single-file site)
├─ components/
│  ├─ Nav.tsx          # Top bar with EN/AR switch + Request Demo (→ Calendly)
│  ├─ Hero.tsx         # Dark hero + wordmark + CTA + pillars
│  ├─ HeroGlobe.tsx    # D3-orthographic canvas (d3-geo + topojson-client)
│  ├─ Problem.tsx
│  ├─ Platform.tsx
│  ├─ Segments.tsx
│  ├─ Partners.tsx     # Infinite-scroll marquee
│  ├─ CTA.tsx
│  └─ Footer.tsx
└─ lib/
   ├─ translations.ts   # Full EN/AR dictionary
   ├─ LanguageContext.tsx # React context, localStorage persistence, sets <html lang|dir>
   └─ T.tsx             # Render-translation helper (supports inline <em>/<strong>/<br>)
```

## Notes

- **Fonts** load via `next/font/google` (Inter, IBM Plex Mono, Tajawal) and expose CSS vars `--font-inter`, `--font-plex-mono`, `--font-tajawal`. The CSS tokens `--ff-body` and `--ff-mono` map onto those.
- **Favicon** is declared inline in `metadata.icons` as a base64 SVG — no physical asset needed.
- **Rowwad partner logo** is base64-embedded in `globals.css` as a CSS variable (`--rowwad-logo`) and rendered via the `.rowwad-logo` utility class. No files under `public/logos/`.
- **External partner logos** (Syndicate) load directly from their website; `next.config.mjs` lists it as an allowed image host (needed if you later switch to `next/image`).
- **"Request Demo"** buttons all open https://calendly.com/shenatech/30min in a new tab.
- **Arabic mode** swaps:
  - `<html dir="rtl">` auto-flips flex layouts.
  - Font family → `Tajawal`.
  - `data-*`-based innerHTML swap via the `T` component.
  - LocalStorage remembers the choice between sessions.

## Dependencies

| Package            | Why                                 |
| ------------------ | ----------------------------------- |
| `next`, `react`    | Framework                           |
| `gsap`             | ScrollTrigger-based reveal staggers |
| `d3-geo`, `d3-array` | Hero globe projection + math       |
| `topojson-client`  | Decode world-atlas land polygons    |
