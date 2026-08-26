# Classis Travel and Tours

A Mumbai travel management company's site, led by **MICE** — conferences, seminars, exhibitions and
incentive programmes for corporate and hospital clients — with corporate travel and private journeys
alongside it. Picture-first, enquiry-led: nothing on the site carries a price.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui (Radix).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Screens

| Route | What it does |
| --- | --- |
| `/` | Picture-led home: hero, a 12-tile conference-destination mosaic, event formats, client types, incentive journeys, reviews, and a "quoted against your brief" close |
| `/mice` | MICE & events desk — services ledger and a qualified-brief form |
| `/corporate` | Corporate & business travel desk — same shell, different config |
| `/packages` | Incentive journeys: filter by region, trip type, duration, departure month, sort |
| `/packages/[slug]` | Day-by-day itinerary, route map, inclusions/exclusions, gallery, reviews, and an enquiry panel |
| `/book/[slug]` | Three-step proposal request: dates & travellers → rooms & additions → contact → reference |
| `/compare` | Up to three journeys side by side, all set to the same party and month |
| `/saved` | Wishlist, persisted per-device |
| `/reviews` | Reviews filterable by region, trip type, journey, rating, photos-only |
| `/about` | The company, the four pillars, and leadership |

## One layout system

Every band is a `<Section>` + `<SectionHeader>` from `src/components/site/section.tsx`: one 1400px
container, one vertical rhythm, one `eyebrow → title → "View all →"` header. Lists use the same card
shell (`PackageCard`, `DestinationCard`, `ReviewCard`). Variation comes from the content, not from
re-inventing the layout per section — an earlier version varied the layout system each band and read
as scattered.

The conference mosaic is the exception that carries the photography: twelve tiles, four of them
double-width, which fills exactly four rows of four with no ragged tail. Text on a tile is a city, a
country, and one line that appears on hover.

Editorial display face is Fraunces; every functional control uses Inter with tabular figures.

## No pricing, anywhere

Pricing is quoted against a brief, so no figure appears on the site — not on cards, not on the
package detail page, not in the comparison table, not in the request flow. `src/lib/pricing.ts` is
still the source of truth for **seasonality**, which drives real behaviour:

- Twelve monthly multipliers per journey, blended when a trip straddles a month boundary.
- **Closed seasons** — Ladakh and the Amalfi coast don't operate in some months; those dates are
  disabled in the picker, excluded from filters, and surfaced with the next date we can run.

Currency display is locked to INR in `src/lib/store.tsx`. The `format`/`convert` context API is
intact, so restoring prices (and the USD toggle) is a small, contained change.

## Data & state

- `src/lib/mice.ts` — conference destinations, client types, event formats.
- `src/lib/enquiry.ts` — the two B2B desks (services, brief types, party sizes, reference prefixes).
- `src/lib/company.ts` — the real company profile and leadership; the only sanctioned source for
  About-page copy. Nothing there is invented.
- `src/lib/packages.ts` — nine fully written journeys (itineraries, routes, rooms, add-ons, seasonality).
- `src/lib/store.tsx` — wishlist and comparison tray, persisted to `localStorage` through
  `useSyncExternalStore` so the server snapshot and first client paint always agree.
- `src/lib/filters.ts` / `src/lib/booking.ts` — URL-serialisable filter and request state, so a search
  or a part-filled request is a shareable link.

## Notes

- The route map is a hand-drawn SVG schematic rather than a tiled basemap: no key, no third-party
  tracker, works offline, and it answers the question a client actually has (order and overnights).
- Photography is loaded from Unsplash's CDN with a seeded fallback per frame, so no image slot can
  render broken. `src/components/site/photo.tsx` handles both SSR hydration races that otherwise
  leave a fade-in stuck at `opacity-0`.
- Both enquiry flows validate and issue a reference but transmit nothing — no mail service is wired up.
- Footer contact details are placeholders pending the real published line and inbox.
