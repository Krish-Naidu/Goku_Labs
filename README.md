# GokuLabs

Marketing site for GokuLabs — a TanStack Start + React 19 + Tailwind CSS 4 app.

## Structure

```text
Goku_Labs/
├── public/                # Served verbatim: favicon, robots.txt, CNAME (gokulabs.com), .nojekyll
├── src/
│   ├── routes/
│   │   ├── __root.tsx    # App shell: <head> meta, fonts, QueryClientProvider
│   │   └── index.tsx     # The landing page
│   ├── components/
│   │   ├── site-bits.tsx # Shared micro-interactions (Magnetic, Scramble, LondonClock, useReveal)
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # error capture / reporting helpers
│   ├── router.tsx         # Router + per-request QueryClient
│   ├── server.ts          # Edge SSR error wrapper (unused by the static build)
│   └── start.ts           # Server middleware (unused by the static build)
├── .github/workflows/
│   └── deploy-pages.yml   # Builds and publishes dist/client/ to GitHub Pages
├── vite.config.ts         # Static prerender build config
└── package.json
```

## Run

```bash
npm install
npm run dev        # http://localhost:8080
```

## Test

```bash
npm test           # vitest
npm run lint       # eslint
```

## Build

```bash
npm run build
```

The build prerenders `/` to plain HTML (`dist/client/index.html`) plus hashed asset bundles, ready for GitHub Pages. `npm run preview` serves the built app locally through the SSR server.

## Deploying to GitHub Pages

The workflow in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) runs `npm ci && npm run build` on every push to `main` and publishes `dist/client/` to Pages. The custom domain `gokulabs.com` is served from the published artifact via [public/CNAME](public/CNAME).

> **Site not updating after a push?** Pages serves the artifact produced by the workflow. Check the **Actions** tab for a failed run, and that **Settings → Pages → Source** is set to **GitHub Actions**. GitHub also caches aggressively — hard-refresh (`Ctrl+F5`) or check <https://gokulabs.com> in a private window.

## Features

- Bricolage Grotesque display type, Hanken Grotesk body, JetBrains Mono accents via Google Fonts.
- Micro-interactions: magnetic buttons, text-scramble nav links, live London clock, scroll reveals, neon neo-brutalist palette with `bg-ink` / `bg-primary` / `bg-accent` tokens.
- Fully static deploy: no backend required, contact form degrades to a `mailto:` link.
- Accessible: semantic landmarks, `aria-expanded` mobile nav, visible focus states, `prefers-reduced-motion` honored via Tailwind.

## Project history

The site was previously deployed as a Flask app (`app.py` + `templates/`) exported to static HTML by `build_static.py`. The repository has since been replaced with this Lovable Studio project (`lovable-project-studio-51.zip`); see `AGENTS.md` for Lovable-sync rules that still apply if the repo is reconnected.