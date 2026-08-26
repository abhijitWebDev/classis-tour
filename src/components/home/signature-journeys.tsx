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
        eyebrow="Our journeys"
        title="Four of the nine, with the numbers attached"
        blurb="Every price is per traveller, all-in, and moves with the month and the size of your party."
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
