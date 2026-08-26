import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/site/photo";
import { photo } from "@/lib/images";

/** Closing statement — one wide plate, one paragraph, one way forward. */
export function Sustainability() {
  return (
    <section id="sustainability" className="scroll-mt-24 border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand lg:aspect-[5/4]">
            <Photo
              src={photo("1441974231531-c6227db76b6e", 1400)}
              fallbackSeed="classis-sustainability"
              alt="Forest canopy"
              className="size-full object-cover"
            />
          </div>
          <div>
            <Leaf className="size-5 text-gold" strokeWidth={1.4} />
            <span className="eyebrow mt-5 block">Sustainable tourism</span>
            <h2 className="display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] text-balance">
              Growth we can keep running
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Eco-tourism initiatives are integrated into how operations run day to day,
              not published as a policy and forgotten. Responsible travel is a condition
              of the way we grow, not a line in a brochure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-full px-6">
                <Link href="/packages">Browse the journeys</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-full px-6">
                <Link href="/#experiences">How we travel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
