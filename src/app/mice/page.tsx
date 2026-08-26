import type { Metadata } from "next";
import { DeskPage } from "@/components/enquiry/desk-page";
import { DESKS } from "@/lib/enquiry";
import { photo } from "@/lib/images";

export const metadata: Metadata = {
  title: "MICE & events",
  description:
    "Meetings, incentive travel, conferences and exhibitions — venue sourcing, delegate logistics, production and on-site management.",
};

export default function MicePage() {
  return <DeskPage desk={DESKS.mice} image={photo("1540575467063-178a50c2df87", 1400)} />;
}
