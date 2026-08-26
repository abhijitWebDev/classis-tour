import { Bed, Sparkles, UtensilsCrossed } from "lucide-react";
import type { Package } from "@/lib/types";

export function ItineraryTimeline({ pkg }: { pkg: Package }) {
  return (
    <ol className="relative">
      {pkg.itinerary.map((day, i) => {
        const last = i === pkg.itinerary.length - 1;
        return (
          <li key={day.day} className="relative grid grid-cols-[auto_1fr] gap-x-5 sm:grid-cols-[76px_1fr] sm:gap-x-8">
            {/* rail */}
            <div className="relative flex flex-col items-center sm:items-start">
              <span className="tabular z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[13px] font-semibold sm:size-14 sm:text-sm">
                {String(day.day).padStart(2, "0")}
              </span>
              {!last && (
                <span
                  className="absolute top-11 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border sm:top-14 sm:left-7 sm:translate-x-0"
                  aria-hidden
                />
              )}
            </div>

            <div className={last ? "pb-2" : "pb-10"}>
              <span className="eyebrow">{day.place}</span>
              <h3 className="display mt-1.5 text-[clamp(1.25rem,2.4vw,1.65rem)] leading-tight">
                {day.title}
              </h3>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                {day.description}
              </p>

              {day.highlight && (
                <p className="mt-4 flex max-w-2xl gap-2.5 border-l-2 border-gold bg-gold-soft/35 px-4 py-3 text-[13px] leading-relaxed">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={1.8} />
                  {day.highlight}
                </p>
              )}

              <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Bed className="size-3.5" strokeWidth={1.6} />
                  <dt className="sr-only">Overnight</dt>
                  <dd>{day.stay}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="size-3.5" strokeWidth={1.6} />
                  <dt className="sr-only">Meals</dt>
                  <dd>{day.meals.length ? day.meals.join(" · ") : "No meals included"}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
