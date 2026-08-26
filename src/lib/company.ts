/**
 * The real company profile. Every fact here comes from Classis Travel and Tours
 * directly — nothing on the About page is invented, so this file is the single
 * source of truth for it. Add to it only from material the client has supplied.
 */

export const COMPANY = {
  legalName: "Classis Travel and Tours",
  shortName: "Classis",
  headquarters: "Mumbai, India",
  /** The one-line positioning, used in the footer and as page metadata. */
  positioning:
    "A Mumbai-headquartered travel management company delivering corporate travel, MICE, events and bespoke leisure itineraries.",
  lede: "A premier Indian travel management company, dedicated to delivering exceptional, client-centric travel experiences.",
  paragraphs: [
    "Guided by a team of seasoned tourism professionals, Classis combines deep industry expertise, an extensive global network, and an unwavering commitment to operational excellence.",
    "Our client-first approach means highly responsive communication, personalised hospitality, and seamless execution across every service — corporate delegations, MICE, high-profile events, and bespoke individual itineraries alike.",
    "As a leading Mumbai-based travel management company, we deliver world-class travel and event solutions tailored to each client's exact standards: proactive communication, custom itinerary management, and end-to-end service from a team that stays with the file until everyone is home.",
  ],
} as const;

export type Pillar = {
  index: string;
  title: string;
  body: string;
  /** Where this pillar can already be acted on, if anywhere on the site. */
  href?: string;
  cta?: string;
};

/** The four stated areas of core expertise, in the order the company lists them. */
export const EXPERTISE: Pillar[] = [
  {
    index: "01",
    title: "Corporate & business travel",
    body: "Seamless handling of business delegations and corporate itineraries — routing, accommodation, ground movement and the schedule discipline a working trip needs.",
    href: "/corporate",
    cta: "Corporate travel",
  },
  {
    index: "02",
    title: "MICE & events",
    body: "Meetings, incentive travel, conferences and exhibitions, executed end to end. Venue, delegate logistics, production and the hundred small things that decide whether an event runs.",
    href: "/mice",
    cta: "MICE & events",
  },
  {
    index: "03",
    title: "Customised leisure",
    body: "Tailor-made itineraries for discerning travellers — the journeys on this site, and anything else built to order around them.",
    href: "/packages",
    cta: "Browse the journeys",
  },
  {
    index: "04",
    title: "Sustainable tourism",
    body: "Eco-tourism initiatives integrated into day-to-day operations rather than bolted on, as part of a commitment to responsible travel and sustainable growth.",
    href: "/about#sustainability",
    cta: "How we approach it",
  },
];

export type Leader = {
  name: string;
  role: string;
  initials: string;
};

export const LEADERSHIP: Leader[] = [
  { name: "Dr. Rajendra Dhumma", role: "Founder", initials: "RD" },
  { name: "Ajinkya Dhumma", role: "Director", initials: "AD" },
];

/**
 * The strip under the hero. Deliberately capability claims, not achievement
 * numbers — a stat bar ("450 events delivered") converts better for B2B, but
 * every figure would be invented, and this is a real company. Swap this for
 * `{ figure, label }` pairs the moment the client supplies real numbers.
 */
export const CAPABILITY_STRIP: { label: string; detail: string }[] = [
  { label: "Headquartered in Mumbai", detail: "Operating worldwide" },
  { label: "Corporate, hospital & association clients", detail: "Delegations of 10 to 500+" },
  { label: "Conferences, seminars, exhibitions, incentives", detail: "Four formats, one team" },
  { label: "Venue, logistics, production, on-site", detail: "End to end, no handoffs" },
];
