import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span
          className={cn(
            "text-[11px] font-medium tracking-[0.24em] uppercase",
            dark ? "text-white/45" : "text-muted-foreground"
          )}
        >
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
            "group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors",
            dark ? "text-white/80 hover:text-gold" : "hover:text-gold"
          )}
        >
          {linkLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Four across on desktop, two on tablet, one on mobile — used by every list. */
export function CardGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
