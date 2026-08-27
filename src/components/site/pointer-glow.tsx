"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A pool of warm light that follows the cursor across its parent card.
 *
 * Renders as the card's own overlay and reads the pointer off the parent, so a
 * server-rendered card can drop one in without becoming a client component
 * itself. The parent must be positioned and carry `group` for the hover fade.
 *
 * The coordinates are written straight to the element's style object. Holding
 * them in state instead would re-render on every pointer frame, which is what
 * makes this pattern stutter on a busy page and die outright on a phone.
 */
export function PointerGlow({ className }: { className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    // A coarse pointer has no hover state to light up, so the listener would be
    // battery spent on an effect nobody can see.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      el.style.setProperty("--gx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--gy", `${event.clientY - rect.top}px`);
    };

    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        className
      )}
    />
  );
}
