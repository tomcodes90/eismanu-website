@AGENTS.md


# CLAUDE.md

This file is the single source of truth for Claude Code when working on this project.
Read it fully before starting any task.

---

## Project Overview

**EisManuFaktur Geratal** — website for an ice café in Gräfenroda, Thuringia (Germany).

**Two goals:**
1. Replace an existing WordPress site that has no CMS — staff currently contact an agency
   for every content change. The new site uses Sanity.io so staff can update everything themselves.
2. Provide an online reservation system connected to a custom Spring Boot microservice backend.

**Reference site (design & content inspiration):** https://eismanufaktur-geratal.de

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Framework      | Next.js 16.2.3 (App Router, TypeScript)         |
| Styling        | Tailwind CSS v4                                 |
| Fonts          | Kaushan Script (headings/nav) + Nunito (body)   |
| CMS            | Sanity.io v3 — staff edits content here         |
| Forms          | react-hook-form + zod validation                |
| API client     | Native fetch — talks to Spring Boot backend     |
| Hosting        | Vercel                                          |

---

## Commands

```bash
npm run dev          # Next.js dev server → http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx sanity dev       # Sanity Studio → http://localhost:3333
npx tsc --noEmit     # TypeScript check without emit (no type-check script exists)
```

---

## Project Structure

No `src/` directory — the project was created without `--src-dir`. All app code lives at
the root level (Next.js default).

```
app/
├── globals.css                             # Tailwind v4 imports + @theme + utility classes
├── layout.tsx                              # Root layout — loads fonts, metadata
├── page.tsx                                # Home page — assembles all sections
├── studio/[[...tool]]/page.tsx             # Sanity Studio (embedded)
├── eis/page.tsx                            # Ice cream detail page
├── speisen-getraenke/page.tsx              # Menu page
├── ueber-uns/page.tsx                      # About page
├── news/
│   ├── page.tsx                            # News listing
│   └── [slug]/page.tsx                     # News detail (Portable Text)
├── kontakt/page.tsx                        # Contact + embedded map
└── reservierung/
    └── stornieren/[token]/page.tsx         # Cancellation landing page
components/
├── layout/
│   ├── Navbar.tsx                          # Sticky nav, mobile hamburger
│   └── Footer.tsx                          # Dark footer, 4 columns
├── sections/                               # One file per homepage section
│   ├── HeroSection.tsx
│   ├── IceCreamSection.tsx
│   ├── ReservationSection.tsx
│   ├── MenuSection.tsx
│   ├── AboutSection.tsx
│   └── NewsSection.tsx
├── reservation/
│   └── ReservationForm.tsx                 # 'use client' — calls Spring Boot API
└── ui/                                     # Reusable atoms: Button, Badge, Card...
lib/
└── reservation.ts                          # All Spring Boot API calls live here
sanity/
├── lib/
│   ├── client.ts                           # sanityClient + urlFor()
│   └── queries.ts                          # All GROQ fetch functions
└── schemas/                                # One file per content type
    ├── index.ts                            # Exports schemaTypes array
    ├── hero.ts
    ├── iceFlavor.ts
    ├── menuItem.ts
    ├── newsPost.ts
    └── siteSettings.ts
types/
└── index.ts                                # All shared TypeScript types
```

---

## Design System

### Fonts
- **Kaushan Script** (`font-kaushan`) — nav links, all headings, buttons, badges, labels
- **Nunito** (`font-nunito`) — body text, form inputs, descriptions, paragraphs
- Load both via `next/font/google` in `app/layout.tsx` as CSS variables, then register
  them in `globals.css` via `@theme`:

```ts
// app/layout.tsx
const kaushan = Kaushan_Script({ weight: '400', subsets: ['latin'], variable: '--font-kaushan' })
const nunito  = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
```

```css
/* app/globals.css — register with Tailwind v4 */
@theme {
  --font-kaushan: var(--font-kaushan);
  --font-nunito: var(--font-nunito);
}
```

### Brand Colors
**Tailwind v4 has no `tailwind.config.ts`** — all theme customisation lives in `globals.css`
inside an `@theme` block. Tailwind auto-generates `bg-*`, `text-*`, `border-*` etc. utility
classes from these variables.

```css
/* app/globals.css */
@theme {
  --color-brand-red:          #E8352A;
  --color-brand-teal:         #1A9BAF;
  --color-brand-yellow:       #F9C500;
  --color-brand-pink:         #F25C8A;
  --color-brand-green:        #3BAA6E;
  --color-brand-dark:         #1C1C2E;
  --color-brand-teal-light:   #E3F6F9;
  --color-brand-yellow-light: #FEF7D0;
  --color-brand-pink-light:   #FDE8EF;
  --color-brand-red-light:    #FDECEA;
  --color-brand-green-light:  #E5F7EE;
}
```

