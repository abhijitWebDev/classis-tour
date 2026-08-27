import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { CLIENT_TYPES } from "@/lib/mice";

/**
 * Who books us — the page's short dark punctuation.
 *
 * This was four photographic plates with captions. The photographs were the
 * weakest on the site (a stock open-plan office, a hospital reception desk) and
 * it was the third consecutive band shaped header-then-picture-grid. Set as a
 * dark measure it runs ~340px against neighbours of 700–1,050px, which is what
 * gives the page a beat; the client list is a fact, and facts read well as type.
 *
 * Keep it short. If this band grows a photograph or a fifth column it stops
 * being punctuation and the rhythm goes flat again.
 */
export function ClientTypes() {
  return (
    <Section tone="ink" size="compact">
      <SectionHeader
        eyebrow="Who we work with"
        title="Companies and hospitals, mostly"
        tone="dark"
      />

      <dl className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {CLIENT_TYPES.map((c, i) => (
          <Reveal
            key={c.slug}
            delay={Math.min(i, 4) * 70}
            className="relative lg:border-l lg:border-white/12 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
          >
            <span className="tabular block text-[11px] font-medium tracking-[0.2em] text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <dt className="display mt-3 text-[20px] leading-tight text-white">{c.label}</dt>
            <dd className="mt-2.5 text-[13px] leading-relaxed text-white/55">{c.note}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={140} className="mt-10">
        <Link
          href="/corporate"
          className="group inline-flex flex-col text-sm font-medium text-white/80 transition-colors hover:text-gold"
        >
          <span className="inline-flex items-center gap-1.5">
            Corporate desk
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="rule-draw mt-1 h-px w-full" />
        </Link>
      </Reveal>
    </Section>
  );
}
