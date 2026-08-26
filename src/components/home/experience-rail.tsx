import { Photo } from "@/components/site/photo";
import { Section, SectionHeader } from "@/components/site/section";
import { EXPERIENCES } from "@/lib/data";

/**
 * The one editorial band on the page. Text-forward on ink, no cards and no
 * prices — this is the section that carries the tone, so everything either side
 * of it can stay in the catalogue register without the page feeling like a
 * spreadsheet. It uses the shared container and rhythm like every other band.
 */
export function ExperienceRail() {
  return (
    <Section id="experiences" tone="ink">
      <SectionHeader
        tone="dark"
        eyebrow="How we travel"
        title="Five things we do that cost us money"
        blurb="Every one of these makes an itinerary more expensive to run and harder to scale. They are also the entire difference between our trips and the ones sold by the page."
      />

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {EXPERIENCES.map((e) => (
          <li key={e.id} className="border-t border-white/15 pt-6">
            <div className="flex items-center justify-between">
              <span className="tabular text-[11px] tracking-[0.2em] text-gold">{e.index}</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
                {e.tag}
              </span>
            </div>
            <div className="mt-5 size-14 overflow-hidden rounded-full bg-white/10">
              <Photo src={e.thumb} fallbackSeed={e.id} alt="" className="size-14" />
            </div>
            <h3 className="display mt-5 text-[21px] leading-[1.15] text-white text-balance">
              {e.title}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/60">{e.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
