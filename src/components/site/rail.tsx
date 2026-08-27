"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A horizontal rail with slider controls.
 *
 * The list underneath stays an ordinary scroll-snap container rather than a
 * transform-driven track. That is the whole design: touch momentum, trackpad
 * swipe, keyboard scrolling, deep-linked anchors and the no-JS render all keep
 * working on their own, and the buttons are enhancement layered on top. A
 * translate-based carousel has to reimplement every one of those, and usually
 * reimplements only the first.
 *
 * There is deliberately no autoplay. The reference site rotates its slider on a
 * five second timer, which is a reasonable choice for testimonials nobody reads
 * closely; a reader comparing conference cities is scanning names, and moving
 * that out from under them is a hazard rather than a flourish.
 */
export function Rail({
  children,
  label,
  caption,
  className,
}: {
  children: React.ReactNode;
  /** Names the scrollable region for screen readers and the arrow buttons. */
  label: string;
  /** Short count line that sits alongside the controls. */
  caption?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      // A sub-pixel slack: scrollWidth and clientWidth disagree by fractions at
      // some zoom levels, and without it the forward arrow never disables.
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft >= max - 1);
    };

    // Element scroll, not window scroll, and it only ever flips two booleans.
    // Coalescing to one frame keeps a fast flick from queueing a render per event.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(read);
    ro.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;

    // Measure the pitch off the real children rather than hardcoding the tile
    // width, which changes across three breakpoints.
    const items = el.children;
    const first = items[0] as HTMLElement | undefined;
    if (!first) return;
    const second = items[1] as HTMLElement | undefined;
    const pitch = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;

    // A page at a time, holding one tile of context so the reader keeps their place.
    const perPage = Math.max(1, Math.floor(el.clientWidth / pitch) - 1);

    el.scrollBy({
      left: direction * pitch * perPage,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  // Both ends true at once means nothing overflows, so the controls have no job.
  const idle = atStart && atEnd;

  return (
    <div className={cn("rail relative", className)}>
      <ul
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={label}
        // scroll-pl must match px, or the snap points land on the padding edge
        // rather than the content edge: the rail loads at scrollLeft 40 on
        // desktop and the first tile sits a padding-width left of the headline.
        className="rail-scroller no-scrollbar -mx-5 mt-10 flex snap-x scroll-pl-5 gap-3 overflow-x-auto scroll-smooth px-5 pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:-mx-10 lg:scroll-pl-10 lg:gap-4 lg:px-10"
      >
        {children}
      </ul>

      <div className="mt-5 flex items-center gap-5">
        {caption && (
          <p className="text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
            {caption}
          </p>
        )}

        {/*
          Fed by a scroll timeline on the list itself, so the indicator tracks
          the real scroll position with no listener and no state. It is hidden
          outright where scroll timelines are unsupported rather than faked with
          a second code path.
        */}
        <div className="rail-meter h-px flex-1 bg-border" aria-hidden>
          <span className="rail-progress block h-px w-full bg-gold" />
        </div>

        <div className={cn("flex gap-2", idle && "hidden")}>
          <RailButton
            direction={-1}
            onClick={() => step(-1)}
            disabled={atStart}
            label={`Previous ${label}`}
          />
          <RailButton
            direction={1}
            onClick={() => step(1)}
            disabled={atEnd}
            label={`Next ${label}`}
          />
        </div>
      </div>
    </div>
  );
}

function RailButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: 1 | -1;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  const Icon = direction === 1 ? ArrowRight : ArrowLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-[colors,transform] hover:border-gold hover:text-gold active:translate-y-px disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="size-4" strokeWidth={1.6} />
    </button>
  );
}
