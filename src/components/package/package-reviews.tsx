import Link from "next/link";
import type { Package } from "@/lib/types";
import { Photo } from "@/components/site/photo";
import { Stars } from "@/components/site/stars";
import { reviewsForPackage, TRIP_TYPE_LABEL } from "@/lib/data";

export function PackageReviews({ pkg }: { pkg: Package }) {
  const reviews = reviewsForPackage(pkg.slug);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Reviews</span>
          <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
            From people who went
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular display text-4xl">{pkg.rating.toFixed(1)}</span>
          <span className="text-[12px] text-muted-foreground">
            <Stars value={pkg.rating} size={13} />
            <span className="tabular mt-1 block">{pkg.reviewCount} verified reviews</span>
          </span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full border border-gold/50 bg-gold-soft/60 text-[11px] font-semibold">
                  {r.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{r.author}</span>
                  <span className="tabular block text-[11px] text-muted-foreground">
                    {TRIP_TYPE_LABEL[r.tripType]} · {r.travelledOn}
                  </span>
                </span>
                <Stars value={r.rating} />
              </div>
              <h3 className="mt-4 text-[14px] font-medium">{r.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.body}</p>
              {r.photos.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {r.photos.map((src, i) => (
                    <span key={src} className="size-16 overflow-hidden rounded-md bg-sand">
                      <Photo src={src} fallbackSeed={`${r.id}-${i}`} alt="" className="size-16" />
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          No written reviews for this departure yet.
        </p>
      )}

      <Link
        href={`/reviews?package=${pkg.slug}`}
        className="mt-6 inline-block text-[13px] font-medium underline underline-offset-4 hover:text-gold"
      >
        Read every review for {pkg.destination} →
      </Link>
    </>
  );
}
