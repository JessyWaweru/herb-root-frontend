# GO herbal — Frontend

React + Vite + TypeScript storefront for the GO herbal herbal remedies shop.

> **Published with the client's permission.** This is client work for GO herbal, shared with their agreement. No credentials, customer data or production configuration are included: all secrets are loaded from environment variables, and the full repository history has been checked for leaked keys.

## Stack

- React 19, React Router 7, TypeScript
- Tailwind CSS v4 (CSS-based theme, no config file — see `src/index.css`)
- TanStack Query for server state, Zustand (persisted) for auth state
- react-hook-form + zod for forms
- Framer Motion for animation
- Axios client with automatic JWT refresh (`src/lib/api.ts`)

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

Requires the backend running (default `http://127.0.0.1:8000/api`) for data — see its
README for setup, including `python manage.py seed_products`.

## Structure

- `src/lib/` — API clients per domain (`products.ts`, `auth.ts`, `orders.ts`, `payments.ts`, `core.ts`) + axios instance with refresh-token interceptor
- `src/hooks/` — TanStack Query hooks wrapping the API clients
- `src/stores/authStore.ts` — persisted auth state (user, JWT pair)
- `src/components/` — `ui/` (buttons, inputs, spinners…), `layout/` (navbar, footer, auth shell), `product/`, `home/`
- `src/pages/` — route-level pages, including `account/` (nested account section) and `auth/`
- `src/routes/router.tsx` — route tree; `/checkout`, `/orders/:id`, and `/account/*` are behind `ProtectedRoute`

## Key flows

- **Symptom-first search**: the hero search bar and the home page's "Shop by concern" grid both route to `/shop?search=` or `/shop?symptom=<slug>`, which the backend matches against product name, description, ingredients, and symptoms.
- **Product detail**: ingredient list, a small "from the garden" plant photo album, and a plain-language "what it helps with" section — all driven by the backend's placeholder-safe image fields.
- **Cart & checkout**: cart requires sign-in (matches the backend design); checkout collects/reuses a shipping address, creates an `Order`, then redirects to Paystack's hosted checkout. `/orders/:orderNumber` handles the Paystack redirect back (`?reference=`) and verifies payment.
- **Auth**: JWT access/refresh stored via a persisted Zustand store; `src/lib/api.ts` transparently refreshes on a 401 and retries the original request once.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Django API, e.g. `https://herb-root-api.onrender.com/api` in production |
| `VITE_PAYSTACK_PUBLIC_KEY` | Not currently used directly (checkout redirects to Paystack's hosted page using the backend-issued link), kept for a future inline Paystack Popup integration |

## Deploying on Render

This is a static site: `npm run build` outputs `dist/`. On Render, create a **Static Site**
pointing at this repo, build command `npm run build`, publish directory `dist`, and set
`VITE_API_BASE_URL` to the deployed backend's URL. Remember to add this site's URL to the
backend's `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` / `FRONTEND_URL`.

Add a rewrite rule `/*` → `/index.html` so app routes like `/orders/123` load the app. Static
hosts serve real files before rewrites, so the per-page HTML files described below still win.

## SEO

- **Titles, descriptions, canonical links, link-preview tags and breadcrumbs** for fixed pages live
  in `src/seo/site.ts`. `src/components/seo/Seo.tsx` updates the `<head>` as visitors move around;
  product and expert pages build theirs from API data. Wording there should say what herbs are
  *traditionally used for*, never that they treat or cure anything.
- **At build time** `build/seo.ts` writes a separate HTML file for every public page, product and
  expert (`dist/about/index.html` and `dist/about.html`, and so on), each with its own head tags,
  JSON-LD (Organization, WebSite, Store, Product, BreadcrumbList) and a `<noscript>` summary, plus
  `sitemap.xml`, `robots.txt`, `llms.txt` and `404.html`. Products and experts come from
  `VITE_API_BASE_URL`; if the API can't be reached the build still succeeds with only the fixed
  pages, so **redeploy after adding or renaming products** to refresh the sitemap.
- **Concern pages** (`/concerns/insomnia`, …) are each concern's own landing page, built from
  the concern's *Intro* in the Django admin (Products → Symptoms) and the remedies tagged with
  it. A concern without an intro still gets a page; writing one gives it something to rank with.
- The site's address (`https://goherbal.health`) is set in `src/seo/site.ts`.
- Icons are in `public/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icons/`), and the
  default link-preview image is `public/og/goherbal-share.png` (1200×630).
