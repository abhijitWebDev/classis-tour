import { ReviewCard } from "@/components/site/review-card";
import { CardGrid, Section, SectionHeader } from "@/components/site/section";
import { REVIEWS } from "@/lib/data";

const FEATURED = ["r4", "r1", "r7", "r3"];

export function ReviewPreview() {
  const featured = FEATURED.map((id) => REVIEWS.find((r) => r.id === id)!).filter(Boolean);

  return (
    <Section tone="raised">
      <SectionHeader
        eyebrow="Reviews"
        title="982 departures, reviewed"
        blurb="Filterable by region, kind of trip and journey — including the four-star ones, which are usually the most useful."
        href="/reviews"
        linkLabel="Filter every review"
      />
      <CardGrid>
        {featured.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </CardGrid>
    </Section>
  );
}
