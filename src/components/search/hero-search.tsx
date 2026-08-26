"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DESTINATIONS, TRIP_TYPES } from "@/lib/data";
import { MONTHS } from "@/lib/pricing";
import { BUDGET_MAX, serializeFilters, DEFAULT_FILTERS } from "@/lib/filters";
import { useCurrency } from "@/lib/store";

const BUDGET_STEPS = [125000, 200000, 300000, 500000];

/**
 * The tool, placed over the photograph rather than buried below it. Four
 * decisions — where, what kind, when, how much — then straight into results.
 */
export function HeroSearch() {
  const router = useRouter();
  const { format } = useCurrency();
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState("all");
  const [month, setMonth] = React.useState("-1");
  const [budget, setBudget] = React.useState(String(BUDGET_MAX));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = serializeFilters({
      ...DEFAULT_FILTERS,
      q,
      type: type as never,
      month: Number(month),
      budget: Number(budget),
    });
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-px overflow-hidden rounded-xl border border-border/80 bg-border/80 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.55)] sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
    >
      <Field label="Where to">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          list="ct-destinations"
          placeholder="Ladakh, Maldives, Peru…"
          className="h-7 w-full bg-transparent text-[15px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground/70"
        />
        <datalist id="ct-destinations">
          {DESTINATIONS.map((d) => (
            <option key={d.slug} value={d.name} />
          ))}
        </datalist>
      </Field>

      <Field label="Kind of trip">
        <BareSelect value={type} onValueChange={setType} placeholder="Any">
          <SelectItem value="all">Any</SelectItem>
          {TRIP_TYPES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </BareSelect>
      </Field>

      <Field label="When">
        <BareSelect value={month} onValueChange={setMonth} placeholder="Any month">
          <SelectItem value="-1">Any month</SelectItem>
          {MONTHS.map((m, i) => (
            <SelectItem key={m} value={String(i)}>
              {m}
            </SelectItem>
          ))}
        </BareSelect>
      </Field>

      <Field label="Budget per person">
        <BareSelect value={budget} onValueChange={setBudget} placeholder="Any">
          {BUDGET_STEPS.map((b) => (
            <SelectItem key={b} value={String(b)}>
              {b === BUDGET_MAX ? "Any budget" : `Up to ${format(b)}`}
            </SelectItem>
          ))}
        </BareSelect>
      </Field>

      <div className="flex bg-background p-2">
        <Button
          type="submit"
          className="h-full min-h-12 w-full gap-2 rounded-lg px-6 text-sm lg:w-auto"
        >
          <Search className="size-4" strokeWidth={1.8} />
          Search journeys
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col justify-center gap-1 bg-background px-4 py-3">
      <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function BareSelect({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-7 w-full border-0 bg-transparent px-0 text-[15px] font-medium shadow-none focus-visible:ring-0 dark:bg-transparent">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
