import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { COMPANY, EXPERTISE } from "@/lib/company";

/**
 * The four pillars of the business. The leisure journeys above are only one of
 * them, so corporate and MICE get a route out of here rather than a mention.
 */
export function House() {
  return (
    <Section id="house" tone="raised">
      <SectionHeader
        eyebrow="What we do"
        title="The journeys are one of four things we do"
        blurb={`${COMPANY.legalName} is a travel management company headquartered in ${COMPANY.headquarters}. Alongside the leisure itineraries on this site we run corporate delegations, MICE programmes and high-profile events — the same operations team, the same standard of execution.`}
        href="/about"
        linkLabel="About Classis"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {EXPERTISE.map((pillar) => (
          <article
            key={pillar.index}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70"
          >
            <span className="tabular text-[12px] tracking-[0.2em] text-gold">{pillar.index}</span>
            <h3 className="display mt-4 text-[21px] leading-tight text-balance">{pillar.title}</h3>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
              {pillar.body}
            </p>
            {pillar.href && pillar.cta && (
              <Link
                href={pillar.href}
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 after:absolute after:inset-0 group-hover:text-gold group-hover:underline"
              >
                {pillar.cta}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
