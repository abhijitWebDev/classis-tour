import type { AddOn, Package } from "@/lib/types";

export const CHILD_RATE = 0.65;
/** GST on tour operator packages, applied to land + add-ons. */
export const TAX_RATE = 0.05;
export const SINGLE_SUPPLEMENT = 0.35;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type SeasonBand = "value" | "shoulder" | "peak" | "closed";

export function seasonBand(multiplier: number): SeasonBand {
  if (multiplier === 0) return "closed";
  if (multiplier < 0.95) return "value";
  if (multiplier < 1.12) return "shoulder";
  return "peak";
}

export const SEASON_BAND_LABEL: Record<SeasonBand, string> = {
  value: "Value season",
  shoulder: "Shoulder season",
  peak: "Peak season",
  closed: "Not operating",
};

export function groupDiscountRate(travellers: number) {
  if (travellers >= 8) return 0.1;
  if (travellers >= 6) return 0.07;
  if (travellers >= 4) return 0.04;
  return 0;
}

export function endDate(start: Date, nights: number) {
  const d = new Date(start);
  d.setDate(d.getDate() + nights);
  return d;
}

/**
 * A trip that starts on 28 Nov and ends on 5 Dec is priced across both months,
 * weighted by how many nights fall in each. Straddling a season boundary should
 * cost something between the two, not whatever the arrival date happens to be.
 */
export function blendedSeason(pkg: Package, start: Date) {
  const nights = pkg.nights;
  const perMonth = new Map<number, number>();
  for (let i = 0; i < nights; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const m = d.getMonth();
    perMonth.set(m, (perMonth.get(m) ?? 0) + 1);
  }
  let multiplier = 0;
  let closedNights = 0;
  for (const [m, count] of perMonth) {
    const value = pkg.seasonality[m];
    if (value === 0) closedNights += count;
    multiplier += value * (count / nights);
  }
  const months = [...perMonth.keys()].sort((a, b) => a - b);
  return {
    multiplier: closedNights > 0 ? 0 : Number(multiplier.toFixed(4)),
    months,
    label: months.map((m) => MONTHS[m]).join(" – "),
    closedNights,
    band: seasonBand(closedNights > 0 ? 0 : multiplier),
  };
}

/** The next date on which this package actually operates. */
export function nextOpenDate(pkg: Package, from: Date) {
  const probe = new Date(from);
  for (let i = 0; i < 400; i++) {
    if (blendedSeason(pkg, probe).multiplier > 0) return probe;
    probe.setDate(probe.getDate() + 1);
  }
  return null;
}

/**
 * Detail lines mix prose and money. Money is carried as a raw INR amount and
 * formatted by the view, so a breakdown reads correctly in either currency.
 */
export type LineDetail = (string | { money: number })[];

export type QuoteLine = {
  id: string;
  label: string;
  detail?: LineDetail;
  /** Amount in INR. Negative for savings. */
  amount: number;
  kind?: "saving" | "tax" | "fixed";
};

export type Quote = {
  closed: boolean;
  season: ReturnType<typeof blendedSeason>;
  travellers: number;
  roomsNeeded: number;
  lines: QuoteLine[];
  landSubtotal: number;
  addOnsSubtotal: number;
  fixedSubtotal: number;
  tax: number;
  total: number;
  perTraveller: number;
  /** Cheapest total achievable for this party in the next twelve months. */
  savingsVsPeak: number;
};

export type QuoteInput = {
  pkg: Package;
  adults: number;
  children: number;
  start: Date;
  roomId: string;
  addOnIds: string[];
};

