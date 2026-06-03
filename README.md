# Brixel — Website + Admin Panel

> **Your business online — built simply.**
> A marketing + lead-capture website and admin dashboard for **Brixel**, a UAE web-design agency. Built with **Next.js 14 (App Router) + TypeScript**, themed in the Brixel palette and fonts, with an **AI concierge** that recommends a package and captures leads.

---

## ✨ What's inside

**Public site** (plain-English, ELI5 copy, no jargon)
- Home — hero, 5 package cards, "How it works", trust strip, testimonials, closing CTA
- Packages + per-package detail pages (`/packages/[key]`)
- How it works · Our work · About · FAQ · Contact / Get a quote
- Sticky header with the single amber CTA, footer, **floating WhatsApp + click-to-call on every page**, cookie consent
- SEO metadata + `sitemap.xml` + `robots.txt`
- EN / **Arabic (RTL)** toggle (English first; Tajawal for Arabic)

**Lead capture** (all three, they serve different buyers)
- Enquiry form → saves a `Lead`, emails the owner, shows a warm confirmation
- Floating WhatsApp (`wa.me`) + click-to-call (`tel:`)
- "Request a callback" → lands in the admin as a callback task

**AI concierge — "Bricky"** (`POST /api/chat`)
- Claude (Sonnet) with **prompt caching** on the system prompt (package data + brand rules repeat every turn)
- `capture_lead` **tool** → writes a `Lead` + `Conversation`, classifies **Hot / Warm / Cold**, notifies the owner
- All calls **server-side**; the API key is never exposed to the browser

**Admin panel** (`/admin`, auth-protected)
- Overview KPIs · Leads table (filter + status pipeline New→Won/Lost, one-click WhatsApp/call/email)
- Callback queue (done/pending) · Concierge transcripts · Analytics funnel · **Package manager** (edit names/prices/copy — writes to the DB, no code changes)

---

## 🧱 Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript (strict) |
| Styling | Tailwind CSS, themed with the Brixel palette |
| Icons | `lucide-react` (open-source) |
| Database | PostgreSQL via Prisma |
| AI | Anthropic Claude (`@anthropic-ai/sdk`), server-side only |
| Email | Resend (transactional) |
| Validation | Zod on every API input |
| Rate limiting | In-memory sliding window (swap for Upstash/Redis at scale) |

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
#    → fill in DATABASE_URL, ANTHROPIC_API_KEY, RESEND_API_KEY,
#      ADMIN_PASSWORD, and the NEXT_PUBLIC_PHONE / WHATSAPP / EMAIL values

# 3. Create the schema + seed sample data
npm run db:push
npm run db:seed

# 4. Run
npm run dev      # http://localhost:3000
```

> The public site renders even **before** the DB is set up (packages fall back to `lib/packages.ts`). The admin panel and lead saving need the database.

### Required env vars
See **`.env.example`** — every key is listed and commented (DB, Anthropic, Resend, contact numbers, admin password, cron secret).

---

## 🗂️ Project structure

```
app/
  (site)/                 # public site (shares header/footer/concierge layout)
    page.tsx              #   Home
    packages/             #   list + [key] detail
    how-it-works/ work/ about/ faq/ contact/
    layout.tsx            #   marketing chrome
  admin/                  # auth-protected dashboard (no public chrome)
  api/
    chat/                 # concierge turn (Claude + tools + prompt caching)
    enquiries/ callbacks/ events/
    admin/                # login/logout, leads, callbacks, packages (PUT)
    cron/insights/        # Phase 3 batch-insights stub (CRON_SECRET protected)
  layout.tsx  globals.css  sitemap.ts  robots.ts
components/                # Header, Footer, Concierge, forms, PackageCard, admin/*
lib/                       # prisma, anthropic, packages (config), validation,
                           # rateLimit, conciergePrompt, email, data, contact
prisma/                    # schema.prisma + seed.ts
```

---

## 💬 How the concierge works (`/api/chat`)

1. Client (`components/Concierge.tsx`) posts the running transcript + a `sessionId`.
2. The route builds Bricky's system prompt from **live package data** (`lib/conciergePrompt.ts`) and sends it as a **cacheable** system block.
3. The `capture_lead` tool fires when Bricky has a name + number → we persist `Lead` + `Conversation`, create a `Notification`, log an `enquiry` event, email the owner, then feed a `tool_result` back so Bricky writes its closing reply.
4. Brand-voice + price rules + "no dark patterns" live entirely in the system prompt.

**Model:** `ANTHROPIC_MODEL` (default `claude-sonnet-4-5`). *Model names/prices shift — confirm the current Sonnet tier on Anthropic's pricing page before launch.*

---

## ✏️ Editing packages & prices

Customer-facing prices come from **one place** so they're always accurate:
- `lib/packages.ts` is the source of truth (also seeds the DB).
- The admin **Package manager** edits the DB copy (`PUT /api/admin/packages/:key`).
- The public site reads the DB and falls back to the config (`lib/data.ts → getPackages`).

---

## 🔒 Guardrails & notes

- **API key is server-side only** — all AI calls go through `/api/chat`.
- Every public endpoint is **Zod-validated and rate-limited**.
- Cookie consent banner + privacy/terms links included.
- The concierge persuades only by being helpful — **no fake urgency or invented prices** (enforced in the system prompt).
- Phase 3 AI insights are **proposals for the owner to approve**, never auto-applied (`/api/cron/insights` is a documented stub).

### ⚠️ Admin auth is a DEMO gate
`/admin` is protected by a single `ADMIN_PASSWORD` cookie (`lib/admin-auth.ts` + `/api/admin/login`). **Replace it with Clerk or NextAuth for production** — swap the `isAdminAuthed()` check and the login route, and add `middleware.ts` to protect `/admin` + `/api/admin/*`.

---

## ☁️ Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add all env vars from `.env.example` in the Vercel project settings.
3. Use a managed Postgres (Vercel Postgres / Supabase / Neon) for `DATABASE_URL`.
4. `prisma generate` runs on `postinstall`; run `prisma db push` + the seed once against your production DB.
5. (Phase 3) Add a Vercel Cron hitting `POST /api/cron/insights` with the `Authorization: Bearer $CRON_SECRET` header.

---

## 🛣️ Build phases (per the spec)

- **Phase 1 (done):** public pages + ELI5 copy + branding, package cards, enquiry/WhatsApp/call/callback, admin Leads + Callbacks.
- **Phase 2 (done):** AI concierge with package matching + lead capture, transcripts in admin, analytics funnel, notifications, package manager.
- **Phase 3 (stub):** batch AI insights engine + optional A/B testing of hero copy/CTAs.