| Token                | Hex       | Usage                              |
|----------------------|-----------|------------------------------------|
| `brand-red`          | `#E8352A` | Primary CTAs, active nav, logo     |
| `brand-teal`         | `#1A9BAF` | Hero bg, nav link color, headers   |
| `brand-yellow`       | `#F9C500` | Accents, highlights, footer labels |
| `brand-pink`         | `#F25C8A` | News section, dessert cards        |
| `brand-green`        | `#3BAA6E` | Vegan badges, success states       |
| `brand-dark`         | `#1C1C2E` | Reservation section bg, footer     |
| `brand-teal-light`   | `#E3F6F9` | Section backgrounds                |
| `brand-yellow-light` | `#FEF7D0` | Ice cream section background       |
| `brand-pink-light`   | `#FDE8EF` | News section background            |
| `brand-red-light`    | `#FDECEA` | Flavor tag background              |
| `brand-green-light`  | `#E5F7EE` | Vegan tag background               |

**Never use raw hex values in components — always use `brand-*` Tailwind classes.**

### Utility Classes (define in `globals.css`)
In Tailwind v4, custom component classes use `@layer` just like v3:

```css
@layer components {
  .btn-primary   { /* bg-brand-red, white, font-kaushan, rounded-full */ }
  .btn-outline   { /* transparent, white border, font-kaushan */ }
  .btn-teal      { /* bg-brand-teal, white, font-kaushan */ }
  .section-label { /* font-kaushan text-xl — colored eyebrow above headings */ }
  .section-title { /* font-kaushan text-4xl text-brand-dark */ }
  .section-sub   { /* font-nunito text-base text-brand-mid max-w-xl */ }
  .card-brand    { /* bg-white rounded-2xl border-2 */ }
  .flavor-tag    { /* small rounded pill for ice cream flavor chips */ }
}
```

### Section Layout Pattern
```tsx
<section className="bg-{color} py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <p className="section-label text-{accent}">Eyebrow</p>
    <h2 className="section-title">Heading</h2>
    <p className="section-sub mb-10">Description</p>
    {/* content */}
  </div>
</section>
```

### Section Color Map
| Section      | Background           | Label color        |
|--------------|----------------------|--------------------|
| Hero         | `brand-teal`         | `brand-yellow`     |
| Ice Cream    | `brand-yellow-light` | `brand-teal`       |
| Reservation  | `brand-dark`         | `brand-yellow`     |
| Menu         | `white`              | `brand-red`        |
| About        | `brand-teal-light`   | `brand-teal-dark`  |
| News         | `brand-pink-light`   | `brand-pink`       |

### Hero Images
Splash art style: food photography on a solid colored background with white paint/milk
splashes around the subject. Images are uploaded by staff via Sanity CMS.
Always use `next/image` + `urlFor()` for Sanity images.

---

## Server vs Client Components

| Component                  | Directive       |
|----------------------------|-----------------|
| Page sections (Sanity data)| Server (none)   |
| Navbar (mobile menu state) | `'use client'`  |
| ReservationForm            | `'use client'`  |
| Cancellation page          | `'use client'`  |
| Everything else            | Server (none)   |

Only add `'use client'` when the component uses `useState`, `useEffect`, or browser events.

---

## Reservation System

### Flow
1. Guest fills the form on the website (`ReservationForm.tsx`)
2. Form calls `createReservation()` from `src/lib/reservation.ts`
3. `reservation.ts` POSTs to the Spring Boot microservice
4. Spring Boot saves it and sends a confirmation email with a cancel link
5. Cancel link points to `/reservierung/stornieren/[cancelToken]`
6. That page calls `cancelReservation(token)` → DELETE on the API

### API Client (`src/lib/reservation.ts`)
```ts
const API_BASE  = process.env.NEXT_PUBLIC_API_URL   // e.g. http://localhost:8080/api/v1
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID // e.g. eismanufaktur-geratal

// Every request must include:
headers: { 'Content-Type': 'application/json', 'X-Tenant-Id': TENANT_ID }

// Endpoints:
POST   /reservations                     → ReservationResponse
GET    /availability?date=&guests=       → AvailabilityResponse
DELETE /reservations/{token}/cancel      → void
```

### Form Validation (Zod)
```ts
firstName  : string, min 2
lastName   : string, min 2
email      : valid email
phone      : string, min 6
date       : yyyy-MM-dd, min today, max today+30 days
timeSlot   : HH:mm, one of the predefined slots
guests     : number 1–6 (7+ → instruct user to call)
notes      : string, optional
```

