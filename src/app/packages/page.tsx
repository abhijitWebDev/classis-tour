import { Suspense } from "react";
import type { Metadata } from "next";
import { Browse } from "@/components/search/browse";

export const metadata: Metadata = {
  title: "All journeys",
  description:
    "Filter nine planned journeys by region, trip type, length, departure month and budget — with live all-in pricing.",
};

export default function PackagesPage() {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="border-b border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
          <span className="eyebrow">The catalogue</span>
          <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">Every journey we run</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Nine itineraries across seven regions. Every price below is the all-in
            per-traveller figure — taxes, permits and the flights component included —
            not a stripped headline number.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="h-[60vh]" />}>
        <Browse />
      </Suspense>
    </div>
  );
}
