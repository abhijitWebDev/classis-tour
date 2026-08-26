import type { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";

export const metadata: Metadata = {
  title: "Compare journeys",
  description: "Stack up to three journeys side by side — price, length, pace, route and inclusions, quoted for the same party.",
};

export default function ComparePage() {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="border-b border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
          <span className="eyebrow">Side by side</span>
          <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">Compare journeys</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Two brochures never quote the same thing. Here every column is the same party,
            the same month and the same room category — so the difference in the number is
            a real difference in the trip.
          </p>
        </div>
      </div>
      <div className="pt-8">
        <CompareView />
      </div>
    </div>
  );
}
