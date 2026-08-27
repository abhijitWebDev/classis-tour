"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reveals its children once as they scroll into view.
 *
 * The hidden state lives in CSS on [data-reveal] so there is no first-paint
 * flash, and `prefers-reduced-motion` short-circuits it in the stylesheet. A
 * <noscript> rule in the root layout un-hides everything if JavaScript never
 * runs, so the page can never be left blank by this.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Milliseconds, for staggering siblings. Keep under ~250 or it reads as lag. */
  delay?: number;
  /**
   * Which way the band travels in from. Pick the one the band's own shape
   * argues for rather than alternating for variety's sake: a rail that runs off
   * the right edge enters from the right, a pull-quote settles in with scale.
   */
  from?: "up" | "left" | "right" | "scale";
  className?: string;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already past it on load (a deep link, a restored scroll position) — show
    // immediately rather than waiting for a scroll that may never come.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Positive bottom margin extends the root downwards, so a band begins
      // revealing just before it is reached rather than once it is already in view.
      { rootMargin: "0px 0px 14% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "shown" : "hidden"}
      data-reveal-from={from === "up" ? undefined : from}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
