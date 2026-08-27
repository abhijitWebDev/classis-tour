import { Hero } from "@/components/home/hero";
import { Measures } from "@/components/home/measures";
import { ConferenceMosaic } from "@/components/mice/conference-mosaic";
import { EventFormats } from "@/components/mice/event-formats";
import { ClientTypes } from "@/components/mice/client-types";
import { SignatureJourneys } from "@/components/home/signature-journeys";
import { ReviewPreview } from "@/components/home/review-preview";
import { GalleryStrip } from "@/components/home/gallery-strip";
import { QuoteBand } from "@/components/mice/quote-band";

/**
 * Band order is the page's rhythm, so it is a design decision, not an import
 * list. Reading down: photograph, then the figures that reward the first
 * scroll, then a rail, a mosaic, a short dark measure, the register, a voice,
 * an edge-to-edge strip, and the ask. No two adjacent bands share a shape.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Measures />
      <ConferenceMosaic />
      <EventFormats />
      <ClientTypes />
      <SignatureJourneys />
      <ReviewPreview />
      <GalleryStrip />
      <QuoteBand />
    </>
  );
}
