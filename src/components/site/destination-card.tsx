import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { DESTINATIONS, PACKAGES, REGION_LABEL } from "@/lib/data";

type Destination = (typeof DESTINATIONS)[number];

/**
 * Same shell as PackageCard — photo frame, meta line, title, price, action. A
 * destination is a thing you can act on here, not decoration.
 */
export function DestinationCard({ destination }: { destination: Destination }) {
  const pkg = PACKAGES.find((p) => p.slug === destination.packageSlug);
  const href = pkg ? `/packages/${pkg.slug}` : `/packages?q=${encodeURIComponent(destination.name)}`;

  return (
    <article className="group h-full relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-[0_24px_50px_-32px_rgba(0,0,0,0.5)]">
      <PhotoFrame className="aspect-[4/3]">
        <Photo
          src={destination.image}
          fallbackSeed={destination.slug}
          alt={destination.name}
          className="transition-transform duration-[1200ms] group-hover:scale-[1.05]"
        />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
            {REGION_LABEL[destination.region]}
          </span>
        </div>
      </PhotoFrame>

      <div className="flex flex-1 flex-col p-5">
        <span className="tabular text-[11px] font-medium tracking-wide text-muted-foreground">
          {destination.country} · {destination.latitude}
        </span>
        <h3 className="display mt-2 text-[22px] leading-tight">
          <Link href={href} className="after:absolute after:inset-0 hover:text-gold">
            {destination.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {destination.note}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <span className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Pricing on request
          </span>
          <span className="tabular text-[11px] text-muted-foreground">
            {pkg ? `${pkg.nights} nights` : "—"}
          </span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 group-hover:text-gold group-hover:underline">
          See the journey
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
