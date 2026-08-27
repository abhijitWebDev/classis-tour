/**
 * The real company profile. Every fact here comes from Classis Travel and Tours
 * directly — nothing on the About page is invented, so this file is the single
 * source of truth for it. Add to it only from material the client has supplied.
 */

export const COMPANY = {
  legalName: "Classis Travel and Tours",
  shortName: "Classis",
  headquarters: "Mumbai, India",
  /**
   * Digits only, with country code, for wa.me links. PLACEHOLDER — replace with
   * the business line before launch; it is live on every page via the floating
   * button, so a wrong number here is a wrong number everywhere.
   */
  whatsapp: "919820000000",
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
 * The thin line under the measures band. Capability claims, not achievement
 * numbers — "450 events delivered" converts better for B2B and every figure
 * would be invented, and this is a real company. The counted figures above it
 * are all derived from the catalogue for the same reason.
 *
 * Kept to four short facts, and only facts the figures above do not already
 * carry: client sectors and event formats are counted up there, so saying them
 * again here is words without information.
 */
export const CAPABILITY_STRIP: string[] = [
  "Mumbai HQ, operating worldwide",
  "Delegations of 10 to 500+",
  "Venue, logistics, production, on-site",
  "End to end, no handoffs",
];
