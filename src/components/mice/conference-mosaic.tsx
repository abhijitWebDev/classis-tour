import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { CONFERENCE_DESTINATIONS } from "@/lib/mice";
import { cn } from "@/lib/utils";

/**
 * The centrepiece. Photography at full strength, text reduced to a city, a
 * country and one line that only appears on hover — an uneven mosaic rather
 * than a uniform grid, so the page reads as pictures first.
 */
export function ConferenceMosaic() {
  return (
    <Section id="destinations">
      <SectionHeader
        eyebrow="Where we run them"
        title="Cities that hold a conference properly"
        href="/mice"
        linkLabel="Talk to the events desk"
      />

      <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:grid-cols-4 lg:gap-4">
        {CONFERENCE_DESTINATIONS.map((d, i) => (
          <Reveal
            key={d.slug}
            delay={Math.min(i, 5) * 60}
            className={cn("h-full", d.span === "wide" && "lg:col-span-2")}
          >
            <Link
              href="/mice#brief"
              className="group relative block h-full overflow-hidden rounded-lg ring-1 ring-transparent transition-shadow duration-500 hover:ring-gold/60 hover:shadow-[0_30px_60px_-38px_rgba(0,0,0,0.85)]"
            >
              <PhotoFrame className="absolute inset-0">
                <Photo
                  src={d.image}
                  fallbackSeed={d.slug}
                  alt={`${d.city}, ${d.country}`}
                  loading={i < 3 ? "eager" : "lazy"}
                  className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.08]"
                />
              </PhotoFrame>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/88" />

              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                <p className="text-[10px] font-medium tracking-[0.22em] text-gold uppercase">
                  {d.country}
                </p>
                <h3 className="display mt-1.5 text-[24px] leading-none text-white lg:text-[30px]">
                  {d.city}
                </h3>
                <span className="rule-draw mt-3 block h-px w-10" />
                <p className="mt-0 max-h-0 overflow-hidden text-[12.5px] leading-snug text-white/85 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-20 group-hover:opacity-100">
                  {d.note}
                </p>
              </div>

              <span className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <ArrowUpRight className="size-4 text-white" strokeWidth={1.8} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
