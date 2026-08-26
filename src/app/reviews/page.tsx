import { Suspense } from "react";
import type { Metadata } from "next";
import { ReviewsView } from "@/components/reviews/reviews-view";

export const metadata: Metadata = {
  title: "Traveller reviews",
  description:
    "Filter reviews by region, kind of trip, journey and rating — with the photographs travellers actually took.",
};

export default function ReviewsPage() {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="border-b border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
          <span className="eyebrow">Afterwards</span>
          <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">Traveller reviews</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Filterable by region, kind of trip and journey — including the four-star ones,
            which are usually the most useful. Every review is from a completed departure.
          </p>
        </div>
      </div>
      <div className="pt-8">
        <Suspense fallback={<div className="h-[60vh]" />}>
          <ReviewsView />
        </Suspense>
      </div>
    </div>
  );
}
