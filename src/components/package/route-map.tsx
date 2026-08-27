"use client";

import * as React from "react";
import { MapPin, Moon } from "lucide-react";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A schematic route map. Deliberately drawn rather than tiled: it shows the
 * shape and order of the journey, which is what a traveller is actually asking,
 * and it works offline with no key, no tracker and no blue OTA basemap.
 */
export function RouteMap({ pkg }: { pkg: Package }) {
  const [active, setActive] = React.useState<number | null>(null);
  const pts = pkg.route;

  const path = React.useMemo(() => {
    if (pts.length < 2) return "";
    return pts
      .map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        const bow = (i % 2 === 0 ? -1 : 1) * 6;
        return `Q ${cx + bow} ${(prev.y + p.y) / 2 + bow} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [pts]);

  const current = active !== null ? pts[active] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative overflow-hidden rounded-xl border border-border bg-[color-mix(in_oklab,var(--sand),var(--background)_45%)]">
        <svg viewBox="0 0 100 100" className="block aspect-[4/3] w-full" role="img" aria-label={`Route map for ${pkg.name}`}>
          <defs>
            <pattern id="ct-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-foreground/8" />
            </pattern>
            <radialGradient id="ct-terrain" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100" height="100" fill="url(#ct-grid)" />
          <rect width="100" height="100" fill="url(#ct-terrain)" />

          {/* contour suggestion */}
          {[22, 30, 38, 46].map((r) => (
            <circle
              key={r}
              cx="34"
              cy="32"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-foreground/10"
            />
          ))}

          <path
            d={path}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.7"
            strokeDasharray="2 1.4"
            strokeLinecap="round"
          />

          {pts.map((p, i) => {
            const on = active === i;
            return (
              <g
                key={p.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
              >
                <circle cx={p.x} cy={p.y} r={on ? 4.4 : 3.2} fill="var(--background)" stroke="var(--foreground)" strokeWidth="0.5" />
                <circle cx={p.x} cy={p.y} r={p.nights > 0 ? 1.5 : 0.9} fill={p.nights > 0 ? "var(--gold)" : "var(--foreground)"} />
                <text
                  x={p.x}
                  y={p.y - 5.4}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 3.1, fontWeight: 600, letterSpacing: "0.02em" }}
                >
                  {p.name}
                </text>
                {p.nights > 0 && (
                  <text
                    x={p.x}
                    y={p.y + 7.6}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: 2.5 }}
                  >
                    {p.nights} night{p.nights > 1 ? "s" : ""}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background/85 px-4 py-2.5 text-[11px] backdrop-blur-sm">
          <span className="tabular text-muted-foreground">
            {pts.length} points · {pkg.nights} nights · schematic, not to scale
          </span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-gold" /> Overnight
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-foreground" /> Passed through
            </span>
          </span>
        </div>
      </div>

      <ol className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {pts.map((p, i) => (
          <li key={p.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                current?.name === p.name && "bg-gold-soft/40"
              )}
            >
              <MapPin
                className={cn("size-4 shrink-0", p.nights > 0 ? "text-gold" : "text-muted-foreground")}
                strokeWidth={1.6}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium">{p.name}</span>
                <span className="tabular block text-[11px] text-muted-foreground">
                  From day {p.arriveDay}
                </span>
              </span>
              <span className="tabular inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                {p.nights > 0 ? (
                  <>
                    <Moon className="size-3" strokeWidth={1.6} />
                    {p.nights}
                  </>
                ) : (
                  "en route"
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