### Time Slots
`13:00 13:30 14:00 14:30 15:00 15:30 16:00 16:30 17:00 17:30 18:00 18:30`
Open Wednesday–Sunday only. Monday–Tuesday = Ruhetage (closed).

### Form States
- `idle` → show form
- `loading` → disable submit, show "Wird gesendet..."
- `success` → replace form with green confirmation card
- `error` → red error message above submit, form stays editable

---

## Sanity CMS

### Content Types
| Schema         | Title                  | Editable by staff                       |
|----------------|------------------------|-----------------------------------------|
| `hero`         | Hero Bereich           | Headline, subheadline, background image |
| `siteSettings` | Website Einstellungen  | Phone, email, address, opening hours    |
| `iceFlavor`    | Eissorten              | Name, category, availability, tags      |
| `menuItem`     | Speisekarte            | Name, description, category, tags       |
| `newsPost`     | News & Events          | Title, image, excerpt, rich text body   |

### Categories
- Ice flavor: `milk` | `sorbet` | `special`
- Menu item: `flammkuchen` | `dessert` | `drinks` | `cocktails` | `beer` | `coffee`

### Image Handling
```ts
import { urlFor } from '@/sanity/lib/client'
<Image src={urlFor(image).width(800).url()} alt={image.alt ?? ''} fill />
```

### Revalidation
```ts
{ next: { revalidate: 3600 } }   // hero, siteSettings, flavors, menu
{ next: { revalidate: 300 } }    // news list
{ next: { revalidate: 60 } }     // news post detail
```

---

## TypeScript Rules

- Strict mode — no `any`, no `@ts-ignore`
- All props typed (inline or interface)
- Shared types in `src/types/index.ts`
- Use `interface` for object shapes, `type` for unions

---

## Coding Conventions

- No inline styles — Tailwind only
- No raw hex values — always `brand-*` tokens
- Icons: use **lucide-react** — no emojis, no other icon libraries
- No axios — native `fetch`
- All user-facing text is **German (de-DE)**
- Dates formatted with `date-fns` + `de` locale
- Named exports everywhere except Next.js page files (which use default export)
- One component per file

---

## Pages to Build

| Route                              | Description                                              |
|------------------------------------|----------------------------------------------------------|
| `/`                                | Home: Hero → IceCream → Reservation → Menu → About → News |
| `/eis`                             | Full flavor catalog, filterable by category              |
| `/speisen-getraenke`               | Full menu grouped by category                            |
| `/ueber-uns`                       | Team story, history, photo                               |
| `/news`                            | News post list, newest first                             |
| `/news/[slug]`                     | Full post with Portable Text (`@portabletext/react`)     |
| `/kontakt`                         | Address, hours from siteSettings + Google Maps iframe    |
| `/reservierung/stornieren/[token]` | Cancellation page — calls DELETE on mount                |

---

## Dependencies

### Already installed
```
next@16.2.3  react@19  react-dom@19
next-sanity  @sanity/image-url  @sanity/vision  sanity
styled-components  (installed via template — not used in this project, can be removed)
tailwindcss@4  @tailwindcss/postcss  typescript
```

### Still to install
```bash
npm install react-hook-form @hookform/resolvers zod
npm install @portabletext/react
npm install date-fns
npm install clsx tailwind-merge
```

---

## Backend (Spring Boot — separate repo, do not modify)

- Local URL: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- All communication goes through `src/lib/reservation.ts` only
- Never call the API directly from a component

---

## Environment Variables

```bash
# Reservation backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_TENANT_ID=eismanufaktur-geratal

# Sanity — generated automatically by: npm create sanity@latest
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Initialize Sanity (generates .env.local automatically)
npm create sanity@latest

# 3. Add remaining env vars to .env.local

# 4. Start dev servers
npm run dev        # → http://localhost:3000
npx sanity dev     # → http://localhost:3333

# 5. Start Spring Boot API separately on :8080
```

## Build Order (recommended)

1. `app/globals.css` — `@theme` block with brand colors + fonts + `@layer components` utilities
2. `app/layout.tsx` — fonts, metadata
3. `components/layout/Navbar.tsx` + `Footer.tsx`
4. `types/index.ts` — all types upfront
5. `lib/reservation.ts` — API client
6. `sanity/` — client, queries, schemas
7. Home sections one by one (Hero → IceCream → Reservation → Menu → About → News)
8. Individual pages (`/eis`, `/speisen-getraenke`, etc.)
9. Cancellation page
