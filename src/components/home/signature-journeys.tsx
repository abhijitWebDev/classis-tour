"use client";

import { PackageCard } from "@/components/search/package-card";
import { CardGrid, Section, SectionHeader } from "@/components/site/section";
import { PACKAGES } from "@/lib/data";

const FEATURED = [
  "ladakh-high-passes",
  "maldives-atoll-solitude",
  "kenya-mara-migration",
  "peru-sacred-valley",
];

/** The catalogue register: the site's one card, in the site's one grid. */
export function SignatureJourneys() {
  const featured = FEATURED.map((s) => PACKAGES.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <Section>
      <SectionHeader
        eyebrow="Incentive travel"
        title="Programmes people compete to be sent on"
        blurb="The same planning we apply to a conference, applied to a reward trip. Quoted per group, against your brief."
        href="/packages"
        linkLabel="See all nine"
      />
      <CardGrid>
        {featured.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} month={-1} />
        ))}
      </CardGrid>
    </Section>
  );
}
