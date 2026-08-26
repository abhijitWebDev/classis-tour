import Link from "next/link";
import { EXPERTISE } from "@/lib/company";

/**
 * The four stated pillars as a numbered ledger — hairline rows, not a card
 * grid, so this section does not repeat the pattern used elsewhere on the site.
 */
export function Expertise() {
  return (
    <section id="expertise" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <span className="eyebrow">Core expertise</span>
          <h2 className="display mt-3 text-[clamp(1.85rem,4vw,2.75rem)]">
            Four things, done end to end
          </h2>
        </div>

        <ul className="mt-12 border-t border-border">
          {EXPERTISE.map((pillar) => (
            <li
              key={pillar.index}
              className="grid gap-4 border-b border-border py-8 sm:grid-cols-[auto_1fr] sm:gap-10 lg:grid-cols-[auto_0.9fr_1.3fr] lg:py-10"
            >
              <span className="tabular text-[13px] tracking-[0.2em] text-gold">
                {pillar.index}
              </span>
              <h3 className="display text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight text-balance">
                {pillar.title}
              </h3>
              <div className="lg:pt-1">
                <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
                {pillar.href && pillar.cta && (
                  <Link
                    href={pillar.href}
                    className="mt-4 inline-block text-[13px] font-medium underline-offset-4 hover:text-gold hover:underline"
                  >
                    {pillar.cta} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
