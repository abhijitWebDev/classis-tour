import type { Package } from "@/lib/types";
import { nextOpenDate } from "@/lib/pricing";

export type Selection = {
  start: Date;
  adults: number;
  children: number;
  roomId: string;
  addOnIds: string[];
};

export function toISODate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISODate(s: string | null | undefined) {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Six weeks out, nudged forward to the next month the journey actually runs. */
export function defaultStart(pkg: Package) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + 42);
  return nextOpenDate(pkg, base) ?? base;
}

export function defaultSelection(pkg: Package): Selection {
  return {
    start: defaultStart(pkg),
    adults: 2,
    children: 0,
    roomId: pkg.rooms[0].id,
    addOnIds: [],
  };
}

export function selectionToParams(s: Selection) {
  const p = new URLSearchParams();
  p.set("start", toISODate(s.start));
  p.set("adults", String(s.adults));
  p.set("children", String(s.children));
  p.set("room", s.roomId);
  if (s.addOnIds.length) p.set("addons", s.addOnIds.join(","));
  return p;
}

export function selectionFromParams(
  pkg: Package,
  params: URLSearchParams | Record<string, string | undefined>
): Selection {
  const get = (k: string) =>
    params instanceof URLSearchParams ? params.get(k) : params[k];

  const base = defaultSelection(pkg);
  const start = fromISODate(get("start"));
  const adults = Number(get("adults"));
  const children = Number(get("children"));
  const roomId = get("room");
  const addons = (get("addons") ?? "").split(",").filter(Boolean);
  const validAddOnIds = new Set(pkg.addOns.map((a) => a.id));

  return {
    start: start && start >= stripTime(new Date()) ? start : base.start,
    adults: Number.isInteger(adults) ? clamp(adults, 1, pkg.groupSizeMax) : base.adults,
    children: Number.isInteger(children) ? clamp(children, 0, pkg.groupSizeMax - 1) : base.children,
    roomId: pkg.rooms.some((r) => r.id === roomId) ? roomId! : base.roomId,
    addOnIds: addons.filter((a) => validAddOnIds.has(a)),
  };
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function stripTime(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function formatDateLong(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** A deterministic, human-readable reference for the confirmation screen. */
export function bookingReference(pkg: Package, s: Selection) {
  const seed =
    pkg.slug.length * 7 +
    s.adults * 31 +
    s.children * 17 +
    s.start.getDate() * 13 +
    (s.start.getMonth() + 1) * 101;
  return `CT-${pkg.country.slice(0, 2).toUpperCase()}${String(seed % 9000 + 1000)}`;
}
