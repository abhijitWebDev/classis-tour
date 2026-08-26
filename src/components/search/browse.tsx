"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/search/filter-bar";
import { PackageCard } from "@/components/search/package-card";
import { PACKAGES } from "@/lib/packages";
import {
  DEFAULT_FILTERS,
  applyFilters,
  parseFilters,
  serializeFilters,
  type Filters,
} from "@/lib/filters";

export function Browse() {
  const router = useRouter();
  const params = useSearchParams();
  const filters = React.useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);

  const push = React.useCallback(
    (next: Filters) => {
      const qs = serializeFilters(next).toString();
      router.replace(qs ? `/packages?${qs}` : "/packages", { scroll: false });
    },
    [router]
  );

  const onChange = (patch: Partial<Filters>) => push({ ...filters, ...patch });
  const onReset = () => push(DEFAULT_FILTERS);

  const results = React.useMemo(() => applyFilters(PACKAGES, filters), [filters]);

  return (
    <>
      <FilterBar
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        resultCount={results.length}
        totalCount={PACKAGES.length}
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-24 lg:px-10">
        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} month={filters.month} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={onReset} />
        )}
      </div>
    </>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <CompassIcon className="mx-auto size-10 text-gold" strokeWidth={1} />
      <h2 className="display mt-6 text-3xl">Nothing matches, yet</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We plan nine journeys rather than nine hundred, so a narrow filter can empty the
        page. Clear the month or widen the length — several of these only operate in a
        particular season.
      </p>
      <Button onClick={onReset} variant="outline" className="mt-7 h-10 rounded-full px-5">
        Clear all filters
      </Button>
    </div>
  );
}
