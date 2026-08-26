"use client";

import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/search/package-card";
import { PACKAGES } from "@/lib/packages";
import { useCurrency, useTrips } from "@/lib/store";
import { fromPriceINR } from "@/lib/pricing";

export function SavedView() {
  const { saved, ready } = useTrips();
  const { format } = useCurrency();

  if (!ready) return <div className="h-[40vh]" />;

  const items = saved
    .map((slug) => PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is (typeof PACKAGES)[number] => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <HeartCrack className="mx-auto size-9 text-gold" strokeWidth={1} />
        <h2 className="display mt-6 text-3xl">Nothing saved yet</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Luxury travel is rarely decided in one sitting. Tap the heart on any journey and
          it waits here — on this device — until you come back to it.
        </p>
        <Button asChild className="mt-8 h-11 rounded-full px-6">
          <Link href="/packages">Start browsing</Link>
        </Button>
      </div>
    );
  }

  const cheapest = Math.min(...items.map(fromPriceINR));
  const nights = items.reduce((s, p) => s + p.nights, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 lg:px-10">
      <dl className="tabular flex flex-wrap gap-x-10 gap-y-4 border-b border-border pb-6">
        <Stat label="Saved" value={String(items.length)} />
        <Stat label="Nights in total" value={String(nights)} />
        <Stat label="Lowest all-in" value={format(cheapest)} />
        <Stat
          label="Regions"
          value={String(new Set(items.map((p) => p.region)).size)}
        />
      </dl>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} month={-1} />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-card p-6 lg:p-8">
        <h2 className="display text-2xl">Can&rsquo;t choose?</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Put two or three of these side by side and price them for the same party in the
          same month. It usually settles the argument in about a minute.
        </p>
        <Button asChild variant="outline" className="mt-6 h-10 rounded-full px-5">
          <Link href="/compare">Open the comparison</Link>
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{label}</dt>
      <dd className="display mt-1 text-2xl">{value}</dd>
    </div>
  );
}
