import Link from "next/link";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Section, SectionHeader } from "@/components/site/section";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import type { DeskConfig } from "@/lib/enquiry";

/**
 * Shared shell for the two B2B desks. Same container, header pattern and rhythm
 * as the rest of the site — these pages read as part of the same product, not a
 * bolted-on microsite.
 */
export function DeskPage({ desk, image }: { desk: DeskConfig; image: string }) {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <section className="border-b border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <span className="eyebrow">{desk.eyebrow}</span>
              <h1 className="display mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] text-balance">
                {desk.title}
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {desk.lede}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-full px-6">
                  <Link href="#brief">Send us a brief</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-full px-6">
                  <Link href="/about">About {COMPANY.shortName}</Link>
                </Button>
              </div>
            </div>
            <PhotoFrame className="aspect-[4/3] rounded-xl">
              <Photo src={image} fallbackSeed={desk.id} alt="" />
            </PhotoFrame>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader eyebrow="What we handle" title="Four things, taken off your desk" />
        <ul className="mt-12 border-t border-border">
          {desk.services.map((s) => (
            <li
              key={s.index}
              className="grid gap-4 border-b border-border py-8 sm:grid-cols-[auto_1fr] sm:gap-10 lg:grid-cols-[auto_0.9fr_1.3fr] lg:py-10"
            >
              <span className="tabular text-[13px] tracking-[0.2em] text-gold">{s.index}</span>
              <h3 className="display text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight text-balance">
                {s.title}
              </h3>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground lg:pt-1">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="brief" tone="raised">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Start here"
              title="A brief, not a contact form"
              blurb="Corporate and event work is quoted against a brief, so this asks the questions we would ask on the first call. It does not go into the same inbox as a holiday enquiry."
            />
            <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">
              {COMPANY.legalName} · {COMPANY.headquarters}
            </p>
          </div>
          <EnquiryForm desk={desk} />
        </div>
      </Section>
    </div>
  );
}
