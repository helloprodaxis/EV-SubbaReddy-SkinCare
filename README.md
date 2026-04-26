# Dr. E V Subba Reddy — Advanced Skin and Laser Center

Official website for **Dr. E V Subba Reddy Advanced Skin and Laser Center**, Kadapa.

> **Live (preview):** [dr-ev-subba-reddy-skin-care.vercel.app](https://dr-ev-subba-reddy-skin-care.vercel.app)

## Stack

| Layer            | Choice                                    | Why this, not the routine pick |
| ---------------- | ----------------------------------------- | ------------------------------ |
| Framework        | **Astro 5**                               | Static-first. Ships HTML, not a JS bundle. Lighthouse 100s out of the box. View Transitions for SPA-style page morphs without a heavyweight framework. |
| Interactive UI   | **Svelte 5** (runes)                      | The booking form is a single `client:load` island — every other page stays zero-JS. |
| Styling          | **Tailwind CSS v4**                       | CSS-first config (`@theme` in `global.css`), no `tailwind.config.js`. |
| Hosting          | **Vercel** (`@astrojs/vercel` adapter)    | One-click deploy, automatic preview URLs per PR, edge analytics. |
| Booking email    | **Resend** via Astro API route            | One env var. Same code runs locally and on Vercel serverless. |
| Type safety      | **TypeScript (strict)**                   | Astro `strict` preset, no escape hatches. |
| Sitemap & SEO    | `@astrojs/sitemap` + JSON-LD MedicalClinic | Schema.org structured data baked in. |

Site is a hybrid by route: every page is prerendered to static HTML, only `/api/book` runs as a Vercel serverless function (it has `export const prerender = false`).

## Design

- **Palette** — white + blush pink (`#fde7e8`, `#eba6a9`, `#a04a5a`) + powder blue (`#dce7ee`, `#b8ccd9`, `#5c7a8a`) + deep navy (`#1a2530`) + a deep mauve (`#4a2532`). All tokens in `src/styles/global.css` — change one, the whole site re-skins.
- **Typography** — **Poppins** ExtraLight → Black for display, **Lato** for body. Loaded from Google Fonts.
- **Format** — editorial chapter spine ("Chapter 02 — Approach" marks at every section), single cinematic hero on a pink/blue mesh, scroll-snap treatment rail, dark cinematic testimonial section, closing-credits "A Project by Prodaxis" footer with full nav.
- **Custom assets** — every illustration is hand-drawn SVG (`Bouquet.astro`, `SwirlBackdrop.astro`, `Leaf.astro`, `Ornament.astro`). Zero stock photography, zero copyright risk.

## Getting started

```bash
npm install
cp .env.example .env       # then fill in RESEND_API_KEY (optional in dev)
npm run dev                # http://localhost:4321
```

The booking form posts to `/api/book`. With no `RESEND_API_KEY` set, the route logs the payload to the dev console and returns success — so the UX still works during local development. Set the key to actually send email.

## Deploying to Vercel

1. Push to GitHub. Repo lives at [helloprodaxis/EV-SubbaReddy-SkinCare](https://github.com/helloprodaxis/EV-SubbaReddy-SkinCare).
2. In Vercel → **Add New** → **Project** → import that GitHub repo.
3. Framework preset auto-detected as **Astro**. Build command `npm run build`, output `dist`. No changes needed.
4. **Project name**: `dr-ev-subba-reddy-skin-care` → Vercel will deploy to [dr-ev-subba-reddy-skin-care.vercel.app](https://dr-ev-subba-reddy-skin-care.vercel.app).
5. **Environment variables** (Settings → Environment Variables → Production):
   - `RESEND_API_KEY` — from [resend.com/api-keys](https://resend.com/api-keys)
   - `BOOKING_TO_EMAIL` — the clinic inbox
   - `BOOKING_FROM_EMAIL` — a verified Resend sender on a domain you've added in Resend
6. (Optional) Add a custom domain — e.g. `drsubbareddyskin.in`.

Every push to `main` auto-deploys. Every PR gets a preview URL.

## Project structure

```
.
├── astro.config.mjs       # Astro + Svelte + Tailwind + sitemap + Vercel adapter
├── src/
│   ├── data/              # site.ts, doctors.ts, treatments.ts, testimonials.ts
│   ├── styles/global.css  # Design tokens (Tailwind v4 @theme) + components layer
│   ├── layouts/           # BaseLayout with ClientRouter + reveal-on-scroll
│   ├── components/        # Nav, Hero, SwirlBackdrop, Bouquet, Approach, Doctors, Footer, etc.
│   └── pages/
│       ├── index.astro / about / treatments / doctors / contact / book / 404
│       └── api/book.ts    # Astro API route (SSR via Vercel serverless) → Resend
├── public/                # favicon.svg, og-default.svg, robots.txt
└── .env.example           # template for local secrets
```

## Editing clinic content

All copy and data lives in `src/data/`:

| File              | What to edit                                         |
| ----------------- | ---------------------------------------------------- |
| `site.ts`         | Clinic name, phones, address, email, hours, URL      |
| `doctors.ts`      | Doctor profiles, qualifications, bios, highlights    |
| `treatments.ts`   | Treatment list, blurbs, durations, conditions        |
| `testimonials.ts` | Patient quotes                                       |

> ⚠️ **The new building address is a placeholder.** Open `src/data/site.ts` and replace `address.line2` and `address.mapsQuery` once the new clinic's exact pin is confirmed.

## What still needs the client

- New building's exact street address (placeholder in `site.ts`)
- A Google Maps pin URL for the new location (`mapsQuery`)
- Real patient testimonials with consent
- A Resend-verified sending domain
