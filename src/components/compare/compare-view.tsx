"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Photo } from "@/components/site/photo";
import { Stars } from "@/components/site/stars";
import { SaveButton } from "@/components/site/save-button";
import { PACKAGES, REGION_LABEL, TRIP_TYPE_LABEL } from "@/lib/data";
import { quote, seasonBand, SEASON_BAND_LABEL, MONTHS } from "@/lib/pricing";
import { firstOfMonth } from "@/lib/filters";
import { selectionToParams, stripTime } from "@/lib/booking";
import { useCurrency, useTrips, COMPARE_LIMIT } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Comparison is only useful if every column is priced for the same party on the
 * same dates — so the controls sit above the table and drive all three quotes.
 */
export function CompareView() {
  const { compare, toggleCompare, clearCompare, ready } = useTrips();
  const { format } = useCurrency();

  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [month, setMonth] = React.useState(() => (new Date().getMonth() + 2) % 12);

  const packages = compare
    .map((slug) => PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is (typeof PACKAGES)[number] => Boolean(p));

  const quotes = packages.map((pkg) => {
    const start = stripTime(firstOfMonth(month));
    const operating = pkg.seasonality[month] > 0;
    return {
      pkg,
      start,
      operating,
      q: operating
        ? quote({ pkg, adults, children, start, roomId: pkg.rooms[0].id, addOnIds: [] })
        : null,
    };
  });

  const prices = quotes.map((x) => x.q?.total ?? Infinity);
  const cheapest = Math.min(...prices);

  if (!ready) return <div className="h-[40vh]" />;

  if (packages.length === 0) return <EmptyCompare />;

  const allInclusions = Array.from(new Set(packages.flatMap((p) => p.inclusions.map(normalise))));

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 lg:px-10">
      {/* shared party controls */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <span className="eyebrow">Priced for</span>
          <div className="mt-2 flex items-center gap-4">
            <Counter label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
            <Counter label="Children" value={children} min={0} max={6} onChange={setChildren} />
          </div>
        </div>
        <div>
          <span className="eyebrow">Departing</span>
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="mt-2 h-10 w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="max-w-xs text-[11.5px] leading-relaxed text-muted-foreground">
          Every column below is quoted for the same party in the same month, in the
          entry-level room, with no add-ons.
        </p>
        <button
          onClick={clearCompare}
          className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Clear comparison
        </button>
      </div>

      {/* table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-[168px]" />
              {quotes.map(({ pkg }) => (
                <th key={pkg.slug} className="border-b border-border p-3 pt-0 align-top">
                  <div className="relative">
                    <div className="aspect-[3/2] overflow-hidden rounded-lg bg-sand">
                      <Photo src={pkg.hero} fallbackSeed={pkg.slug} alt="" />
                    </div>
                    <button
                      onClick={() => toggleCompare(pkg.slug)}
                      aria-label={`Remove ${pkg.name}`}
                      className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/70"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <span className="eyebrow mt-3 block text-left">{REGION_LABEL[pkg.region]}</span>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="display mt-1 block text-left text-[19px] leading-tight font-normal hover:text-gold"
                  >
                    {pkg.name}
                  </Link>
                </th>
              ))}
              {packages.length < COMPARE_LIMIT && (
                <th className="border-b border-border p-3 pt-0 align-top">
                  <AddColumn exclude={compare} onAdd={toggleCompare} />
                </th>
              )}
            </tr>
          </thead>

          <tbody className="text-[13px]">
            <Row label="All-in price">
              {quotes.map(({ pkg, q, operating }) => (
                <Cell key={pkg.slug}>
                  {operating && q ? (
                    <>
                      <span
                        className={cn(
                          "tabular display block text-2xl",
                          q.total === cheapest && "text-gold"
                        )}
                      >
                        {format(q.total)}
                      </span>
                      <span className="tabular mt-0.5 block text-[11px] text-muted-foreground">
                        {format(q.perTraveller)} per traveller
                        {q.total === cheapest && packages.length > 1 && " · lowest here"}
                      </span>
                    </>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">
                      Not operating in {MONTHS[month]}
                    </span>
                  )}
                </Cell>
              ))}
            </Row>

            <Row label={`Season in ${MONTHS[month]}`}>
              {quotes.map(({ pkg }) => {
                const band = seasonBand(pkg.seasonality[month]);
                return (
                  <Cell key={pkg.slug}>
                    <span className="tabular">
                      {SEASON_BAND_LABEL[band]}
                      {pkg.seasonality[month] > 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          ×{pkg.seasonality[month].toFixed(2)}
                        </span>
                      )}
                    </span>
                  </Cell>
                );
              })}
            </Row>

            <Row label="Length">
              {packages.map((p) => (
                <Cell key={p.slug}>
                  <span className="tabular">
                    {p.nights} nights · {p.itinerary.length} days
                  </span>
                </Cell>
              ))}
            </Row>

            <Row label="Pace">
              {packages.map((p) => (
                <Cell key={p.slug}>{p.physicality}</Cell>
              ))}
            </Row>

            <Row label="Suits">
              {packages.map((p) => (
                <Cell key={p.slug}>{p.tripTypes.map((t) => TRIP_TYPE_LABEL[t]).join(", ")}</Cell>
              ))}
            </Row>

            <Row label="Max group">
              {packages.map((p) => (
                <Cell key={p.slug}>
                  <span className="tabular">{p.groupSizeMax}</span>
                </Cell>
              ))}
            </Row>

            <Row label="Rating">
              {packages.map((p) => (
                <Cell key={p.slug}>
                  <span className="flex items-center gap-2">
                    <Stars value={p.rating} />
                    <span className="tabular text-[12px]">
                      {p.rating.toFixed(1)} ({p.reviewCount})
                    </span>
                  </span>
                </Cell>
              ))}
            </Row>

            <Row label="Stops on route">
              {packages.map((p) => (
                <Cell key={p.slug}>{p.route.map((r) => r.name).join(" → ")}</Cell>
              ))}
            </Row>

            <tr>
              <th
                colSpan={packages.length + 2}
                className="border-y border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)] px-3 py-2.5 text-left"
              >
                <span className="eyebrow">What is included</span>
              </th>
            </tr>

            {allInclusions.map((item) => (
              <Row key={item} label={item} labelClass="font-normal text-muted-foreground">
                {packages.map((p) => {
                  const has = p.inclusions.some((i) => normalise(i) === item);
                  return (
                    <Cell key={p.slug} center>
                      {has ? (
                        <Check className="mx-auto size-4 text-emerald-600" strokeWidth={2.2} />
                      ) : (
                        <Minus className="mx-auto size-4 text-border" strokeWidth={2.2} />
                      )}
                    </Cell>
                  );
                })}
              </Row>
            ))}

            <tr>
              <td className="p-3" />
              {packages.map((p) => (
                <td key={p.slug} className="p-3 align-top">
                  <div className="flex flex-col gap-2">
                    <Button asChild className="h-10 gap-1.5 rounded-full text-[13px]">
                      <Link
                        href={`/book/${p.slug}?${selectionToParams({
                          start: stripTime(firstOfMonth(month)),
                          adults,
                          children,
                          roomId: p.rooms[0].id,
                          addOnIds: [],
                        }).toString()}`}
                      >
                        Book this one
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                    <div className="flex justify-center">
                      <SaveButton slug={p.slug} withLabel />
                    </div>
                  </div>
                </td>
              ))}
              {packages.length < COMPARE_LIMIT && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Inclusion lines differ in wording between journeys; compare on the gist. */
function normalise(s: string) {
  return s
    .replace(/^\d+\s*nights?/i, "Accommodation for the full itinerary")
    .replace(/\s+/g, " ")
    .trim();
}

function Row({
  label,
  labelClass,
  children,
}: {
  label: string;
  labelClass?: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="group">
      <th
        scope="row"
        className={cn(
          "border-b border-border py-3 pr-4 text-left align-top text-[11.5px] font-medium tracking-wide text-muted-foreground",
          labelClass
        )}
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <td
      className={cn(
        "border-b border-border p-3 align-top leading-relaxed transition-colors group-hover:bg-gold-soft/20",
        center && "text-center"
      )}
    >
      {children}
    </td>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1 rounded-full border border-border p-0.5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label}`}
          className="inline-flex size-6 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-30"
        >
          <Minus className="size-3" />
        </button>
        <span className="tabular w-5 text-center text-[13px] font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label}`}
          className="inline-flex size-6 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-30"
        >
          <Plus className="size-3" />
        </button>
      </span>
    </div>
  );
}

function AddColumn({ exclude, onAdd }: { exclude: string[]; onAdd: (slug: string) => void }) {
  const options = PACKAGES.filter((p) => !exclude.includes(p.slug));
  return (
    <div className="flex aspect-[3/2] flex-col items-center justify-center rounded-lg border border-dashed border-border p-4">
      <Plus className="size-5 text-muted-foreground" strokeWidth={1.5} />
      <span className="mt-2 text-center text-[12px] text-muted-foreground">
        Add a third journey
      </span>
      <Select onValueChange={onAdd}>
        <SelectTrigger className="mt-3 h-9 w-full text-[12px]">
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          {options.map((p) => (
            <SelectItem key={p.slug} value={p.slug}>
              {p.destination} — {p.nights}N
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyCompare() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h2 className="display text-3xl">Nothing to compare yet</h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Add up to three journeys from any card or journey page and they will be priced
        here side by side for the same party, on the same dates, in the same room
        category.
      </p>
      <Button asChild className="mt-8 h-11 rounded-full px-6">
        <Link href="/packages">Browse journeys</Link>
      </Button>
    </div>
  );
}
