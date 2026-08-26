import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Footprints, MapPin, Users } from "lucide-react";

import { Photo } from "@/components/site/photo";
import { Stars } from "@/components/site/stars";
import { SaveButton } from "@/components/site/save-button";
import { CompareToggle } from "@/components/site/compare-toggle";
import { PriceCalculator } from "@/components/package/price-calculator";
import { ItineraryTimeline } from "@/components/package/itinerary";
import { RouteMap } from "@/components/package/route-map";
import { Gallery } from "@/components/package/gallery";
import { Inclusions } from "@/components/package/inclusions";
import { PackageReviews } from "@/components/package/package-reviews";
import { PACKAGES, REGION_LABEL, TRIP_TYPE_LABEL, getPackage } from "@/lib/data";

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Journey not found" };
  return { title: pkg.name, description: pkg.summary };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Day by day" },
  { id: "route", label: "Route & map" },
  { id: "included", label: "What's included" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
];

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const related = PACKAGES.filter(
    (p) => p.slug !== pkg.slug && (p.region === pkg.region || p.tripTypes.some((t) => pkg.tripTypes.includes(t)))
  ).slice(0, 3);

  return (
    <article>
      {/* ---------------------------------------------------------------- hero */}
      <header className="relative min-h-[68vh] overflow-hidden bg-ink">
        <Photo
          src={pkg.hero}
          fallbackSeed={pkg.slug}
          loading="eager"
          drift
          alt={pkg.destination}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 scrim-bottom" />

        <div className="relative mx-auto flex min-h-[68vh] max-w-[1400px] flex-col justify-end px-5 pt-28 pb-12 lg:px-10">
          <Link
            href="/packages"
            className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3.5 py-1.5 text-[12px] text-white/85 backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            <ArrowLeft className="size-3.5" />
            All journeys
          </Link>

          <span className="text-[11px] font-medium tracking-[0.28em] text-white/70 uppercase">
            {REGION_LABEL[pkg.region]} · {pkg.destination}, {pkg.country}
          </span>
          <h1 className="display mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] text-white">
            {pkg.name}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] text-white/80">{pkg.tagline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-white">
            <HeroStat icon={<Clock className="size-3.5" />} value={`${pkg.nights} nights`} />
            <HeroStat icon={<MapPin className="size-3.5" />} value={`${pkg.route.length} stops`} />
            <HeroStat icon={<Footprints className="size-3.5" />} value={pkg.physicality} />
            <HeroStat icon={<Users className="size-3.5" />} value={`Max ${pkg.groupSizeMax}`} />
            <span className="flex items-center gap-2">
              <Stars value={pkg.rating} size={13} />
              <span className="tabular text-[12px] text-white/80">
                {pkg.rating.toFixed(1)} · {pkg.reviewCount} reviews
              </span>
            </span>
            <span className="ml-auto flex items-center gap-2">
              <SaveButton slug={pkg.slug} tone="dark" withLabel />
              <CompareToggle slug={pkg.slug} className="border-white/30 bg-black/25 text-white backdrop-blur-sm hover:border-white hover:text-white" />
            </span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ section nav */}
      <nav className="sticky top-16 z-30 border-b border-border bg-background/92 backdrop-blur-xl sm:top-[72px]">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-5 no-scrollbar lg:px-10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 border-b-2 border-transparent py-3.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
          <a
            href="#price"
            className="ml-auto shrink-0 border-b-2 border-transparent py-3.5 text-[13px] font-medium text-gold lg:hidden"
          >
            Price it →
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-5 pb-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
          {/* ------------------------------------------------------------- main */}
          <div className="min-w-0 pt-14">
            <section id="overview" className="scroll-mt-32">
              <span className="eyebrow">Overview</span>
              <p className="display mt-4 max-w-2xl text-[clamp(1.35rem,2.5vw,1.75rem)] leading-[1.35]">
                {pkg.summary}
              </p>

              <div className="mt-8 flex max-w-2xl gap-4 rounded-xl border border-border bg-card p-5">
                <span className="mt-1 h-9 w-px shrink-0 rule-gold" style={{ width: 2 }} />
                <div>
                  <span className="eyebrow">Editor&rsquo;s note</span>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    {pkg.editorsNote}
                  </p>
                </div>
              </div>

              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {pkg.highlights.map((h, i) => (
                  <li key={h} className="flex gap-3.5">
                    <span className="tabular mt-0.5 text-[11px] font-semibold text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13.5px] leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-1.5">
                {pkg.tripTypes.map((t) => (
                  <Link
                    key={t}
                    href={`/packages?type=${t}`}
                    className="rounded-full border border-border px-3 py-1 text-[11.5px] font-medium transition-colors hover:border-gold hover:bg-gold-soft/40"
                  >
                    {TRIP_TYPE_LABEL[t]}
                  </Link>
                ))}
              </div>
            </section>

            <section id="itinerary" className="mt-20 scroll-mt-32">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="eyebrow">Day by day</span>
                  <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                    {pkg.itinerary.length} days, written out
                  </h2>
                </div>
                <span className="tabular hidden text-xs text-muted-foreground sm:block">
                  {pkg.nights} nights
                </span>
              </div>
              <div className="mt-10">
                <ItineraryTimeline pkg={pkg} />
              </div>
            </section>

            <section id="route" className="mt-20 scroll-mt-32">
              <span className="eyebrow">Route</span>
              <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                Where you sleep, and where you only pass through
              </h2>
              <div className="mt-8">
                <RouteMap pkg={pkg} />
              </div>
            </section>

            <section id="included" className="mt-20 scroll-mt-32">
              <span className="eyebrow">Inclusions</span>
              <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                Both sides of the line
              </h2>
              <div className="mt-8">
                <Inclusions pkg={pkg} />
              </div>
            </section>

            <section id="gallery" className="mt-20 scroll-mt-32">
              <span className="eyebrow">Gallery</span>
              <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                {pkg.destination}, photographed on our own departures
              </h2>
              <div className="mt-8">
                <Gallery pkg={pkg} />
              </div>
            </section>

            <section id="reviews" className="mt-20 scroll-mt-32">
              <PackageReviews pkg={pkg} />
            </section>
          </div>

          {/* ------------------------------------------------------------ aside */}
          <aside className="lg:pt-14">
            <div className="lg:sticky lg:top-32">
              <PriceCalculator pkg={pkg} />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24 border-t border-border pt-12">
            <span className="eyebrow">Also worth a look</span>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/packages/${p.slug}`} className="group">
                  <div className="aspect-[3/2] overflow-hidden bg-sand">
                    <Photo
                      src={p.hero}
                      fallbackSeed={p.slug}
                      alt={p.destination}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="eyebrow mt-4 block">{REGION_LABEL[p.region]}</span>
                  <h3 className="display mt-1.5 text-xl group-hover:text-gold">{p.name}</h3>
                  <p className="tabular mt-1 text-[12px] text-muted-foreground">
                    {p.nights} nights · {p.physicality}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function HeroStat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="tabular flex items-center gap-1.5 text-[12.5px] text-white/85">
      <span className="text-gold">{icon}</span>
      {value}
    </span>
  );
}
