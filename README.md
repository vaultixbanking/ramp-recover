# Ramp Recover

Website and case-intake backend for Ramp Recover, a scam recovery support service.

- **Website:** Next.js 16 (App Router), React 19 and Tailwind CSS v4, in this folder.
- **Backend:** a Node.js + TypeScript API in [`backend/`](backend/README.md). It saves intake form cases to Supabase and emails them through Resend.

The work list and the details still needed from the client are in [`TODO.md`](TODO.md).

## Project layout

| Path | What it is |
|---|---|
| `src/app/page.tsx` | Home page |
| `src/app/components/` | Shared pieces: header (`Navigation`), footer (`SiteFooter`), intake form, floating contact buttons (`ContactDock`), logo (`BrandMark`), legal page layout |
| `src/app/config/contact.ts` | Contact details: email, phone, WhatsApp, Smartsupp live chat key |
| `src/app/config/legal.ts` | Company details used in the legal pages, and the list of legal pages |
| `src/app/config/site.ts` | The site's main address, home page title and description, and the link-preview (SEO) helper |
| `src/app/robots.ts`, `sitemap.ts`, `not-found.tsx` | `/robots.txt`, `/sitemap.xml` and the 404 page |
| `src/app/privacy-policy/`, `terms-of-service/`, `disclaimer/`, `risk-notice/` | Legal pages |
| `src/app/globals.css` | Global styles and the colour palette (`@theme`) |
| `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` | Browser and home-screen icons |
| `public/brand/` | Logo files (SVG and PNG) and the social share image |
| `backend/` | Intake form API: see [`backend/README.md`](backend/README.md) |

## Running locally

Requires Node.js 22 or newer.

**1. Website**

```bash
npm install
cp .env.example .env.local   # then add the Smartsupp key (see below)
npm run dev                  # http://localhost:3000
```

**2. Backend** (needed for the intake form), in a second terminal:

```bash
cd backend
npm install
cp .env.example .env         # fill in the Supabase and Resend details
npm run db:migrate           # first time only: creates the database tables
npm run setup:storage        # first time only: creates the private evidence bucket
npm run dev                  # http://localhost:4000
```

## Website environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL the intake form posts to. Defaults to `http://localhost:4000`. In production, set it to the backend's public URL. |
| `NEXT_PUBLIC_SMARTSUPP_KEY` | Smartsupp live chat key (Smartsupp → Settings → Chat box, the `_smartsupp.key` value). If it's empty, there's no live chat and the "live chat" buttons are hidden. |

`NEXT_PUBLIC_` values are baked in when the site is built, so rebuild after changing one. The backend's variables are listed in [`backend/README.md`](backend/README.md).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Common changes

| To change | Edit |
|---|---|
| Email, phone or WhatsApp number | `src/app/config/contact.ts` |
| Smartsupp live chat key | `NEXT_PUBLIC_SMARTSUPP_KEY` in `.env.local`, and in the hosting provider's settings |
| Company name, address, country, record-keeping period | `src/app/config/legal.ts` |
| Colours | The `@theme` block in `src/app/globals.css`. Tailwind v4 has no `tailwind.config` file. |
| Logo | `src/app/components/BrandMark.tsx` on the site; the files are in `public/brand/` and the icons in `src/app/` |
| Intake form options (scam types, payment methods…) | Both `src/app/components/ContactIntakeForm.tsx` and `backend/src/validation/intake.ts`, kept in sync |
| Emails sent after a submission | `backend/src/email/templates.ts` |

## Deploying

- **Backend:** Render or Railway. Steps are in [`backend/README.md`](backend/README.md#deploying-render-or-railway).
- **Website:** Vercel, served at **https://ramp-recover.getfinora.org**.
  1. Deploy from this folder (the repository root).
  2. In the Vercel project's environment variables, set `NEXT_PUBLIC_API_URL` to the backend's public URL and `NEXT_PUBLIC_SMARTSUPP_KEY` to the Smartsupp key. Without the key, the live site has no chat.
  3. In the backend's environment, set:
     - `CORS_ORIGINS=https://ramp-recover.getfinora.org`
     - `SITE_URL=https://ramp-recover.getfinora.org`

### Search engines and link previews

- The site's address is `SITE_URL` in `src/app/config/site.ts`. Every page's canonical link, link-preview tags (Open Graph and Twitter/X, using `public/brand/ramp-recover-social.png`) and the sitemap point to it.
- `/robots.txt` lets search engines index the site and points them to `/sitemap.xml`. Both are generated from `src/app/robots.ts` and `src/app/sitemap.ts`.
- To add a page to the sitemap, add it in `src/app/sitemap.ts`, or in `LEGAL_PAGES` in `src/app/config/legal.ts` for legal pages. Give it its own metadata with `pageMetadata()` from `src/app/config/site.ts`.

Before launch, work through the open items in [`TODO.md`](TODO.md): the client's contact and company details, the lawyer review, and the testimonials and stats.
