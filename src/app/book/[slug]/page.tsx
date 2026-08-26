import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/booking-flow";
import { PACKAGES, getPackage, REGION_LABEL } from "@/lib/data";

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
  return { title: pkg ? `Book ${pkg.name}` : "Booking" };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return (
    <div className="pt-16 sm:pt-[72px]">
      <div className="border-b border-border bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]">
        <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10">
          <span className="eyebrow">Booking · {REGION_LABEL[pkg.region]}</span>
          <h1 className="display mt-3 text-[clamp(1.85rem,4vw,2.75rem)]">{pkg.name}</h1>
        </div>
      </div>

      <div className="pt-8">
        <Suspense fallback={<div className="h-[60vh]" />}>
          <BookingFlow pkg={pkg} />
        </Suspense>
      </div>
    </div>
  );
}
