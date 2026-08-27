import Link from "next/link";
import { REGIONS, TRIP_TYPES } from "@/lib/data";
import { COMPANY } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[color-mix(in_oklab,var(--background),var(--foreground)_3%)]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="display text-2xl tracking-[0.14em] uppercase">Classis</div>
            <div className="text-[10px] font-medium tracking-[0.42em] text-muted-foreground uppercase">
              Tour
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {COMPANY.positioning} Corporate and business travel, MICE and events,
              customised leisure, and sustainable tourism.
            </p>
            <div className="mt-6 h-px w-24 rule-gold" />
            {/* TODO: replace with the company's real published line and inbox before launch. */}
            <p className="tabular mt-6 text-sm text-muted-foreground">
              {COMPANY.headquarters}
              <br />
              journeys@classistour.com
            </p>
          </div>

          <FooterColumn
            title="By region"
            links={REGIONS.map((r) => ({
              href: `/packages?region=${r.id}`,
              label: r.label,
            }))}
          />
          <FooterColumn
            title="By kind of trip"
            links={TRIP_TYPES.map((t) => ({
              href: `/packages?type=${t.id}`,
              label: t.label,
            }))}
          />
          <FooterColumn
            title="For business"
            links={[
              { href: "/corporate", label: "Corporate travel" },
              { href: "/mice", label: "MICE & events" },
              { href: "/about#expertise", label: "Core expertise" },
              { href: "/about#leadership", label: "Leadership" },
              { href: "/about", label: "About Classis" },
            ]}
          />
          <FooterColumn
            title="Practical"
            links={[
              { href: "/packages", label: "All journeys" },
              { href: "/reviews", label: "Traveller reviews" },
              { href: "/saved", label: "Saved trips" },
              { href: "/compare", label: "Compare journeys" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
          <p className="tabular">
            Pricing is quoted against your brief. Nothing on this site carries a rate card.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
