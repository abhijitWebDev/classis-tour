import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { HeroSearch } from "@/components/search/hero-search";
import { photo } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative min-h-[92vh] w-full overflow-hidden bg-ink">
        <Photo
          src={photo("1506905925346-21bda4d32df4", 2400)}
          fallbackSeed="classis-hero"
          loading="eager"
          drift
          className="absolute inset-0"
          alt="A high-altitude lake at first light in Ladakh"
        />
        <div className="absolute inset-0 scrim-bottom" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-end px-5 pt-32 pb-44 lg:px-10">
          <span className="text-[11px] font-medium tracking-[0.34em] text-white/70 uppercase">
            Classis Tour · Est. 2009
          </span>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.75rem,7.5vw,6rem)] text-white">
            Nine journeys,
            <br />
            planned to the hour
            <br />
            <span className="italic text-gold">and paced to the day.</span>
          </h1>
          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-white/80">
            We are not an inventory. Each of these is a route we have walked, a household
            we know and a season we watch — priced honestly, bookable in full, and yours to
            filter, compare and save.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/packages"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              <span className="border-b border-gold pb-1">Browse all nine journeys</span>
              <ArrowDown className="size-4 text-gold transition-transform group-hover:translate-y-0.5" />
            </Link>
            <p className="tabular text-xs text-white/55">
              4.8 average across 982 reviewed departures
            </p>
          </div>
        </div>
      </div>

      {/* The tool, overlapping the photograph — search is not buried below the fold. */}
      <div className="relative z-20 mx-auto -mt-28 max-w-[1400px] px-5 lg:px-10">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[11px] font-medium tracking-[0.24em] text-white/80 uppercase">
            Find your journey
          </span>
          <span className="hidden text-[11px] text-white/70 sm:block">
            Filter by region, trip type, length and budget
          </span>
        </div>
        <HeroSearch />
      </div>
    </section>
  );
}
