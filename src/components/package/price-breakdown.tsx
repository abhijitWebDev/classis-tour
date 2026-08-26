"use client";

import * as React from "react";
import type { Quote } from "@/lib/pricing";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PriceBreakdown({
  quote,
  compact = false,
}: {
  quote: Quote;
  compact?: boolean;
}) {
  const { format } = useCurrency();

  return (
    <div>
      <ul className={cn("divide-y divide-border/70", compact ? "text-[12.5px]" : "text-[13px]")}>
        {quote.lines.map((line) => (
          <li key={line.id} className="flex items-start justify-between gap-4 py-2.5">
            <span className="min-w-0">
              <span
                className={cn(
                  "block leading-snug",
                  line.kind === "saving" && "text-emerald-700",
                  line.kind === "tax" && "text-muted-foreground"
                )}
              >
                {line.label}
              </span>
              {line.detail && (
                <span className="tabular mt-0.5 block text-[11px] text-muted-foreground">
                  {line.detail.map((part, i) =>
                    typeof part === "string" ? (
                      <React.Fragment key={i}>{part}</React.Fragment>
                    ) : (
                      <React.Fragment key={i}>{format(part.money)}</React.Fragment>
                    )
                  )}
                </span>
              )}
            </span>
            <span
              className={cn(
                "tabular shrink-0 font-medium",
                line.amount < 0 && "text-emerald-700"
              )}
            >
              {line.amount < 0 ? `− ${format(Math.abs(line.amount))}` : format(line.amount)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-end justify-between border-t-2 border-foreground/80 pt-3">
        <div>
          <span className="eyebrow">Total for {quote.travellers} travellers</span>
          <span className="tabular mt-1 block text-[11px] text-muted-foreground">
            {format(quote.perTraveller)} per traveller
          </span>
        </div>
        <span className="tabular display text-[clamp(1.75rem,4vw,2.25rem)] leading-none">
          {format(quote.total)}
        </span>
      </div>

    </div>
  );
}
