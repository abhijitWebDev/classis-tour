import { Hero } from "@/components/home/hero";
import { ConferenceMosaic } from "@/components/mice/conference-mosaic";
import { EventFormats } from "@/components/mice/event-formats";
import { ClientTypes } from "@/components/mice/client-types";
import { SignatureJourneys } from "@/components/home/signature-journeys";
import { ReviewPreview } from "@/components/home/review-preview";
import { QuoteBand } from "@/components/mice/quote-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ConferenceMosaic />
      <EventFormats />
      <ClientTypes />
      <SignatureJourneys />
      <ReviewPreview />
      <QuoteBand />
    </>
  );
}
