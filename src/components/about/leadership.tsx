import { COMPANY, LEADERSHIP } from "@/lib/company";

/**
 * Two large name plates on ink. Monogram discs rather than portraits — we have
 * no photography of either person, and a stock headshot would be a lie.
 */
export function Leadership() {
  return (
    <section
      id="leadership"
      className="scroll-mt-24 bg-ink py-20 text-[color:var(--shell)] lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium tracking-[0.24em] text-white/45 uppercase">
            Leadership
          </span>
          <h2 className="display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] text-white">
            The people the file sits with
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
          {LEADERSHIP.map((leader) => (
            <article key={leader.name} className="flex items-center gap-6 bg-ink p-8 lg:p-10">
              <span
                aria-hidden
                className="display flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/40 text-lg tracking-[0.08em] text-gold lg:size-20 lg:text-xl"
              >
                {leader.initials}
              </span>
              <div>
                <h3 className="display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight text-white text-balance">
                  {leader.name}
                </h3>
                <p className="mt-2 text-[11px] font-medium tracking-[0.24em] text-white/50 uppercase">
                  {leader.role}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/55">
          {COMPANY.shortName} is run by seasoned tourism professionals — the same team
          that quotes a trip stays on it through execution, which is why the
          communication stays responsive once a booking is live.
        </p>
      </div>
    </section>
  );
}
