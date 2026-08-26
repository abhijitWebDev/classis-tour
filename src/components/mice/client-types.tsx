import { Photo, PhotoFrame } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { CLIENT_TYPES } from "@/lib/mice";

/** Who books us. Four plates, four short lines. */
export function ClientTypes() {
  return (
    <Section tone="raised">
      <SectionHeader
        eyebrow="Who we work with"
        title="Companies and hospitals, mostly"
        href="/corporate"
        linkLabel="Corporate desk"
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CLIENT_TYPES.map((c, i) => (
          <Reveal key={c.slug} delay={Math.min(i, 3) * 70}>
            <article className="group">
              <PhotoFrame className="aspect-[4/3] rounded-lg ring-1 ring-transparent transition-shadow duration-500 group-hover:ring-gold/60">
                <Photo
                  src={c.image}
                  fallbackSeed={c.slug}
                  alt={c.label}
                  className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                />
              </PhotoFrame>
              <h3 className="display mt-5 text-[21px] leading-tight">{c.label}</h3>
              <span className="rule-draw mt-2.5 block h-px w-10" />
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.note}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
