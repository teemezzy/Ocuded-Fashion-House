# O_Cubed Fashion House — Web

Next.js 14 (App Router) + TypeScript + Tailwind CSS implementation of the O_Cubed
bridal landing page, ported from the approved design.

## Getting started

```bash
cd Web
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Structure

```
Web/
├─ app/
│  ├─ layout.tsx        # fonts (EB Garamond, Jost, Sacramento), metadata, <body>
│  ├─ globals.css       # Tailwind directives + base styles + reduced-motion
│  └─ page.tsx          # composes all sections
├─ components/          # one component per section (+ Nav, Reveal, Logo)
├─ lib/
│  └─ data.ts           # marquee, pillars, gallery, journey, testimonials, shop
├─ tailwind.config.ts   # brand palette + kenburns / marquee animations
└─ ...config files
```

## Notes

- **Brand palette** lives in `tailwind.config.ts` under `theme.extend.colors`
  (`rust`, `clay`, `cream2`, etc.). Change colors there once and they update
  everywhere.
- **Fonts** are loaded with `next/font/google` and exposed as CSS variables
  consumed by Tailwind's `font-serif` / `font-sans` / `font-script`.
- **Interactivity** (scroll-aware nav, mobile menu, rotating testimonials,
  scroll-reveal) is isolated in client components (`Nav`, `Testimonials`,
  `Reveal`); everything else is a server component.
- The colored gradient blocks are **placeholders for photography** — swap them
  for real images (e.g. `next/image`) when assets are ready.

## Backend (Supabase)

The app works with **zero backend** out of the box — every data function falls
back to in-memory mock data, and the `/admin` auth gate is skipped. Once you add
Supabase, it switches to real data automatically.

### 1. Environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # optional, server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Database

Run the SQL in `supabase/migrations/` (in order) via the Supabase SQL editor:

1. `0001_init.sql` — tables, enums, indexes, and RLS policies
2. `0002_seed.sql` — default settings, weekly hours, and the admin whitelist
   (edit the email in this file to your own before running)
3. `0003_products_orders.sql` — shop products, orders, and the public
   `product-images` storage bucket (with admin-only upload policies)
4. `0004_gallery.sql` — lookbook gallery table and the public
   `gallery-images` storage bucket (admin-only upload)

### 3. Google sign-in

In Supabase → Authentication → Providers, enable **Google** and add your OAuth
credentials. Add `${SITE_URL}/auth/callback` to the allowed redirect URLs.
Only emails present in the `allowed_admins` table can reach `/admin`.

### How it fits together

- **Auth** — `middleware.ts` protects `/admin/*`; `app/admin/layout.tsx` also
  checks the email against `allowed_admins`. Login at `/login`, callback at
  `/auth/callback`, rejection at `/not-authorized`.
- **Data access** — `lib/queries.ts` (server-side, RLS-aware, mock fallback).
- **API routes** — `app/api/{availability,appointments,schedule,overrides,settings,admins}`.
  `availability` + `appointments` (POST) are public; the rest require an admin.
- **Booking** — the customer flow reads `/api/availability` and POSTs a *pending*
  appointment on the (mock) payment step.

## Payments (Paystack)

Like Supabase, this degrades gracefully: with no `PAYSTACK_SECRET_KEY` the
payment step runs in **demo mode** (creates a pending booking, shows the
confirmation, no real charge). Add keys to go live.

### Setup

1. Create a [Paystack](https://paystack.com) account. Dashboard → **Settings →
   API Keys & Webhooks**. Use the **Test** keys while developing.
2. Add to `.env.local`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
   ```
3. Set the **Webhook URL** on that same Paystack page to:
   ```
   https://YOUR-DEPLOYED-URL/api/paystack/webhook
   ```
   (For local testing, expose your dev server with a tunnel like `ngrok` and
   use that URL — Paystack can't reach `localhost`.)

### Flow

- Customer clicks Pay → `POST /api/paystack/init` creates a **pending**
  appointment (with a unique `paystack_ref`) and initializes a transaction →
  browser redirects to Paystack.
- After paying, Paystack redirects to `/consultation/confirmed?ref=…`, which
  verifies the transaction and confirms the booking.
- `POST /api/paystack/webhook` is the **source of truth**: it validates the
  signature and, on `charge.success`, flips the appointment to `confirmed` +
  `paid` and upserts a `payments` row (idempotent). The confirmed booking then
  appears automatically in the admin calendar/appointments.

### Still stubbed (later phases)

- **Resend** email confirmations/reminders, **Google Calendar** Meet links, and
  **Vercel Cron** reminder/briefing jobs.
# Ocuded-Fashion-House
