"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { Stars } from "@/components/site/stars";
import { PACKAGES, REVIEWS } from "@/lib/data";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The quotes that rotate in the lead slot, in order. */
const LEAD_ROTATION = ["r1", "r6", "r9"];
const SUPPORTING = ["r4", "r7", "r3"];

/**
 * Reviews, opened by one traveller at full voice.
 *
 * This was a fifth consecutive header-then-four-across-photo-cards band, which
 * is where the page went flat. A review is testimony — it should sound like a
 * person, and at 13px in a 4-up grid it sounds like a product feature. One
 * quote set at display size does the persuading; the other three sit under it
 * as text only, so the band changes shape twice and never reaches for a photo.
 */
export function ReviewPreview() {
  const rotation = LEAD_ROTATION.map((id) => REVIEWS.find((r) => r.id === id)).filter(
    (r): r is Review => Boolean(r)
  );
  const supporting = SUPPORTING.map((id) => REVIEWS.find((r) => r.id === id)).filter(
    (r): r is Review => Boolean(r)
  );

  const [index, setIndex] = useRotation(rotation.length);
  const lead = rotation[index];

  if (!lead) return null;

  return (
    <Section tone="raised">
      <Reveal from="scale" className="max-w-4xl">
        <span className="flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
          <span className="h-px w-7 bg-gold" />
          Reviews
        </span>

        {/*
          Fixed minimum heights on both the quote and the body: without them the
          band jolts every eight seconds as a shorter review swaps in, which
          reads as a bug rather than as a carousel.
        */}
        <blockquote key={lead.id} className="rise mt-7">
          <p className="display min-h-[2.24em] text-[clamp(1.7rem,3.9vw,3rem)] leading-[1.12] text-balance">
            &ldquo;{lead.title}&rdquo;
          </p>
          <p className="mt-6 min-h-[4.9em] max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
            {lead.body}
          </p>
          <footer className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Stars value={lead.rating} />
            <span className="text-[13.5px] font-medium">{lead.author}</span>
            <Attribution review={lead} />
          </footer>
        </blockquote>

        <div className="mt-8 flex items-center gap-2.5">
          {rotation.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review from ${r.author}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none",
                i === index ? "w-8 bg-gold" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              )}
            />
          ))}
        </div>
      </Reveal>

      <Reveal delay={90}>
        <hr className="mt-14 border-border" />
      </Reveal>

      <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {supporting.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i, 4) * 70}>
            <article>
              <Stars value={r.rating} />
              {/* Two lines reserved (2.75em == 2 × leading-snug) so the bodies
                  and bylines below sit on one baseline across the three. */}
              <h3 className="display mt-3 line-clamp-2 min-h-[2.75em] text-[18px] leading-snug text-balance">
                &ldquo;{r.title}&rdquo;
              </h3>
              <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                {r.body}
              </p>
              <p className="mt-3.5 text-[12.5px] font-medium">{r.author}</p>
              <Attribution review={r} className="mt-0.5 block" />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="tabular text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">982 departures</span> reviewed —
            filterable by region, kind of trip and journey, including the four-star ones.
          </p>
          <Link
            href="/reviews"
            className="group inline-flex shrink-0 flex-col text-sm font-medium transition-colors hover:text-gold"
          >
            <span className="inline-flex items-center gap-1.5">
              Filter every review
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="rule-draw mt-1 h-px w-full" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

/**
 * Advances the lead quote on a timer, and stops for good the moment someone
 * picks a dot themselves — a carousel that keeps moving after you have chosen
 * a slide is fighting the reader. Also stays put for reduced-motion, and while
 * the tab is hidden, so you never return to a quote three rotations along.
 */
function useRotation(count: number): [number, (i: number) => void] {
  const [index, setIndex] = React.useState(0);
  // A ref, not state: picking a dot must stop the timer without re-running the
  // effect that owns it, and it is never read during render.
  const pinned = React.useRef(false);

  React.useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (document.hidden || pinned.current) return;
      setIndex((i) => (i + 1) % count);
    }, 8000);
    return () => clearInterval(id);
  }, [count]);

  const pick = React.useCallback((i: number) => {
    pinned.current = true;
    setIndex(i);
  }, []);

  return [index, pick];
}

function Attribution({ review, className }: { review: Review; className?: string }) {
  const pkg = PACKAGES.find((p) => p.slug === review.packageSlug);
  if (!pkg) return null;
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={`text-[12.5px] text-muted-foreground underline-offset-4 hover:text-gold hover:underline ${className ?? ""}`}
    >
      {pkg.name} · {review.travelledOn}
    </Link>
  );
}
