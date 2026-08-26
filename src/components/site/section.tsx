import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * The single layout system for the site.
 *
 * Every band on the homepage is a <Section> with a <SectionHeader> and, where it
 * lists things, a <CardGrid>. One container width, one vertical rhythm, one
 * header pattern. Variation is meant to come from the content inside the cards —
 * price, duration, region — not from re-inventing the layout each band, which is
 * what made the page read as scattered.
 */

export function Section({
  id,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  tone?: "default" | "raised" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-border py-20 lg:py-24",
        tone === "raised" && "bg-[color-mix(in_oklch,var(--background),var(--foreground)_3%)]",
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
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
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
}: {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
}) {
  return (
    <div className={cn("mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {React.Children.map(children, (child, i) => (
        <Reveal className="h-full" delay={Math.min(i, 4) * stagger}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
