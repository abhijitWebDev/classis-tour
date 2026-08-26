import type { Package, RegionId, TripTypeId } from "@/lib/types";
import { blendedSeason } from "@/lib/pricing";

export type DurationBucket = "any" | "short" | "medium" | "long";
export type SortKey = "recommended" | "duration-asc" | "duration-desc" | "rating";

export const DURATIONS: { id: DurationBucket; label: string; test: (n: number) => boolean }[] = [
  { id: "any", label: "Any length", test: () => true },
  { id: "short", label: "Up to 5 nights", test: (n) => n <= 5 },
  { id: "medium", label: "6 – 8 nights", test: (n) => n >= 6 && n <= 8 },
  { id: "long", label: "9 nights or more", test: (n) => n >= 9 },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "duration-asc", label: "Shortest first" },
  { id: "duration-desc", label: "Longest first" },
  { id: "rating", label: "Best reviewed" },
];

export type Filters = {
  q: string;
  region: RegionId | "all";
  type: TripTypeId | "all";
  duration: DurationBucket;
  /** Month index 0–11, or -1 for "any month". */
  month: number;
  sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  region: "all",
  type: "all",
  duration: "any",
  month: -1,
  sort: "recommended",
};

export function parseFilters(params: URLSearchParams | Record<string, string | undefined>): Filters {
  const get = (k: string) =>
    params instanceof URLSearchParams ? (params.get(k) ?? undefined) : params[k];

  const month = Number(get("month"));

  return {
    q: get("q") ?? "",
    region: (get("region") as Filters["region"]) || "all",
    type: (get("type") as Filters["type"]) || "all",
    duration: (get("duration") as DurationBucket) || "any",
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
  if (f.month >= 0) n++;
  return n;
}

/** Whether a package can actually run in the selected month. */
export function operatesIn(pkg: Package, month: number) {
  if (month < 0) return true;
  const season = blendedSeason(pkg, firstOfMonth(month));
  return season.multiplier > 0;
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

    if (!operatesIn(p, f.month)) return false;

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
    case "duration-asc":
      sorted.sort((a, b) => a.nights - b.nights);
      break;
    case "duration-desc":
      sorted.sort((a, b) => b.nights - a.nights);
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
