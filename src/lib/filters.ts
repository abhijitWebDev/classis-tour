import type { Package, RegionId, TripTypeId } from "@/lib/types";
import { fromPriceINR, blendedSeason } from "@/lib/pricing";

export type DurationBucket = "any" | "short" | "medium" | "long";
export type SortKey = "recommended" | "price-asc" | "price-desc" | "duration-asc" | "rating";

export const DURATIONS: { id: DurationBucket; label: string; test: (n: number) => boolean }[] = [
  { id: "any", label: "Any length", test: () => true },
  { id: "short", label: "Up to 5 nights", test: (n) => n <= 5 },
  { id: "medium", label: "6 – 8 nights", test: (n) => n >= 6 && n <= 8 },
  { id: "long", label: "9 nights or more", test: (n) => n >= 9 },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "duration-asc", label: "Shortest first" },
  { id: "rating", label: "Best reviewed" },
];

export const BUDGET_MIN = 60000;
export const BUDGET_MAX = 500000;

export type Filters = {
  q: string;
  region: RegionId | "all";
  type: TripTypeId | "all";
  duration: DurationBucket;
  budget: number;
  /** Month index 0–11, or -1 for "any month". */
  month: number;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  region: "all",
  type: "all",
  duration: "any",
  budget: BUDGET_MAX,
  month: -1,
  sort: "recommended",
};

export function parseFilters(params: URLSearchParams | Record<string, string | undefined>): Filters {
  const get = (k: string) =>
    params instanceof URLSearchParams ? (params.get(k) ?? undefined) : params[k];

  const budget = Number(get("budget"));
  const month = Number(get("month"));

  return {
    q: get("q") ?? "",
    region: (get("region") as Filters["region"]) || "all",
    type: (get("type") as Filters["type"]) || "all",
    duration: (get("duration") as DurationBucket) || "any",
    budget: Number.isFinite(budget) && budget > 0 ? Math.min(budget, BUDGET_MAX) : BUDGET_MAX,
    month: Number.isInteger(month) && month >= 0 && month <= 11 ? month : -1,
    sort: (get("sort") as SortKey) || "recommended",
  };
}

export function serializeFilters(f: Filters) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.region !== "all") p.set("region", f.region);
  if (f.type !== "all") p.set("type", f.type);
  if (f.duration !== "any") p.set("duration", f.duration);
  if (f.budget < BUDGET_MAX) p.set("budget", String(f.budget));
  if (f.month >= 0) p.set("month", String(f.month));
  if (f.sort !== "recommended") p.set("sort", f.sort);
  return p;
}

export function activeFilterCount(f: Filters) {
  let n = 0;
  if (f.q.trim()) n++;
  if (f.region !== "all") n++;
  if (f.type !== "all") n++;
  if (f.duration !== "any") n++;
  if (f.budget < BUDGET_MAX) n++;
  if (f.month >= 0) n++;
  return n;
}

/** Price shown on a result card: honours a selected month, otherwise "from". */
export function displayPriceINR(pkg: Package, month: number) {
  if (month < 0) return fromPriceINR(pkg);
  const start = firstOfMonth(month);
  const season = blendedSeason(pkg, start);
  if (season.multiplier === 0) return null;
  const land = pkg.baseAdultINR * season.multiplier;
  return Math.round(land * 1.05 + pkg.fixedPerTravellerINR);
}

export function firstOfMonth(month: number, from = new Date()) {
  const d = new Date(from.getFullYear(), month, 12);
  if (d.getTime() < from.getTime()) d.setFullYear(d.getFullYear() + 1);
  return d;
}

export function applyFilters(packages: Package[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const duration = DURATIONS.find((d) => d.id === f.duration) ?? DURATIONS[0];

  const matched = packages.filter((p) => {
    if (f.region !== "all" && p.region !== f.region) return false;
    if (f.type !== "all" && !p.tripTypes.includes(f.type)) return false;
    if (!duration.test(p.nights)) return false;
    if (f.month >= 0 && p.seasonality[f.month] === 0) return false;

    const price = displayPriceINR(p, f.month);
    if (price === null || price > f.budget) return false;

    if (q) {
      const haystack = [p.name, p.destination, p.country, p.tagline, p.summary]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...matched];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => (displayPriceINR(a, f.month) ?? 0) - (displayPriceINR(b, f.month) ?? 0));
      break;
    case "price-desc":
      sorted.sort((a, b) => (displayPriceINR(b, f.month) ?? 0) - (displayPriceINR(a, f.month) ?? 0));
      break;
    case "duration-asc":
      sorted.sort((a, b) => a.nights - b.nights);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    default:
      sorted.sort((a, b) => b.rating * Math.log(b.reviewCount) - a.rating * Math.log(a.reviewCount));
  }
  return sorted;
}

/** Which months this package cannot operate in — surfaced next to the month picker. */
export function closedMonths(pkg: Package) {
  return pkg.seasonality.map((m, i) => (m === 0 ? i : -1)).filter((i) => i >= 0);
}
