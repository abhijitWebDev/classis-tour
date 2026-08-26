import { Check, X } from "lucide-react";
import type { Package } from "@/lib/types";

export function Inclusions({ pkg }: { pkg: Package }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
      <div className="bg-card p-6 lg:p-8">
        <h3 className="display text-xl">What the price includes</h3>
        <ul className="mt-5 space-y-3">
          {pkg.inclusions.map((item) => (
            <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={2} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[color-mix(in_oklch,var(--card),var(--foreground)_3%)] p-6 lg:p-8">
        <h3 className="display text-xl">What it does not</h3>
        <ul className="mt-5 space-y-3">
          {pkg.exclusions.map((item) => (
            <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed text-muted-foreground">
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" strokeWidth={2} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
