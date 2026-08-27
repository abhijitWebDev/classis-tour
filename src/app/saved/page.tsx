import type { Metadata } from "next";
import { SavedView } from "@/components/site/saved-view";

export const metadata: Metadata = {
  title: "Saved trips",
  description: "The journeys you have set aside, kept on this device.",
};

export default function SavedPage() {
  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="border-b border-border bg-[color-mix(in_oklab,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
          <span className="eyebrow">Kept for later</span>
          <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">Your saved trips</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Stored in this browser, not on our servers. Nothing to sign into, and nothing
            of yours leaves the device.
          </p>
        </div>
      </div>
      <div className="pt-8">
        <SavedView />
      </div>
    </div>
  );
}
