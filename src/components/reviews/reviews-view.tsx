"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Photo } from "@/components/site/photo";
import { Stars } from "@/components/site/stars";
import { PACKAGES, REGIONS, REVIEWS, TRIP_TYPES, REGION_LABEL, TRIP_TYPE_LABEL } from "@/lib/data";
import { cn } from "@/lib/utils";

type State = {
  region: string;
  type: string;
  pkg: string;
  minRating: number;
  photosOnly: boolean;
};

export function ReviewsView() {
  const params = useSearchParams();
  const [state, setState] = React.useState<State>(() => ({
    region: params.get("region") ?? "all",
    type: params.get("type") ?? "all",
    pkg: params.get("package") ?? "all",
    minRating: 0,
    photosOnly: false,
  }));

  const patch = (p: Partial<State>) => setState((s) => ({ ...s, ...p }));
  const reset = () =>
    setState({ region: "all", type: "all", pkg: "all", minRating: 0, photosOnly: false });

  const results = REVIEWS.filter((r) => {
    if (state.region !== "all" && r.region !== state.region) return false;
    if (state.type !== "all" && r.tripType !== state.type) return false;
    if (state.pkg !== "all" && r.packageSlug !== state.pkg) return false;
    if (r.rating < state.minRating) return false;
    if (state.photosOnly && r.photos.length === 0) return false;
    return true;
  });

  const average =
    results.length > 0
      ? results.reduce((s, r) => s + r.rating, 0) / results.length
      : 0;
  const withPhotos = results.filter((r) => r.photos.length > 0).length;
  const active =
    (state.region !== "all" ? 1 : 0) +
    (state.type !== "all" ? 1 : 0) +
    (state.pkg !== "all" ? 1 : 0) +
    (state.minRating > 0 ? 1 : 0) +
    (state.photosOnly ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 lg:px-10">
      {/* the filter panel, deliberately tool-like */}
      <div className="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[auto_1fr_auto] lg:items-end">
        <div className="flex flex-wrap gap-4">
          <Control label="Region" value={state.region} onChange={(v) => patch({ region: v })} width="w-[165px]">
            <SelectItem value="all">Every region</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.label}
              </SelectItem>
            ))}
          </Control>

          <Control label="Kind of trip" value={state.type} onChange={(v) => patch({ type: v })} width="w-[155px]">
            <SelectItem value="all">Every kind</SelectItem>
            {TRIP_TYPES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </Control>

          <Control label="Journey" value={state.pkg} onChange={(v) => patch({ pkg: v })} width="w-[210px]">
            <SelectItem value="all">Every journey</SelectItem>
            {PACKAGES.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name}
              </SelectItem>
            ))}
          </Control>

          <div>
            <span className="eyebrow block">Minimum rating</span>
            <ToggleGroup
              type="single"
              value={String(state.minRating)}
              onValueChange={(v) => patch({ minRating: Number(v || 0) })}
              className="mt-2"
              variant="outline"
            >
              {[0, 4, 5].map((n) => (
                <ToggleGroupItem key={n} value={String(n)} className="h-10 px-3 text-[12.5px]">
                  {n === 0 ? "Any" : `${n}★+`}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <span className="eyebrow block">Photographs</span>
            <button
              onClick={() => patch({ photosOnly: !state.photosOnly })}
              aria-pressed={state.photosOnly}
              className={cn(
                "mt-2 inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-[12.5px] font-medium transition-colors",
                state.photosOnly
                  ? "border-gold bg-gold-soft/50"
                  : "border-border hover:border-gold/60"
              )}
            >
              <Camera className="size-3.5" strokeWidth={1.6} />
              With photos only
            </button>
          </div>
        </div>

        <div />

        <dl className="tabular flex gap-6 lg:justify-end">
          <Metric label="Showing" value={String(results.length)} />
          <Metric label="Average" value={average ? average.toFixed(1) : "—"} />
          <Metric label="With photos" value={String(withPhotos)} />
        </dl>
      </div>

      {active > 0 && (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
          <Filter className="size-3.5" />
          {active} filter{active > 1 ? "s" : ""} applied
          <button onClick={reset} className="underline underline-offset-4 hover:text-foreground">
            Clear
          </button>
        </div>
      )}

      {/* masonry-style column flow — reviews are uneven by nature */}
      {results.length > 0 ? (
        <div className="mt-8 columns-1 gap-6 md:columns-2 xl:columns-3 [&>*]:mb-6">
          {results.map((r) => {
            const pkg = PACKAGES.find((p) => p.slug === r.packageSlug)!;
            return (
              <article key={r.id} className="break-inside-avoid rounded-xl border border-border bg-card">
                {r.photos.length > 0 && (
                  <div className={cn("grid gap-px bg-border", r.photos.length > 1 && "grid-cols-2")}>
                    {r.photos.map((src, i) => (
                      <div key={src} className="aspect-[4/3] overflow-hidden bg-sand">
                        <Photo src={src} fallbackSeed={`${r.id}-${i}`} alt="" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold-soft/60 text-[11px] font-semibold">
                      {r.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{r.author}</span>
                      <span className="tabular block text-[11px] text-muted-foreground">
                        {r.travelledOn}
                      </span>
                    </span>
                    <Stars value={r.rating} />
                  </div>

                  <h2 className="display mt-4 text-[19px] leading-snug">{r.title}</h2>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{r.body}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
                    <Tag>{REGION_LABEL[r.region]}</Tag>
                    <Tag>{TRIP_TYPE_LABEL[r.tripType]}</Tag>
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="ml-auto text-[12px] font-medium underline-offset-4 hover:text-gold hover:underline"
                    >
                      {pkg.destination} →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center">
          <h2 className="display text-2xl">No reviews match those filters</h2>
          <Button onClick={reset} variant="outline" className="mt-6 h-10 rounded-full px-5">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function Control({
  label,
  value,
  onChange,
  width,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="eyebrow block">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("mt-2 h-10", width, value !== "all" && "border-gold bg-gold-soft/50")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{label}</dt>
      <dd className="display mt-1 text-2xl">{value}</dd>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-secondary-foreground">
      {children}
    </span>
  );
}
