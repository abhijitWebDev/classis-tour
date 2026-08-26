"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Footprints, Users } from "lucide-react";
import type { Package } from "@/lib/types";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { SaveButton } from "@/components/site/save-button";
import { CompareToggle } from "@/components/site/compare-toggle";
import { Stars } from "@/components/site/stars";
import { REGION_LABEL, TRIP_TYPE_LABEL } from "@/lib/data";
import { MONTHS_SHORT, SEASON_BAND_LABEL, seasonBand } from "@/lib/pricing";
import { displayPriceINR } from "@/lib/filters";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

const BAND_TONE: Record<string, string> = {
  value: "text-emerald-700 bg-emerald-50 border-emerald-200",
  shoulder: "text-amber-800 bg-amber-50 border-amber-200",
  peak: "text-rose-800 bg-rose-50 border-rose-200",
  closed: "text-muted-foreground bg-muted border-border",
};

export function PackageCard({ pkg, month }: { pkg: Package; month: number }) {
  const { format } = useCurrency();
  const price = displayPriceINR(pkg, month);
  const band = month >= 0 ? seasonBand(pkg.seasonality[month]) : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-[0_24px_50px_-32px_rgba(0,0,0,0.5)]">
      <PhotoFrame className="aspect-[4/3]">
        <Link href={`/packages/${pkg.slug}`} aria-label={pkg.name} className="block h-full">
          <Photo
            src={pkg.hero}
            fallbackSeed={pkg.slug}
            className="transition-transform duration-[1200ms] group-hover:scale-[1.05]"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <SaveButton slug={pkg.slug} tone="dark" />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
            {REGION_LABEL[pkg.region]}
          </span>
          {band && (
            <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold", BAND_TONE[band])}>
              {MONTHS_SHORT[month]} · {SEASON_BAND_LABEL[band]}
            </span>
          )}
        </div>
      </PhotoFrame>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="tabular text-[11px] font-medium tracking-wide text-muted-foreground">
            {pkg.destination}, {pkg.country}
          </span>
          <span className="flex items-center gap-1.5">
            <Stars value={pkg.rating} />
            <span className="tabular text-[11px] font-semibold">{pkg.rating.toFixed(1)}</span>
          </span>
        </div>

        <h3 className="display mt-2 text-[22px] leading-tight">
          <Link href={`/packages/${pkg.slug}`} className="after:absolute hover:text-gold">
            {pkg.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{pkg.tagline}</p>

        <dl className="tabular mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-[11px]">
          <Spec icon={<Clock className="size-3" />} label="Nights" value={String(pkg.nights)} />
          <Spec icon={<Footprints className="size-3" />} label="Pace" value={pkg.physicality} />
          <Spec icon={<Users className="size-3" />} label="Max group" value={String(pkg.groupSizeMax)} />
        </dl>

        <div className="mt-3 flex flex-wrap gap-1">
          {pkg.tripTypes.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-secondary-foreground">
              {TRIP_TYPE_LABEL[t]}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 pt-1">
          <div>
            <span className="block text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {month >= 0 ? `${MONTHS_SHORT[month]} · per traveller` : "From, per traveller"}
            </span>
            <span className="tabular display mt-0.5 block text-2xl">
              {price === null ? "—" : format(price)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {price === null ? "Not operating this month" : "All-in, incl. taxes & permits"}
            </span>
          </div>
          <CompareToggle slug={pkg.slug} />
        </div>

        <Link
          href={`/packages/${pkg.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline-offset-4 hover:text-gold hover:underline"
        >
          Itinerary, map &amp; price breakdown
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}
