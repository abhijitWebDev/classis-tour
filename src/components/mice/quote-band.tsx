import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { photo } from "@/lib/images";

/**
 * Closing band. Replaces the old pricing chapter — nothing on this site carries
 * a number any more, because every programme is quoted against a brief.
 */
export function QuoteBand() {
  return (
    <section className="relative flex min-h-[68vh] items-center overflow-hidden bg-ink">
      {/*
        The photograph carries this band now. At opacity-30 behind a near-solid
        gradient it was texture on a dark rectangle; at full strength under a
        weighted scrim it is the last picture on the page, which is what a
        closing CTA on a travel site should be.
      */}
      <div className="parallax-band absolute inset-0">
        <Photo
          src={photo("1526041092449-209d556f7a32", 2000)}
          fallbackSeed="classis-quote-band"
          alt=""
          drift
          className="absolute inset-0"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 via-45% to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

      <Reveal
        from="left"
        className="relative mx-auto w-full max-w-[1400px] px-5 py-24 lg:px-10 lg:py-28"
      >
        <span className="text-[11px] font-medium tracking-[0.24em] text-white/45 uppercase">
          Pricing
        </span>
        <h2 className="display mt-3 max-w-2xl text-[clamp(1.85rem,4vw,2.9rem)] leading-[1.08] text-white text-balance">
          Quoted against your brief, not off a rate card
        </h2>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">
          Delegate numbers, city, dates and standard move the cost more than anything a
          published price could tell you. Send the brief and we will come back with a
          proposal and a number.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild className="h-12 gap-2 rounded-full bg-white px-7 text-ink hover:bg-white/85">
            <Link href="/mice#brief">
              Request a proposal
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/about">About Classis</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
