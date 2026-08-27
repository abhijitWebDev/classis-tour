import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { PACKAGES } from "@/lib/data";

/**
 * A true edge-to-edge strip, immediately before the closing CTA.
 *
 * No container, no card, no rounded corner, 2px gutters — after a page of
 * measured bands inside a 1400px column, running photography the full width of
 * the viewport is the loudest move available, and it costs one grid.
 *
 * Frames come off the journeys already published, so the strip can never show
 * a destination the catalogue doesn't sell.
 *
 * Specifically the *second* gallery frame of each, never the hero: the hero
 * already appears in the journeys grid and the destinations rail further up,
 * and repeating it here is how a catalogue of nine starts looking like a
 * catalogue of four. The second frame also carries a caption worth reading.
 */
const FRAMES = PACKAGES.map((p) => ({
  slug: p.slug,
  name: p.name,
  src: p.gallery[1]?.src ?? p.hero,
  caption: p.gallery[1]?.caption ?? p.destination,
})).slice(0, 6);

export function GalleryStrip() {
  return (
    <section className="border-t border-border bg-background pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
              <span className="h-px w-7 bg-gold" />
              On the ground
            </span>
            <h2 className="display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.1]">
              Where we have been working
            </h2>
          </div>
          <Link
            href="/packages"
            className="group inline-flex shrink-0 flex-col text-sm font-medium transition-colors hover:text-gold"
          >
            <span className="inline-flex items-center gap-1.5">
              Every journey
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="rule-draw mt-1 h-px w-full" />
          </Link>
        </Reveal>
      </div>

      <Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:grid-cols-6">
          {FRAMES.map((f) => (
            <li key={f.slug}>
              <Link href={`/packages/${f.slug}`} className="group relative block">
                <PhotoFrame className="aspect-square">
                  <Photo
                    src={f.src}
                    fallbackSeed={`${f.slug}-strip`}
                    alt={f.caption}
                    className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.09]"
                  />
                </PhotoFrame>
                <span className="absolute inset-0 flex items-end bg-ink/0 p-4 opacity-0 transition-all duration-400 group-hover:bg-ink/55 group-hover:opacity-100">
                  <span className="text-[12.5px] leading-snug font-medium text-white text-balance">
                    {f.caption}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
