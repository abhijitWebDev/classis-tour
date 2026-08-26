import { DestinationCard } from "@/components/site/destination-card";
import { CardGrid, Section, SectionHeader } from "@/components/site/section";
import { DESTINATIONS } from "@/lib/data";

/** Same card, same grid — destinations are bookable, not decoration. */
export function DestinationIndex() {
  return (
    <Section id="destinations" tone="raised">
      <SectionHeader
        eyebrow="By destination"
        title="Nine places, and the reason for each"
        href="/packages"
        linkLabel="All destinations"
      />
      <CardGrid>
        {DESTINATIONS.slice(0, 8).map((d) => (
          <DestinationCard key={d.slug} destination={d} />
        ))}
      </CardGrid>
    </Section>
  );
}
