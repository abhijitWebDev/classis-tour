import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * The single layout system for the site.
 *
 * Every band is a <Section> with a <SectionHeader>. One container width, one
 * vertical rhythm, one header pattern — so a band never has to reinvent its
 * chrome, which is what made the page read as scattered.
 *
 * What the system does NOT do is dictate the shape of the content. Five bands
 * running header + four-across grid in the same height range read as one band
 * repeated, however well each is built. Each band picks a shape — a rail, a
 * mosaic, a short measure, a register, a pull-quote — and the props here
 * (`tone`, `size`, `align`) exist to let it, without leaving the system.
 *
 * A band that needs to run past the container does it from the inside, with
 * negative inline margins against this padding (see the destinations rail),
 * rather than through a prop here.
 */

export function Section({
  id,
  tone = "default",
  /** `compact` is the short punctuation band; `default` is a full chapter. */
  size = "default",
  className,
  children,
}: {
  id?: string;
  tone?: "default" | "raised" | "ink";
  size?: "default" | "compact";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-border",
        size === "compact" ? "py-14 lg:py-16" : "py-20 lg:py-24",
        // Warm sand rather than a neutral darkening: at 3% toward the
        // foreground the shift was imperceptible and read faintly mauve, so
        // alternating grounds did no work at all.
        tone === "raised" && "bg-[color-mix(in_oklab,var(--background),var(--sand)_62%)]",
        tone === "ink" && "border-transparent bg-ink text-[color:var(--shell)]",
        className
      )}
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  blurb,
  href,
  linkLabel,
  tone = "light",
  /** Centring is reserved for the commercial centrepiece — one band, not five. */
  align = "left",
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const dark = tone === "dark";
  const centered = align === "center";

  if (centered) {
    return (
      <Reveal className="flex flex-col items-center text-center">
        <span
          className={cn(
            "flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase",
            dark ? "text-white/45" : "text-muted-foreground"
          )}
        >
          <span className="h-px w-7 bg-gold" />
          {eyebrow}
          <span className="h-px w-7 bg-gold" />
        </span>
        <h2
          className={cn(
            "display mt-3 max-w-3xl text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.1] text-balance",
            dark && "text-white"
          )}
        >
          {title}
        </h2>
        {blurb && (
          <p
            className={cn(
              "mt-4 max-w-xl text-[15px] leading-relaxed",
              dark ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {blurb}
          </p>
        )}
        {href && linkLabel && (
          <Link
            href={href}
            className={cn(
              "group mt-6 inline-flex flex-col text-sm font-medium transition-colors",
              dark ? "text-white/80 hover:text-gold" : "hover:text-gold"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {linkLabel}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="rule-draw mt-1 h-px w-full" />
          </Link>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span
          className={cn(
            "flex items-center gap-3 text-[11px] font-medium tracking-[0.24em] uppercase",
            dark ? "text-white/45" : "text-muted-foreground"
          )}
        >
          <span className={cn("h-px w-7", dark ? "bg-gold" : "bg-gold")} />
          {eyebrow}
        </span>
        <h2
          className={cn(
            "display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.1] text-balance",
            dark && "text-white"
          )}
        >
          {title}
        </h2>
        {blurb && (
          <p
            className={cn(
              "mt-4 max-w-xl text-[15px] leading-relaxed",
              dark ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {blurb}
          </p>
        )}
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 flex-col text-sm font-medium transition-colors",
            dark ? "text-white/80 hover:text-gold" : "hover:text-gold"
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            {linkLabel}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="rule-draw mt-1 h-px w-full" />
        </Link>
      )}
    </Reveal>
  );
}

/**
 * Four across on desktop, two on tablet, one on mobile — used by every list.
 * Children are revealed in sequence as the grid is reached; the stagger is kept
 * short so a full row still reads as one movement rather than a queue.
 */
export function CardGrid({
  className,
  children,
  stagger = 70,
  from = "up",
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
  from?: "up" | "left" | "right" | "scale";
}) {
  return (
    <div className={cn("mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {React.Children.map(children, (child, i) => (
        <Reveal className="h-full" delay={Math.min(i, 4) * stagger} from={from}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
