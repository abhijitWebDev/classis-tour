"use client";

import { Check, Scale } from "lucide-react";
import { useTrips, COMPARE_LIMIT } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CompareToggle({ slug, className }: { slug: string; className?: string }) {
  const { isComparing, toggleCompare, compare, ready } = useTrips();
  const on = ready && isComparing(slug);
  const willReplace = ready && !on && compare.length >= COMPARE_LIMIT;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(slug);
      }}
      aria-pressed={on}
      title={
        willReplace
          ? `Comparison holds ${COMPARE_LIMIT} — this replaces the oldest`
          : "Add to comparison"
      }
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors",
        on
          ? "border-gold bg-gold-soft text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-gold hover:text-foreground",
        className
      )}
    >
      {on ? <Check className="size-3.5" strokeWidth={2} /> : <Scale className="size-3.5" strokeWidth={1.6} />}
      {on ? "Comparing" : "Compare"}
    </button>
  );
}
