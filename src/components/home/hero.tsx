import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { photo } from "@/lib/images";
import { CAPABILITY_STRIP } from "@/lib/company";

const HERO_ID = "1511578314322-379afb476865";
const HERO_SRC = photo(HERO_ID, 1920);
/** 48px wide. Arrives in one packet and is blurred up, so the fold is never flat black. */
const HERO_LQIP = photo(HERO_ID, 48);

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
        alt="A conference hall set for a plenary, screens up and tables laid"
      />

      {/*
        Scrims are weighted left, where the type sits, and released across the
        right so the hall stays bright. Hero photography must have no legible
        third-party event branding in it — on a real company's homepage that
        reads as a claim about whose event it was.
      */}
      <div className="absolute inset-0 scrim-bottom" />
      {/* The hall floor is pale; the standfirst, buttons and capability strip all
          sit over it and need their own ground. */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/92 via-black/62 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/22 via-42% to-transparent" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(125%_90%_at_62%_38%,transparent_50%,rgba(0,0,0,0.32)_100%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pt-32 pb-14 lg:px-10 lg:pb-16">
        <span
          className="rise flex items-center gap-3 text-[11px] font-medium tracking-[0.34em] text-white/70 uppercase"
          style={{ animationDelay: "120ms" }}
        >
          <span className="h-px w-8 bg-gold" />
          Mumbai · MICE, corporate travel &amp; events
        </span>

        <h1
          className="rise display mt-7 max-w-4xl text-[clamp(3rem,8vw,6.5rem)] leading-[0.94] text-white"
          style={{ animationDelay: "240ms" }}
        >
          We run the room.
          <br />
          <span className="text-gold italic">You run the agenda.</span>
        </h1>

        <p
          className="rise mt-8 max-w-lg text-[15.5px] leading-relaxed text-white/80"
          style={{ animationDelay: "400ms" }}
        >
          Conferences, seminars and incentive programmes for companies and hospitals —
          planned, contracted and staffed end to end.
        </p>

        <div
          className="rise mt-10 flex flex-wrap items-center gap-3"
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

        {/* Capability strip — the credibility line, without inventing numbers. */}
        <ul
          className="rise mt-14 grid gap-x-8 gap-y-5 border-t border-white/15 pt-7 sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: "660ms" }}
        >
          {CAPABILITY_STRIP.map((item) => (
            <li key={item.label}>
              <span className="block text-[13px] leading-snug font-medium text-white text-balance">
                {item.label}
              </span>
              <span className="mt-1 block text-[11px] tracking-wide text-white/50">
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
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
