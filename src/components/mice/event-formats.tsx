import Link from "next/link";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { EVENT_FORMATS } from "@/lib/mice";
import { cn } from "@/lib/utils";

/**
 * What we run. Six formats in a mosaic rather than a 3×2 grid of equal plates.
 *
 * The cells are deliberately unequal: conferences take a 2×2 because it is the
 * business, and the type scales with the cell so the size difference reads as
 * emphasis rather than as a grid with a hole in it. The asymmetry only applies
 * from `lg` — below that an uneven mosaic just looks broken, so it falls back
 * to an even two-up.
 *
 * Layout at four columns, three rows of 190px:
 *   ┌─────────┬────┬────┐   row 1: [ 0 0 ][  1  1  ]
 *   │    0    │  1 │  1 │   row 2: [ 0 0 ][ 2 ][ 3 ]
 *   │    0    ├────┼────┤   row 3: [ 4 4 ][  5  5  ]
 *   ├────┬────┼────┴────┤
 *   │  4 │  4 │  5    5 │
 *   └────┴────┴─────────┘
 */
const SPAN = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-2",
];

export function EventFormats() {
  return (
    <Section>
      <SectionHeader
        eyebrow="What we run"
        title="Six formats, one operations team"
        href="/mice"
        linkLabel="See the MICE desk"
      />

      <div className="mt-10 grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-4">
        {EVENT_FORMATS.map((f, i) => {
          const feature = i === 0;
          return (
            <Reveal
              key={f.slug}
              delay={Math.min(i, 4) * 70}
              from="scale"
              className={cn("h-full", SPAN[i])}
            >
              <Link
                href="/mice#brief"
                className="group relative block h-full overflow-hidden rounded-lg ring-1 ring-transparent transition-shadow duration-500 hover:ring-gold/60 hover:shadow-[0_30px_60px_-38px_rgba(0,0,0,0.85)]"
              >
                <PhotoFrame className="absolute inset-0">
                  <Photo
                    src={f.image}
                    fallbackSeed={f.slug}
                    alt={f.label}
                    className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
                  />
                </PhotoFrame>
                <div className="scrim-bottom absolute inset-0" />
                <div className={cn("absolute inset-x-0 bottom-0 p-5", feature && "lg:p-7")}>
                  <h3
                    className={cn(
                      "display leading-tight text-white",
                      feature ? "text-[24px] lg:text-[34px]" : "text-[21px]"
                    )}
                  >
                    {f.label}
                  </h3>
                  <span className="rule-draw mt-2.5 block h-px w-10" />
                  <p
                    className={cn(
                      "mt-2.5 leading-snug text-white/75",
                      feature ? "text-[13px] lg:max-w-sm lg:text-[14px]" : "text-[12.5px]"
                    )}
                  >
                    {f.note}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