export function quote({ pkg, adults, children, start, roomId, addOnIds }: QuoteInput): Quote {
  const room = pkg.rooms.find((r) => r.id === roomId) ?? pkg.rooms[0];
  const season = blendedSeason(pkg, start);
  const travellers = adults + children;
  const roomsNeeded = Math.max(1, Math.ceil(adults / room.maxAdults));

  const adultLand = pkg.baseAdultINR * adults;
  const childLand = Math.round(pkg.baseAdultINR * CHILD_RATE * children);
  const baseLand = adultLand + childLand;
  const roomSupplement = Math.round(baseLand * (room.multiplier - 1));
  const seasonAdjustment = Math.round((baseLand + roomSupplement) * (season.multiplier - 1));
  const singleSupplement =
    adults === 1 && children === 0 ? Math.round(pkg.baseAdultINR * SINGLE_SUPPLEMENT) : 0;

  const preDiscount = baseLand + roomSupplement + seasonAdjustment + singleSupplement;
  const discountRate = groupDiscountRate(travellers);
  const groupSaving = -Math.round(preDiscount * discountRate);
  const landSubtotal = preDiscount + groupSaving;

  const chosenAddOns: AddOn[] = pkg.addOns.filter((a) => addOnIds.includes(a.id));
  const addOnLines: QuoteLine[] = chosenAddOns.map((a) => ({
    id: `addon-${a.id}`,
    label: a.name,
    detail:
      a.unit === "per-traveller"
        ? [`${travellers} × `, { money: a.price }, " per traveller"]
        : ["Per booking"],
    amount: a.unit === "per-traveller" ? a.price * travellers : a.price,
  }));
  const addOnsSubtotal = addOnLines.reduce((s, l) => s + l.amount, 0);

  const fixedSubtotal = pkg.fixedPerTravellerINR * travellers;
  const tax = Math.round((landSubtotal + addOnsSubtotal) * TAX_RATE);
  const total = landSubtotal + addOnsSubtotal + fixedSubtotal + tax;

  const lines: QuoteLine[] = [
    {
      id: "adults",
      label: `Land arrangements — ${adults} adult${adults > 1 ? "s" : ""}`,
      detail: [`${pkg.nights} nights × `, { money: pkg.baseAdultINR }, " per adult"],
      amount: adultLand,
    },
  ];
  if (children > 0) {
    lines.push({
      id: "children",
      label: `Children under 12 — ${children}`,
      detail: [`${Math.round(CHILD_RATE * 100)}% of the adult land rate`],
      amount: childLand,
    });
  }
  if (roomSupplement !== 0) {
    lines.push({
      id: "room",
      label: `${room.name}`,
      detail: [
        `${roomsNeeded} room${roomsNeeded > 1 ? "s" : ""} · ${(room.multiplier * 100 - 100).toFixed(0)}% on land cost`,
      ],
      amount: roomSupplement,
    });
  }
  lines.push({
    id: "season",
    label: `Seasonal rate — ${season.label}`,
    detail: [`${SEASON_BAND_LABEL[season.band]} · ×${season.multiplier.toFixed(2)}`],
    amount: seasonAdjustment,
    kind: seasonAdjustment < 0 ? "saving" : undefined,
  });
  if (singleSupplement > 0) {
    lines.push({
      id: "single",
      label: "Single traveller supplement",
      detail: [`${Math.round(SINGLE_SUPPLEMENT * 100)}% — sole occupancy`],
      amount: singleSupplement,
    });
  }
  if (groupSaving !== 0) {
    lines.push({
      id: "group",
      label: `Group saving — ${travellers} travelling`,
      detail: [`${Math.round(discountRate * 100)}% off land arrangements`],
      amount: groupSaving,
      kind: "saving",
    });
  }
  lines.push(...addOnLines);
  lines.push({
    id: "fixed",
    label: "Flights, permits & visa services",
    detail: [`${travellers} × `, { money: pkg.fixedPerTravellerINR }, " — not discountable"],
    amount: fixedSubtotal,
    kind: "fixed",
  });
  lines.push({
    id: "tax",
    label: `GST at ${Math.round(TAX_RATE * 100)}%`,
    detail: ["On land arrangements and add-ons"],
    amount: tax,
    kind: "tax",
  });

  const peak = Math.max(...pkg.seasonality);
  const peakLand = Math.round(
    (baseLand + roomSupplement) * peak + singleSupplement
  );
  const savingsVsPeak = Math.max(0, Math.round((peakLand * (1 - discountRate)) - landSubtotal));

  return {
    closed: season.multiplier === 0,
    season,
    travellers,
    roomsNeeded,
    lines,
    landSubtotal,
    addOnsSubtotal,
    fixedSubtotal,
    tax,
    total,
    perTraveller: Math.round(total / Math.max(1, travellers)),
    savingsVsPeak,
  };
}

/** The headline "from" figure: two adults, cheapest room, cheapest open month. */
export function fromPriceINR(pkg: Package) {
  const cheapest = Math.min(...pkg.seasonality.filter((m) => m > 0));
  const land = pkg.baseAdultINR * 2 * cheapest;
  return Math.round((land + land * TAX_RATE) / 2 + pkg.fixedPerTravellerINR);
}
