import type { Metadata } from "next";
import { AboutMasthead } from "@/components/about/masthead";
import { Expertise } from "@/components/about/expertise";
import { Leadership } from "@/components/about/leadership";
import { Sustainability } from "@/components/about/sustainability";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description: COMPANY.positioning,
};

export default function AboutPage() {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <AboutMasthead />
      <Expertise />
      <Leadership />
      <Sustainability />
    </div>
  );
}
