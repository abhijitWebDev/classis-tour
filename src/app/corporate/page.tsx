import type { Metadata } from "next";
import { DeskPage } from "@/components/enquiry/desk-page";
import { DESKS } from "@/lib/enquiry";
import { photo } from "@/lib/images";

export const metadata: Metadata = {
  title: "Corporate travel",
  description:
    "Business delegations and corporate itineraries handled end to end — routing, accommodation, ground movement, rate management and duty of care.",
};

export default function CorporatePage() {
  return <DeskPage desk={DESKS.corporate} image={photo("1521737604893-d14cc237f11d", 1400)} />;
}
