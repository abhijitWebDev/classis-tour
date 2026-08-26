import Link from "next/link";
import { Photo, PhotoFrame } from "@/components/site/photo";
import { Stars } from "@/components/site/stars";
import { PACKAGES } from "@/lib/data";
import type { Review } from "@/lib/types";

/** The card shell again, with a photograph the traveller took in the frame. */
export function ReviewCard({ review }: { review: Review }) {
  const pkg = PACKAGES.find((p) => p.slug === review.packageSlug);

  return (
    <article className="group h-full relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-[0_24px_50px_-32px_rgba(0,0,0,0.5)]">
      {review.photos[0] && (
        <PhotoFrame className="aspect-[4/3]">
          <Photo
            src={review.photos[0]}
            fallbackSeed={review.id}
            alt=""
            className="transition-transform duration-[1200ms] group-hover:scale-[1.05]"
          />
        </PhotoFrame>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Stars value={review.rating} />
          <span className="tabular text-[11px] text-muted-foreground">{review.travelledOn}</span>
        </div>

        <h3 className="display mt-3 text-[19px] leading-snug text-balance">{review.title}</h3>
        <p className="mt-2.5 line-clamp-4 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {review.body}
        </p>

        <div className="mt-5 border-t border-border pt-4">
          <span className="block text-[13px] font-medium">{review.author}</span>
          {pkg && (
            <Link
              href={`/packages/${pkg.slug}`}
              className="mt-0.5 block text-[11px] text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
            >
              {pkg.name}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
