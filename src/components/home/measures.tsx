"use client";

import * as React from "react";
import { Building2, Globe, Plane, Presentation } from "lucide-react";
import { CAPABILITY_STRIP } from "@/lib/company";
import { PACKAGES } from "@/lib/data";
import { CLIENT_TYPES, CONFERENCE_DESTINATIONS, EVENT_FORMATS } from "@/lib/mice";

/**
 * The reward for the first scroll: four figures that count up as the band is
 * reached, on flat ink directly under the photographic hero.
 *
 * Every figure is derived from the catalogue on this site — cities we list,
 * formats we run, sectors we name, programmes we publish — so it cannot drift
 * from what the pages actually show, and nothing here is an achievement claim.
 * That distinction matters: see the note on CAPABILITY_STRIP in lib/company.ts.
 * "450 events delivered" would convert better and would be invented. If the
 * client supplies audited figures, add them here as literals with a source.
 */
/*
 * Icon, figure, label — three elements, nothing else. The sub-line each of
 * these used to carry ("Across eight countries", "Published and costed") was
 * the kind of copy that fills a band without adding to it; the icon says the
 * category faster than a sentence can.
 *
 * Line icons rather than the emoji the reference site uses: emoji render as a
 * different picture on every platform, sit at a different weight from the rest
 * of the page, and are read aloud by their unicode name mid-sentence.
 */
const MEASURES = [
  { icon: Globe, value: CONFERENCE_DESTINATIONS.length, label: "Conference cities" },
  { icon: Presentation, value: EVENT_FORMATS.length, label: "Event formats" },
  { icon: Building2, value: CLIENT_TYPES.length, label: "Client sectors" },
  { icon: Plane, value: PACKAGES.length, label: "Incentive programmes" },
];

export function Measures() {
  return (
    <section className="border-t border-transparent bg-ink py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <ul className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {MEASURES.map(({ icon: Icon, value, label }, i) => (
            <li
              key={label}
              className="flex flex-col items-center px-4 text-center lg:border-l lg:border-white/12 lg:first:border-l-0"
            >
              <Icon className="size-7 text-gold" strokeWidth={1.1} aria-hidden />
              <Counter value={value} delay={i * 110} />
              <span className="mt-3 text-[11px] font-medium tracking-[0.2em] text-white/55 uppercase">
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/*
          The capability facts used to sit inside the hero. They are credibility
          copy, not a cover, and moving them here is what let the hero become a
          picture — but they are still the answer to "who are you", so they stay
          directly under the figures rather than being dropped.
        */}
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-white/12 pt-7 text-[12.5px] text-white/55">
          {CAPABILITY_STRIP.map((fact, i) => (
            <li key={fact} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="hidden size-1 rounded-full bg-gold/50 sm:block" />}
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Counts from zero once, when it is first reached. Held at the final value for
 * anyone who has asked for reduced motion — a number that never arrives is
 * worse than one that never moved.
 */
function Counter({ value, delay }: { value: number; delay: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        node.textContent = "0";
        timer = setTimeout(() => {
          const start = performance.now();
          const duration = 1400;
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // easeOutQuart — fast off the mark, long settle. The settle is what
            // reads as deliberate rather than as a spinning odometer.
            const eased = 1 - Math.pow(1 - t, 4);
            node.textContent = String(Math.round(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      /*
       * Observe the figure itself, not the band, and require it to be properly
       * on screen. The band's top edge sits exactly at the fold under a 100svh
       * hero, so any positive rootMargin here fires the whole sequence during
       * page load and the reader scrolls down to four numbers that already
       * finished counting.
       */
      { threshold: 0.45 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      node.textContent = String(value);
    };
  }, [value, delay]);

  /*
   * The figure is written straight to the DOM by the loop above rather than
   * held in state: React renders the real number once — so it is correct in the
   * server HTML, with reduced motion, and with no JavaScript at all — and the
   * animation only ever mutates a text node React will not re-render.
   */
  return (
    <span
      ref={ref}
      className="display tabular mt-4 block text-[clamp(2.6rem,5vw,3.6rem)] leading-none text-gold"
    >
      {value}
    </span>
  );
}
