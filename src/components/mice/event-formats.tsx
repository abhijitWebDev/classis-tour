import Link from "next/link";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/section";
import { EVENT_FORMATS } from "@/lib/mice";

/** What we run. Photograph, name, one line — nothing else. */
export function EventFormats() {
  return (
    <Section>
      <SectionHeader
        eyebrow="What we run"
        title="Six formats, one operations team"
        href="/mice"
        linkLabel="See the MICE desk"
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EVENT_FORMATS.map((f, i) => (
          <Reveal key={f.slug} delay={Math.min(i, 3) * 70}>
            <Link
              href="/mice#brief"
              className="group relative block overflow-hidden rounded-lg ring-1 ring-transparent transition-shadow duration-500 hover:ring-gold/60 hover:shadow-[0_30px_60px_-38px_rgba(0,0,0,0.85)]"
            >
              <PhotoFrame className="aspect-[16/10]">
                <Photo
                  src={f.image}
                  fallbackSeed={f.slug}
                  alt={f.label}
                  className="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
                />
              </PhotoFrame>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="display text-[22px] leading-tight text-white">{f.label}</h3>
                <span className="rule-draw mt-2.5 block h-px w-10" />
                <p className="mt-2.5 text-[12.5px] leading-snug text-white/75">{f.note}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
