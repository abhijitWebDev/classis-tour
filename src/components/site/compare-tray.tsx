"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrips, COMPARE_LIMIT } from "@/lib/store";
import { PACKAGES } from "@/lib/packages";
import { Photo } from "@/components/site/photo";

/**
 * Persistent tray so a comparison survives navigation — the whole point of
 * comparing is that you keep browsing while you build it.
 */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare, ready } = useTrips();
  const pathname = usePathname();

  if (!ready || compare.length === 0 || pathname === "/compare") return null;

  const items = compare
    .map((slug) => PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is (typeof PACKAGES)[number] => Boolean(p));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card/95 p-2.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-4 sm:p-3">
        <span className="eyebrow hidden shrink-0 pl-2 sm:block">
          Compare {items.length}/{COMPARE_LIMIT}
        </span>
        <ul className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {items.map((p) => (
            <li
              key={p.slug}
              className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-background py-1 pr-2 pl-1"
            >
              <span className="size-7 overflow-hidden rounded-full bg-sand">
                <Photo src={p.hero} fallbackSeed={p.slug} className="size-7" />
              </span>
              <span className="max-w-[120px] truncate text-xs font-medium sm:max-w-[160px]">
                {p.destination}
              </span>
              <button
                onClick={() => toggleCompare(p.slug)}
                aria-label={`Remove ${p.name} from comparison`}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={clearCompare}
          className="hidden text-xs text-muted-foreground hover:text-foreground sm:block"
        >
          Clear
        </button>
        <Button asChild className="h-9 shrink-0 rounded-full px-4 text-[13px]">
          <Link href="/compare">
            Compare<span className="hidden sm:inline">&nbsp;side by side</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
