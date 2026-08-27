import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { PointerGlow } from "@/components/site/pointer-glow";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { CONFERENCE_DESTINATIONS } from "@/lib/mice";

/**
 * The first band after the hero, and the page's one edge-to-edge moment.
 *
 * This was a four-column grid of twelve tiles: 1,366px tall, and — arriving
 * directly under a full-bleed hero — the first of five consecutive bands shaped
 * header-then-grid. As a rail it does the same job in half the height, and
 * running the plates off the right edge is what tells you the list continues.
 * The half-visible twelfth tile is the affordance; don't pad it to a round number.
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

      <Reveal from="right">
        {/*
          Negative inline margins cancel the container's own padding, then the
          same value is added back as scroll padding. The rail therefore runs to
          the container's edge — off the side of the screen on anything under
          1400px — while the first plate still starts on the headline's margin.
          Matching those two numbers is the whole trick; don't change one alone.
        */}
        <ul className="no-scrollbar -mx-5 mt-10 flex snap-x gap-3 overflow-x-auto scroll-smooth px-5 pb-2 lg:-mx-10 lg:gap-4 lg:px-10">
          {CONFERENCE_DESTINATIONS.map((d, i) => (
            <li
              key={d.slug}
              className="w-[248px] shrink-0 snap-start sm:w-[280px] lg:w-[320px]"
            >
              <Link
                href="/mice#brief"
                className="group relative block h-[340px] overflow-hidden rounded-lg ring-1 ring-transparent transition-shadow duration-500 hover:ring-gold/60 hover:shadow-[0_30px_60px_-38px_rgba(0,0,0,0.85)] lg:h-[400px]"
              >
                <PhotoFrame className="absolute inset-0">
                  <Photo
                    src={d.image}
                    fallbackSeed={d.slug}
                    alt={`${d.city}, ${d.country}`}
                    loading={i < 4 ? "eager" : "lazy"}
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.08]"
                  />
                </PhotoFrame>

                {/* Under the type, over the picture: warmth on the photograph,
                    not a wash across the words. */}
                <PointerGlow />

                {/*
                  The scrim rides on this block rather than on the plate. Across
                  a rail of twelve a full-height scrim turned a row of
                  photographs into a row of dark rectangles, and a fixed short
                  one loses the country label the moment the note opens and
                  lifts it clear. Sized by the block, it does both jobs.

                  pt-16 is structural, not spacing: it is the ramp the gradient
                  needs above the first line. Trim it and the label sits on the
                  transparent end of the gradient.
                */}
                <div className="scrim-plate absolute inset-x-0 bottom-0 px-5 pt-16 pb-5">
                  {/*
                    gold-soft, not gold. At 10px over a scrim that is only
                    partly opaque, the label's contrast is set by whatever
                    photograph is underneath: across the twelve plates the mid
                    gold ran from 5.8:1 down to 3.5:1 on the brightest frame.
                    The lighter token clears AA on all of them without darkening
                    the picture to get there.
                  */}
                  <p className="text-[10px] font-medium tracking-[0.22em] text-gold-soft uppercase">
                    {d.country}
                  </p>
                  <h3 className="display mt-1.5 text-[26px] leading-none text-white lg:text-[30px]">
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
            </li>
          ))}
        </ul>
      </Reveal>

      <p className="mt-5 text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
        {CONFERENCE_DESTINATIONS.length} cities · scroll for the rest
      </p>
    </Section>
  );
}
