"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DepartureField, SeasonLegend, Stepper } from "@/components/package/controls";
import { PriceBreakdown } from "@/components/package/price-breakdown";
import { SaveButton } from "@/components/site/save-button";
import type { Package } from "@/lib/types";
import { quote, nextOpenDate, MONTHS, SEASON_BAND_LABEL } from "@/lib/pricing";
import { defaultSelection, selectionToParams, stripTime, type Selection } from "@/lib/booking";
import { firstOfMonth } from "@/lib/filters";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PriceCalculator({ pkg }: { pkg: Package }) {
  const { format } = useCurrency();
  const [sel, setSel] = React.useState<Selection>(() => defaultSelection(pkg));
  const patch = (p: Partial<Selection>) => setSel((s) => ({ ...s, ...p }));

  const q = React.useMemo(
    () =>
      quote({
        pkg,
        adults: sel.adults,
        children: sel.children,
        start: sel.start,
        roomId: sel.roomId,
        addOnIds: sel.addOnIds,
      }),
    [pkg, sel]
  );

  const room = pkg.rooms.find((r) => r.id === sel.roomId)!;
  const bookHref = `/book/${pkg.slug}?${selectionToParams(sel).toString()}`;

  return (
    <div id="price" className="scroll-mt-28 rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="eyebrow">Live price</span>
            <p className="tabular display mt-1.5 text-[clamp(1.9rem,4vw,2.5rem)] leading-none">
              {format(q.total)}
            </p>
            <p className="tabular mt-2 text-[12px] text-muted-foreground">
              {format(q.perTraveller)} per traveller · {q.travellers} travelling ·{" "}
              {pkg.nights} nights
            </p>
          </div>
          <SaveButton slug={pkg.slug} />
        </div>

        {q.savingsVsPeak > 0 && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-medium text-emerald-800">
            <Sparkles className="size-3" />
            {format(q.savingsVsPeak)} below the same trip in peak season
          </p>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div>
          <DepartureField pkg={pkg} value={sel.start} onChange={(d) => patch({ start: d })} />
          <SeasonLegend
            pkg={pkg}
            className="mt-3"
            onPick={(m) => patch({ start: stripTime(firstOfMonth(m)) })}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {q.season.label} — {SEASON_BAND_LABEL[q.season.band]}, a ×
            {q.season.multiplier.toFixed(2)} rate on land arrangements.
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <Stepper
            label="Adults"
            hint={`Maximum ${pkg.groupSizeMax} in a departure`}
            value={sel.adults}
            min={1}
            max={pkg.groupSizeMax - sel.children}
            onChange={(v) => patch({ adults: v })}
          />
          <Stepper
            label="Children"
            hint="Under 12 — 65% of the adult land rate"
            value={sel.children}
            min={0}
            max={pkg.groupSizeMax - sel.adults}
            onChange={(v) => patch({ children: v })}
          />
        </div>

        <div className="border-t border-border pt-5">
          <span className="eyebrow">Room or villa</span>
          <RadioGroup
            value={sel.roomId}
            onValueChange={(v) => patch({ roomId: v })}
            className="mt-3 gap-2"
          >
            {pkg.rooms.map((r) => (
              <label
                key={r.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
                  sel.roomId === r.id
                    ? "border-gold bg-gold-soft/40"
                    : "border-border hover:border-gold/60"
                )}
              >
                <RadioGroupItem value={r.id} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium">{r.name}</span>
                    <span className="tabular shrink-0 text-[11px] text-muted-foreground">
                      {r.multiplier === 1 ? "included" : `+${Math.round((r.multiplier - 1) * 100)}%`}
                    </span>
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-relaxed text-muted-foreground">
                    {r.description}
                  </span>
                </span>
              </label>
            ))}
          </RadioGroup>
          {q.roomsNeeded > 1 && (
            <p className="tabular mt-2 text-[11px] text-muted-foreground">
              {sel.adults} adults in {room.name} — {q.roomsNeeded} rooms held.
            </p>
          )}
        </div>

        <div className="border-t border-border pt-5">
          <span className="eyebrow">Optional additions</span>
          <div className="mt-3 space-y-2">
            {pkg.addOns.map((a) => {
              const on = sel.addOnIds.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
                    on ? "border-gold bg-gold-soft/40" : "border-border hover:border-gold/60"
                  )}
                >
                  <Checkbox
                    checked={on}
                    onCheckedChange={(c) =>
                      patch({
                        addOnIds: c
                          ? [...sel.addOnIds, a.id]
                          : sel.addOnIds.filter((x) => x !== a.id),
                      })
                    }
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-medium">
                        {a.name}
                        {a.recommended && (
                          <span className="ml-1.5 rounded-full bg-gold-soft px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wide text-accent-foreground uppercase">
                            Suggested
                          </span>
                        )}
                      </span>
                      <span className="tabular shrink-0 text-[11px] font-medium">
                        {a.price === 0 ? "No charge" : format(a.price)}
                      </span>
                    </span>
                    <span className="mt-1 block text-[11.5px] leading-relaxed text-muted-foreground">
                      {a.description}
                      {a.unit === "per-traveller" && a.price > 0 && " · per traveller"}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <Accordion type="single" collapsible className="border-t border-border">
          <AccordionItem value="breakdown" className="border-0">
            <AccordionTrigger className="py-4 text-[13px] font-medium hover:no-underline">
              See the full breakdown — {q.lines.length} lines
            </AccordionTrigger>
            <AccordionContent>
              <PriceBreakdown quote={q} compact />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-3 border-t border-border bg-[color-mix(in_oklch,var(--card),var(--foreground)_3%)] p-5">
        <Button asChild className="h-11 w-full gap-2 rounded-full text-sm">
          <Link href={bookHref}>
            Continue to booking
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Holds your dates for 48 hours. 20% deposit to confirm, balance 45 days before
          departure.
        </p>
      </div>
    </div>
  );
}

/** Shown when someone lands on a date the journey does not run. */
export function ClosedSeasonNote({ pkg, start }: { pkg: Package; start: Date }) {
  const next = nextOpenDate(pkg, start);
  const open = pkg.seasonality
    .map((m, i) => (m > 0 ? MONTHS[i] : null))
    .filter(Boolean) as string[];

  return (
    <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-[12.5px] leading-relaxed text-amber-900">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <div>
        <strong className="font-semibold">This journey does not run on those dates.</strong>{" "}
        {pkg.destination} operates in {open.join(", ")}.
        {next && ` The next departure we can hold is ${next.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`}
      </div>
    </div>
  );
}
