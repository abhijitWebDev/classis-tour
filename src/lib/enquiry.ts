import type { RegionId } from "@/lib/types";

/** Which desk an enquiry lands on. Drives copy, fields and the reference prefix. */
export type Desk = "corporate" | "mice";

export type DeskConfig = {
  id: Desk;
  eyebrow: string;
  title: string;
  lede: string;
  /** The reference prefix used on the confirmation screen. */
  refPrefix: string;
  /** Services listed as a ledger on the page. */
  services: { index: string; title: string; body: string }[];
  /** Options for the "what do you need" control in the enquiry form. */
  briefTypes: { id: string; label: string }[];
  /** Sizes offered for the delegate/traveller count control. */
  sizes: { id: string; label: string }[];
};

export const DESKS: Record<Desk, DeskConfig> = {
  corporate: {
    id: "corporate",
    eyebrow: "Corporate & business travel",
    title: "Delegations that arrive on schedule",
    lede: "Business travel is a logistics problem with a deadline attached. We handle routing, accommodation, ground movement and the schedule discipline a working trip needs — for one executive or a delegation of two hundred.",
    refPrefix: "CT",
    services: [
      {
        index: "01",
        title: "Delegation management",
        body: "Group air, visas and documentation, arrival staggering, and a single manifest everyone works from. One point of contact for the whole party rather than one per booking.",
      },
      {
        index: "02",
        title: "Ground movement",
        body: "Airport transfers timed to actual landing, not scheduled landing. Dedicated vehicles held for the duration, drivers briefed on the day's agenda, and a controller tracking the fleet.",
      },
      {
        index: "03",
        title: "Accommodation & rate management",
        body: "Negotiated corporate rates, room blocks held against a schedule that will change, and billing consolidated to one invoice with cost centres split the way your finance team wants them.",
      },
      {
        index: "04",
        title: "Duty of care",
        body: "Traveller tracking, a 24-hour line that a person answers, and a documented escalation path for medical, weather and security disruption.",
      },
    ],
    briefTypes: [
      { id: "delegation", label: "Business delegation" },
      { id: "ongoing", label: "Ongoing travel programme" },
      { id: "roadshow", label: "Roadshow / multi-city" },
      { id: "single", label: "Single executive trip" },
    ],
    sizes: [
      { id: "1-9", label: "1–9" },
      { id: "10-49", label: "10–49" },
      { id: "50-199", label: "50–199" },
      { id: "200+", label: "200+" },
    ],
  },
  mice: {
    id: "mice",
    eyebrow: "MICE & events",
    title: "Meetings, incentives, conferences, exhibitions",
    lede: "An event is judged on the hundred small things that decide whether it runs. We take a brief end to end — venue, delegate logistics, production and on-site management — and stay on it until the last delegate is home.",
    refPrefix: "ME",
    services: [
      {
        index: "01",
        title: "Venue sourcing & contracting",
        body: "A shortlist built against your actual brief — capacity, breakout count, load-in access, F&B minimums — with the contract terms read properly before you sign them.",
      },
      {
        index: "02",
        title: "Delegate logistics",
        body: "Registration, room allocation, arrival manifests, badging and a helpdesk on site. Delegates get one set of instructions that does not change three times.",
      },
      {
        index: "03",
        title: "Production & on-site management",
        body: "Stage, AV, rehearsal schedule, run-of-show and a floor team. We run the room, so your people can be in the room.",
      },
      {
        index: "04",
        title: "Incentive travel",
        body: "Programmes built to be earned and remembered — the leisure planning on this site, applied to a group who were told they were going somewhere worth winning.",
      },
    ],
    briefTypes: [
      { id: "conference", label: "Conference / convention" },
      { id: "incentive", label: "Incentive travel" },
      { id: "offsite", label: "Meeting / offsite" },
      { id: "exhibition", label: "Exhibition / trade show" },
    ],
    sizes: [
      { id: "10-49", label: "10–49" },
      { id: "50-199", label: "50–199" },
      { id: "200-499", label: "200–499" },
      { id: "500+", label: "500+" },
    ],
  },
};

export type EnquiryDraft = {
  briefType: string;
  size: string;
  destination: string;
  month: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export const EMPTY_ENQUIRY: EnquiryDraft = {
  briefType: "",
  size: "",
  destination: "",
  month: "",
  company: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export type EnquiryErrors = Partial<Record<keyof EnquiryDraft, string>>;

/** Same validation shape as the booking flow — required fields plus format. */
export function validateEnquiry(d: EnquiryDraft): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (!d.briefType) e.briefType = "Tell us what kind of brief this is.";
  if (!d.size) e.size = "Roughly how many people?";
  if (!d.company.trim()) e.company = "Company name is required.";
  if (!d.name.trim()) e.name = "We need a name for the file.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(d.email.trim())) e.email = "A valid work email, please.";
  if (d.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(d.phone.trim()))
    e.phone = "That does not look like a phone number.";
  return e;
}

/** Deterministic-looking reference for the confirmation screen. */
export function enquiryReference(prefix: string) {
  const n = Math.floor(Math.random() * 9000) + 1000;
  const yr = String(new Date().getFullYear()).slice(2);
  return `${prefix}-${yr}-${n}`;
}

export const ENQUIRY_REGIONS: { id: RegionId | "india" | "other"; label: string }[] = [
  { id: "india", label: "Within India" },
  { id: "southeast-asia", label: "Southeast Asia" },
  { id: "arabia", label: "Middle East" },
  { id: "mediterranean", label: "Europe" },
  { id: "east-africa", label: "Africa" },
  { id: "other", label: "Elsewhere / not decided" },
];
