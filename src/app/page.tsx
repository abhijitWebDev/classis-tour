import { Hero } from "@/components/home/hero";
import { SignatureJourneys } from "@/components/home/signature-journeys";
import { DestinationIndex } from "@/components/home/destination-index";
import { ExperienceRail } from "@/components/home/experience-rail";
import { ReviewPreview } from "@/components/home/review-preview";
import { House } from "@/components/home/house";
import { PricePromise } from "@/components/home/price-promise";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureJourneys />
      <DestinationIndex />
      <ExperienceRail />
      <ReviewPreview />
      <House />
      <PricePromise />
    </>
  );
}
