"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTrips } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/mice", label: "MICE & Events" },
  { href: "/corporate", label: "Corporate" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/packages", label: "Incentive travel" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { saved, compare, ready } = useTrips();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled;
  const tone = transparent ? "dark" : "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "border-b border-border/70 bg-background/85 backdrop-blur-xl"
      )}
    >
      {/*
        Three columns rather than a flex row: the two 1fr rails absorb the logo
        and the actions, so the nav sits on the container's true centre line and
        stays there no matter how much wider the action cluster gets than the
        wordmark. Centring it inside a flex row would only ever centre it in the
        leftover space. Below `lg` the nav is hidden, the middle column
        collapses to nothing, and it falls back to logo-left / actions-right.
      */}
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 sm:h-[72px] lg:px-10">
        <Link href="/" className="group flex w-fit shrink-0 flex-col leading-none">
          <span
            className={cn(
              "display text-[19px] tracking-[0.14em] uppercase transition-colors sm:text-[21px]",
              transparent ? "text-white" : "text-foreground"
            )}
          >
            Classis
          </span>
          <span
            className={cn(
              "text-[9px] font-medium tracking-[0.42em] uppercase transition-colors",
              transparent ? "text-white/60" : "text-muted-foreground"
            )}
          >
            Tour
          </span>
        </Link>

        {/* Tighter tracking at the lg tier: at 1024 the action cluster is wider
            than the wordmark, and at gap-7 the nav cannot reach the centre line
            without touching it. It opens back up once there is room. */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-[13px] font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full",
                transparent ? "text-white/85 hover:text-white" : "text-muted-foreground hover:text-foreground",
                pathname === item.href && !transparent && "text-foreground after:w-full"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <IconLink
            href="/compare"
            tone={tone}
            count={ready ? compare.length : 0}
            label="Comparison"
          >
            <Scale className="size-4" strokeWidth={1.6} />
          </IconLink>

          <IconLink href="/saved" tone={tone} count={ready ? saved.length : 0} label="Saved trips">
            <Heart className="size-4" strokeWidth={1.6} />
          </IconLink>

          <Button
            asChild
            className={cn(
              "hidden h-9 rounded-full px-4 text-[13px] sm:inline-flex",
              transparent && "bg-white text-ink hover:bg-white/85"
            )}
          >
            <Link href="/mice#brief">Send a brief</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-full border lg:hidden",
                  transparent ? "border-white/30 text-white" : "border-border text-foreground"
                )}
              >
                <Menu className="size-4" strokeWidth={1.6} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm px-6 py-8">
              <SheetTitle className="display text-2xl font-light">Classis Tour</SheetTitle>
              <nav className="mt-8 flex flex-col">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 text-base"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/saved" onClick={() => setOpen(false)} className="border-b border-border py-4 text-base">
                  Saved trips
                </Link>
                <Link href="/compare" onClick={() => setOpen(false)} className="border-b border-border py-4 text-base">
                  Comparison
                </Link>
              </nav>
              <Button asChild className="mt-8 h-11 w-full rounded-full">
                <Link href="/mice#brief" onClick={() => setOpen(false)}>
                  Send a brief
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  children,
  count,
  tone,
  label,
}: {
  href: string;
  children: React.ReactNode;
  count: number;
  tone: "light" | "dark";
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label} (${count})`}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full border transition-colors",
        tone === "dark"
          ? "border-white/25 text-white hover:bg-white/10"
          : "border-border text-foreground hover:border-gold"
      )}
    >
      {children}
      {count > 0 && (
        <span className="tabular absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
