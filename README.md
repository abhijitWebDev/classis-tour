# Classis Tour

A luxury travel site built as a **tool**, not a brochure: browse → filter → compare → price → book.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui (Radix).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Screens

| Route | What it does |
| --- | --- |
| `/` | Editorial home in five visually distinct chapters (see below) |
| `/packages` | Search + filter: region, trip type, duration, departure month, budget, sort |
| `/packages/[slug]` | Day-by-day itinerary, route map, inclusions/exclusions, gallery, reviews, **live price calculator** |
| `/book/[slug]` | Four-step booking: dates & travellers → rooms & add-ons → lead traveller → deposit → confirmation |
| `/compare` | Up to three journeys side by side, all quoted for the *same* party and month |
| `/saved` | Wishlist, persisted per-device |
| `/reviews` | Reviews filterable by region, trip type, journey, rating, photos-only |

## The three deliberate design registers

The brief's main failure mode was "the same card grid three times". Each homepage chapter uses a
genuinely different layout:

1. **Destinations** — an editorial *index*: a large sticky plate on the left that swaps as you move
   down a numbered list on the right. No cards.
2. **How we travel** — a dark, text-forward horizontal reading rail with small circular thumbnails.
3. **Signature journeys** — full-bleed alternating spec rows: photo one third, data-dense panel two
   thirds, with season multipliers, rating, price and compare/save controls.
4. **Reviews** — an editorial spread: one long pull-quote against three short ones.
5. **The numbers** — a three-up explainer of how pricing works.

Editorial sections use the serif display face (Fraunces); every functional control — filters, steppers,
price breakdowns, forms — uses Inter with tabular figures, so the tool never fights the storytelling.

## Pricing is real

There is no flat "starting from" anywhere. `src/lib/pricing.ts` computes:

- **Twelve monthly multipliers per journey**, blended across months when a trip straddles a boundary
  (28 Nov → 5 Dec is priced across both, weighted by nights).
- **Closed seasons** — Ladakh and the Amalfi coast simply don't operate in some months; those dates are
  disabled in the picker, excluded from filters, and surfaced with the next bookable departure.
- Child rate (65%), room/villa multipliers, single-traveller supplement, tiered group savings
  (4/6/8+ travellers), per-traveller vs per-booking add-ons, a non-discountable flights & permits
  component, and GST.
- A line-by-line breakdown, and "₹X below the same trip in peak season".

Currency is INR-based with a USD toggle; every figure, including the prose inside breakdown lines,
formats through the active currency.

## Data & state

- `src/lib/packages.ts` — nine fully written journeys (itineraries, routes, rooms, add-ons, seasonality).
- `src/lib/data.ts` — regions, trip types, destination index, experiences, reviews.
- `src/lib/store.tsx` — currency, wishlist and comparison tray, persisted to `localStorage` through
  `useSyncExternalStore` so the server snapshot and first client paint always agree.
- `src/lib/filters.ts` / `src/lib/booking.ts` — URL-serialisable filter and booking state, so a search
  or a priced booking is a shareable link.

## Notes

- The route map is a hand-drawn SVG schematic rather than a tiled basemap: no key, no third-party
  tracker, works offline, and it answers the question a traveller actually has (order and overnights).
- Photography is loaded from Unsplash's CDN with a seeded fallback per frame, so no image slot can
  render broken.
- The checkout is a working flow with validation and a real confirmation, but takes no payment — the
  deposit step says so on screen.
