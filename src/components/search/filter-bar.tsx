"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS, TRIP_TYPES, REGION_LABEL, TRIP_TYPE_LABEL } from "@/lib/data";
import { MONTHS } from "@/lib/pricing";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  DEFAULT_FILTERS,
  DURATIONS,
  SORTS,
  activeFilterCount,
  type Filters,
} from "@/lib/filters";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
};

export function FilterBar({ filters, onChange, onReset, resultCount, totalCount }: Props) {
  const { format } = useCurrency();
  const active = activeFilterCount(filters);
  // The slider is uncommitted until release, so it holds a draft that resyncs
  // during render whenever the committed value changes elsewhere (a chip clear,
  // a back navigation).
  const [draft, setDraft] = React.useState({ committed: filters.budget, value: filters.budget });
  if (draft.committed !== filters.budget) {
    setDraft({ committed: filters.budget, value: filters.budget });
  }
  const draftBudget = draft.value;
  const setDraftBudget = (v: number) => setDraft((d) => ({ ...d, value: v }));

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/92 backdrop-blur-xl sm:top-[72px]">
      <div className="mx-auto max-w-[1400px] px-5 py-3 lg:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 lg:max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search destinations and journeys"
              className="h-10 pl-9 text-sm"
            />
            {filters.q && (
              <button
                onClick={() => onChange({ q: "" })}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Control
            value={filters.region}
            onValueChange={(v) => onChange({ region: v as Filters["region"] })}
            width="w-[150px]"
            active={filters.region !== "all"}
          >
            <SelectItem value="all">All regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.label}
              </SelectItem>
            ))}
          </Control>

          <Control
            value={filters.type}
            onValueChange={(v) => onChange({ type: v as Filters["type"] })}
            width="w-[145px]"
            active={filters.type !== "all"}
          >
            <SelectItem value="all">Any trip type</SelectItem>
            {TRIP_TYPES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </Control>

          <Control
            value={filters.duration}
            onValueChange={(v) => onChange({ duration: v as Filters["duration"] })}
            width="w-[145px]"
            active={filters.duration !== "any"}
          >
            {DURATIONS.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.label}
              </SelectItem>
            ))}
          </Control>

          <Control
            value={String(filters.month)}
            onValueChange={(v) => onChange({ month: Number(v) })}
            width="w-[135px]"
            active={filters.month >= 0}
          >
            <SelectItem value="-1">Any month</SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={String(i)}>
                {m}
              </SelectItem>
            ))}
          </Control>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 gap-2 rounded-lg px-3 text-sm font-normal",
                  filters.budget < BUDGET_MAX && "border-gold bg-gold-soft/50"
                )}
              >
                <SlidersHorizontal className="size-3.5" strokeWidth={1.6} />
                {filters.budget < BUDGET_MAX ? `Up to ${format(filters.budget)}` : "Budget"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Budget per traveller</span>
                <span className="tabular text-sm font-semibold">
                  {draftBudget >= BUDGET_MAX ? "No limit" : format(draftBudget)}
                </span>
              </div>
              <Slider
                className="mt-5"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={5000}
                value={[draftBudget]}
                onValueChange={([v]) => setDraftBudget(v)}
                onValueCommit={([v]) => onChange({ budget: v })}
              />
              <div className="tabular mt-2.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{format(BUDGET_MIN)}</span>
                <span>{format(BUDGET_MAX)}+</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Compares against the all-in per-traveller price including taxes and the
                flights &amp; permits component — not a stripped &ldquo;from&rdquo; figure.
              </p>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-2">
            <span className="tabular hidden text-xs text-muted-foreground sm:block">
              <strong className="font-semibold text-foreground">{resultCount}</strong> of {totalCount}
            </span>
            <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as Filters["sort"] })}>
              <SelectTrigger className="h-10 w-[170px] rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {SORTS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {active > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {filters.q && <Chip label={`“${filters.q}”`} onClear={() => onChange({ q: "" })} />}
            {filters.region !== "all" && (
              <Chip label={REGION_LABEL[filters.region]} onClear={() => onChange({ region: "all" })} />
            )}
            {filters.type !== "all" && (
              <Chip label={TRIP_TYPE_LABEL[filters.type]} onClear={() => onChange({ type: "all" })} />
            )}
            {filters.duration !== "any" && (
              <Chip
                label={DURATIONS.find((d) => d.id === filters.duration)!.label}
                onClear={() => onChange({ duration: "any" })}
              />
            )}
            {filters.month >= 0 && (
              <Chip label={`Departing ${MONTHS[filters.month]}`} onClear={() => onChange({ month: -1 })} />
            )}
            {filters.budget < BUDGET_MAX && (
              <Chip
                label={`Under ${format(filters.budget)}`}
                onClear={() => onChange({ budget: DEFAULT_FILTERS.budget })}
              />
            )}
            <button
              onClick={onReset}
              className="ml-1 text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Control({
  value,
  onValueChange,
  width,
  active,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  width: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-10 rounded-lg text-sm",
          width,
          active && "border-gold bg-gold-soft/50"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold-soft/50 py-1 pr-1.5 pl-2.5 text-xs font-medium">
      {label}
      <button onClick={onClear} aria-label={`Remove ${label} filter`} className="text-muted-foreground hover:text-foreground">
        <X className="size-3" />
      </button>
    </span>
  );
}
