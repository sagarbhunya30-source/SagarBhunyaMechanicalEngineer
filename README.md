# Sagar Bhunya — Mechanical Workshop Portfolio

React + Vite + Tailwind CSS portfolio. Mechanical illustrations are inline SVG; transitions use Framer Motion.

## Commands

```bash
npm install
npm run dev       # local development
npm run build     # production build to dist/
npm run preview   # serve the production build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Updating content

All text, links, skills, projects, and education live in **`src/data/profile.js`**.

- CV: replace `public/Sagar_Bhunya_CV.pdf`.
- Photo: `public/sagar-bhunya-{480,800}.{webp,jpg}` (3:4 portrait); `public/og-image.jpg` is the 1200×630 social preview.
- After deploying, set absolute URLs for `og:image` / `twitter:image` in `index.html` (some social platforms require them).

## Themes

Dark, Light and AutoCAD themes are selectable in the navigation bar; the choice is saved in the browser.
Palettes are CSS variables in `src/index.css` (`[data-theme='…']`). The AutoCAD theme adds a short drafting intro
(`src/components/cad/CadIntro.jsx`), a command line, a crosshair cursor and wireframe parts. Reduced-motion users skip the intro.

## Structure

- `src/components/Hero.jsx` — workstation, gear train, “Start Exploring” switch
- `src/components/workshop/` — interactive bench (tools → readout), lazy-loaded, with a plain-link fallback
- `src/components/projects/` — conceptual project demos and details
- `src/components/PrintResume.jsx` — resume layout used when printing
