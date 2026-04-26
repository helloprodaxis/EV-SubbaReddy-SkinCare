# Subba Reddy Skin — Clinic Site

A premium, content-first website for **Dr. E.V. Subba Reddy — Advanced Skin & Laser Centre**, Kadapa.

> Built deliberately on a different stack from the Sudha Hospitals project — Astro + Svelte + Tailwind v4 instead of Next.js / Prisma / Supabase. Static-first, edge-deployed, no DB required for the v1 booking flow (form → email).

## Stack

| Layer            | Choice                                    | Why this, not the routine pick |
| ---------------- | ----------------------------------------- | ------------------------------ |
| Framework        | **Astro 5**                               | Ships HTML, not a JS bundle. Lighthouse 100s out of the box. View Transitions API for SPA-style page morphs without React/Next overhead. |
| Interactive UI   | **Svelte 5** (runes)                      | Booking form is a single `client:load` island — the rest of the site stays zero-JS. |
| Styling          | **Tailwind CSS v4**                       | CSS-first config (`@theme` in `global.css`), no `tailwind.config.js`. Matches Astro's "everything-is-a-file" philosophy. |
| Hosting          | **Cloudflare Pages**                      | Free tier, edge-cached worldwide. Pages Functions = serverless API with no cold start. |
| Booking email    | **Resend** (via Pages Function)           | One env var. Works on the edge. No SMTP plumbing. |
| Type safety      | **TypeScript (strict)**                   | Astro `strict` preset, no escape hatches. |
| Sitemap & SEO    | `@astrojs/sitemap` + JSON-LD MedicalClinic | Schema.org structured data baked in. |

## Design language

- **Editorial, magazine-style layout** — asymmetric grids, generous whitespace, abstract gradient compositions instead of stock photography.
- **Palette**: warm cream paper (`#f7f1e8`), clay/terracotta (`#c97b5c`), sage (`#7b8a6f`), gold (`#b8956a`).
- **Typography**: variable **Fraunces** (display), **Inter** (body), **Instrument Serif** italic (accent moments).
- **Tactile details**: SVG paper-grain noise overlay, soft shadow elevation system, magnetic hover transforms, IntersectionObserver fade-up.

All design tokens live in `src/styles/global.css` under `@theme { ... }` — change one variable, the whole site re-skins.

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
```

For local Pages Function dev (so the booking form actually posts):

```bash
cp .dev.vars.example .dev.vars   # then fill in RESEND_API_KEY
npm run build
npx wrangler pages dev dist      # serves site + functions/ together
```

## Project structure

```
skin-clinic-demo/
├── astro.config.mjs       # Astro + Svelte + Tailwind + sitemap, prefetch on viewport
├── src/
│   ├── data/              # site.ts, doctors.ts, treatments.ts, testimonials.ts ← edit clinic info here
│   ├── styles/global.css  # Design tokens (Tailwind v4 @theme) + components layer
│   ├── layouts/           # BaseLayout with ClientRouter view transitions + reveal-on-scroll
│   ├── components/        # Hero, Approach, Testimonials, BookingForm.svelte, etc.
│   └── pages/             # index, about, treatments, doctors, book, contact, 404
├── functions/api/book.ts  # Cloudflare Pages Function — POST /api/book → Resend email
├── public/                # favicon.svg, og-default.svg, robots.txt
└── .dev.vars.example      # template for local secrets
```

## Editing clinic content

All copy and data lives in `src/data/`:

| File             | What to edit                                         |
| ---------------- | ---------------------------------------------------- |
| `site.ts`        | Clinic name, phones, address, email, hours, social   |
| `doctors.ts`     | Doctor profiles, qualifications, bios, highlights    |
| `treatments.ts`  | Treatment list, blurbs, durations, conditions        |
| `testimonials.ts`| Patient quotes                                       |

> ⚠️ **The new building address is a placeholder.** Open `src/data/site.ts` and replace `address.line2` and `address.mapsQuery` once the new clinic's exact pin is confirmed.

## Deploying to Cloudflare Pages

1. Push this folder to a GitHub repo.
2. In Cloudflare → Pages → Create a project → connect repo.
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output**: `dist`
4. Environment variables (Settings → Environment variables → Production):
   - `RESEND_API_KEY` — from [resend.com/api-keys](https://resend.com/api-keys)
   - `BOOKING_TO_EMAIL` — clinic inbox
   - `BOOKING_FROM_EMAIL` — verified Resend sender (must be on a domain you've verified in Resend)
5. Add custom domain → `drsubbareddyskin.in` (or whatever the final domain is).

That's it. No build server to manage, no Vercel lock-in, no database.

## What's intentionally left for the client to provide

- The new building's exact street address (placeholder in `site.ts`)
- A Google Maps pin URL for the new location (`mapsQuery`)
- Real patient testimonials with consent (currently illustrative)
- Photography (hero uses an abstract gradient composition by design)
- A Resend-verified sending domain for the booking email
