import { COMPANY } from "@/lib/company";

/**
 * Text-forward opener. No hero photograph on purpose — this is the page where
 * the company speaks plainly, and a full-bleed plate would make it read like
 * another destination chapter.
 */
export function AboutMasthead() {
  return (
    <section className="border-b border-border bg-[color-mix(in_oklab,var(--background),var(--foreground)_3%)]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
        <span className="eyebrow">{COMPANY.headquarters}</span>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05]">
          {COMPANY.legalName}
        </h1>
        <div className="mt-8 h-px w-24 rule-gold" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <p className="display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.35] text-balance">
            {COMPANY.lede}
          </p>
          <div className="space-y-5">
            {COMPANY.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
