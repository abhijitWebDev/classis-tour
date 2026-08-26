"use client";

import * as React from "react";
import { CalendarDays, Minus, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Package } from "@/lib/types";
import { blendedSeason, MONTHS_SHORT, nextOpenDate, SEASON_BAND_LABEL, seasonBand } from "@/lib/pricing";
import { endDate } from "@/lib/pricing";
import { formatDateLong, formatDateShort, stripTime } from "@/lib/booking";
import { cn } from "@/lib/utils";

export function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
        <StepButton
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          label={`Decrease ${label}`}
        >
          <Minus className="size-3.5" />
        </StepButton>
        <span className="tabular w-7 text-center text-sm font-semibold">{value}</span>
        <StepButton
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          label={`Increase ${label}`}
        >
          <Plus className="size-3.5" />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

const BAND_DOT: Record<string, string> = {
  value: "bg-emerald-500",
  shoulder: "bg-amber-500",
  peak: "bg-rose-500",
  closed: "bg-border",
};

export function DepartureField({
  pkg,
  value,
  onChange,
}: {
  pkg: Package;
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const today = stripTime(new Date());
  const season = blendedSeason(pkg, value);
  const band = season.band;
  const returns = endDate(value, pkg.nights);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5 text-left transition-colors hover:border-gold"
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Departure
            </span>
            <span className="tabular flex items-center gap-1.5 truncate text-sm font-semibold">
              <span className={cn("size-1.5 shrink-0 rounded-full", BAND_DOT[band])} title={SEASON_BAND_LABEL[band]} />
              {formatDateLong(value)}
            </span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Returns
            </span>
            <span className="tabular block text-sm font-medium">{formatDateShort(returns)}</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          startMonth={today}
          onSelect={(d) => {
            if (!d) return;
            onChange(stripTime(d));
            setOpen(false);
          }}
          disabled={(date) =>
            stripTime(date) < today || blendedSeason(pkg, stripTime(date)).multiplier === 0
          }
          className="p-3"
        />
        <div className="border-t border-border p-3">
          <SeasonLegend pkg={pkg} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Twelve months of real rate movement, readable at a glance. */
export function SeasonLegend({
  pkg,
  onPick,
  className,
}: {
  pkg: Package;
  onPick?: (month: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid grid-cols-12 gap-1">
        {pkg.seasonality.map((m, i) => {
          const b = seasonBand(m);
          const content = (
            <>
              <span className={cn("block h-1.5 w-full rounded-full", BAND_DOT[b])} />
              <span className="tabular mt-1 block text-[9px] text-muted-foreground">
                {MONTHS_SHORT[i].slice(0, 1)}
              </span>
            </>
          );
          const title = `${MONTHS_SHORT[i]} — ${SEASON_BAND_LABEL[b]}${m ? ` (×${m.toFixed(2)})` : ""}`;
          return onPick && m > 0 ? (
            <button key={i} type="button" title={title} onClick={() => onPick(i)} className="text-center">
              {content}
            </button>
          ) : (
            <span key={i} title={title} className="block text-center">
              {content}
            </span>
          );
        })}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        <Legend dot="bg-emerald-500" label="Value" />
        <Legend dot="bg-amber-500" label="Shoulder" />
        <Legend dot="bg-rose-500" label="Peak" />
        <Legend dot="bg-border" label="Not operating" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

/**
 * Shown when the chosen departure falls inside a month the journey does not
 * operate — it names the next date that does, rather than just refusing.
 */
export function ClosedSeasonNote({ pkg, start }: { pkg: Package; start: Date }) {
  const next = nextOpenDate(pkg, start);
  return (
    <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-900">
      {pkg.name} does not operate on {formatDateLong(start)} — the season is closed.
      {next ? (
        <>
          {" "}
          The next departure we can run is{" "}
          <span className="font-semibold">{formatDateLong(next)}</span>.
        </>
      ) : (
        " Talk to us about the following season."
      )}
    </p>
  );
}
