import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { photo } from "@/lib/images";

/*
 * Golden-hour resort: the incentive-travel product, and the warmest frame in
 * the catalogue. It replaced a conference hall — technically the truest picture
 * of the business, but a cold, empty, white-walled room, which is a hard first
 * impression to love. This one still shows a *venue* (loungers, umbrellas, the
 * pool, the buildings behind) rather than an empty beach, so the page still
 * reads as "we take your people here" and not as a holiday brochure.
 *
 * Freed from the formats mosaic, which now carries the Amalfi frame instead —
 * no photograph appears twice on this page.
 */
const HERO_ID = "1596436889106-be35e843f974";
const HERO_SRC = photo(HERO_ID, 1920);
/** 48px wide. Arrives in one packet and is blurred up, so the fold is never flat black. */
const HERO_LQIP = photo(HERO_ID, 48);

/**
 * Ambient motes drifting up the frame. Fixed values, not `Math.random()`:
 * this renders on the server, and random values would differ on the client and
 * trip a hydration mismatch. Tuples are [left %, size px, duration s, delay s,
 * opacity]. Lanes are spread unevenly on purpose — an even distribution reads
 * as a grid of dots rather than as dust in a light beam.
 */
const MOTES: [number, number, number, number, number][] = [
  [4, 2, 19, 0, 0.35], [11, 3, 26, 6, 0.22], [17, 2, 22, 2.5, 0.4],
  [23, 1, 30, 9, 0.28], [29, 3, 17, 4, 0.3], [36, 2, 24, 12, 0.24],
  [41, 2, 28, 1.5, 0.36], [47, 1, 21, 7.5, 0.2], [53, 3, 25, 3, 0.32],
  [58, 2, 18, 10.5, 0.26], [64, 2, 31, 5, 0.22], [69, 3, 23, 13.5, 0.34],
  [74, 1, 27, 0.8, 0.24], [79, 2, 20, 8, 0.38], [83, 3, 29, 4.5, 0.2],
  [87, 2, 16, 11, 0.3], [91, 1, 24, 2, 0.26], [94, 2, 22, 14, 0.32],
  [8, 1, 33, 15.5, 0.18], [31, 2, 15, 16.5, 0.28], [61, 1, 34, 17, 0.2],
  [76, 2, 19, 18.5, 0.3],
];

/**
 * Picture first, and the one place on the site that animates on load: the
 * eyebrow, headline, standfirst and actions rise in sequence over a slow
 * ken-burns drift. Copy stays at four lines — the photograph does the work.
 */
export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      {/* React 19 hoists this to <head>, so the hero starts downloading with
          the document rather than after the stylesheet resolves. */}
      <link rel="preload" as="image" href={HERO_SRC} fetchPriority="high" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_LQIP}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
      />

      <Photo
        src={HERO_SRC}
        fallbackSeed="classis-mice-hero"
        loading="eager"
        fetchPriority="high"
        drift
        className="absolute inset-0"
        alt="A resort terrace at sunset — pool, loungers and palms under a gold sky"
      />

      {/*
        Hero photography must carry no legible third-party event branding — on a
        real company's homepage that reads as a claim about whose event it was.


        A centred headline needs a centred ground, so the old left-weighted
        wash is gone. This is a four-stop vertical scrim that deliberately
        *releases* through the middle of the frame — the sky and the water are
        the reason for the picture, and burying them under an even 50% tint to
        make type easy is how a hero stops being worth looking at.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.34)_24%,rgba(0,0,0,0.30)_48%,rgba(0,0,0,0.55)_78%,rgba(0,0,0,0.74)_100%)]" />
      {/*
        A centred column of shade under the copy. Averaged across the frame the
        type already cleared 7.9:1, but the umbrellas behind the standfirst hit
        rgb(231,231,231) — white on white, 1.2:1 — and an average is no use to
        the person reading the line that crosses one. This darkens only where
        the words are; the sky and the pool stay bright.
      */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(62%_46%_at_50%_46%,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.3)_55%,transparent_78%)]" />
      {/* Motes sit above the scrims and below the type. Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {MOTES.map(([left, size, duration, delay, opacity], i) => (
          <span
            key={i}
            className="animate-float absolute bottom-0 rounded-full bg-gold"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      {/*
        Centred, and vertically centred rather than bottom-anchored: the point
        of a cover is that the picture surrounds the words. Nothing else is
        allowed in here — the credibility facts moved to the band below, which
        is what lets the frame breathe.
      */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1080px] flex-col items-center justify-center px-5 py-32 text-center lg:px-10">
        <span
          className="rise inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/12 px-4 py-1.5 text-[10.5px] font-medium tracking-[0.28em] text-gold uppercase backdrop-blur-sm"
          style={{ animationDelay: "120ms" }}
        >
          <span className="relative flex size-1.5 shrink-0">
            <span className="animate-dot absolute inset-0 rounded-full bg-gold" />
            <span className="relative size-1.5 rounded-full bg-gold" />
          </span>
          Mumbai · MICE, corporate travel &amp; events
        </span>

        <h1
          className="rise display mt-8 text-[clamp(2.9rem,7.4vw,6rem)] leading-[0.96] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]"
          style={{ animationDelay: "240ms" }}
        >
          We run the room.
          <br />
          <span className="text-gold italic">You run the agenda.</span>
        </h1>

        <p
          className="rise mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-white/85 [text-shadow:0_1px_20px_rgba(0,0,0,0.45)]"
          style={{ animationDelay: "400ms" }}
        >
          Conferences, seminars and incentive programmes for companies and hospitals —
          planned, contracted and staffed end to end.
        </p>

        <div
          className="rise mt-11 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "520ms" }}
        >
          <Button
            asChild
            className="h-12 gap-2 rounded-full bg-white px-7 text-[14px] text-ink transition-transform hover:translate-y-[-1px] hover:bg-white"
          >
            <Link href="/mice#brief">
              Send us a brief
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-white/35 bg-white/5 px-7 text-[14px] text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
          >
            <Link href="/corporate">Corporate travel</Link>
          </Button>
        </div>

      </div>

      <span
        aria-hidden
        className="animate-cue pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/70 lg:block"
      >
        <ChevronDown className="size-5" strokeWidth={1.4} />
      </span>
    </section>
  );
}
