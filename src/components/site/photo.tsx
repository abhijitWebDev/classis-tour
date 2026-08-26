"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { fallbackPhoto } from "@/lib/images";

type PhotoProps = Omit<React.ComponentProps<"img">, "src"> & {
  src: string;
  /** Seed used for the replacement image if the primary asset fails. */
  fallbackSeed: string;
  /** Slow drift used on full-bleed hero frames. */
  drift?: boolean;
};

type State = { src: string; current: string; loaded: boolean; failed: boolean };

/**
 * Full-bleed photography with a guaranteed replacement. A travel site with a
 * broken image frame reads as abandoned, so every frame has a second source.
 */
export function Photo({
  src,
  fallbackSeed,
  className,
  drift,
  alt = "",
  ...props
}: PhotoProps) {
  // Reset during render rather than in an effect when the source prop changes.
  const [state, setState] = React.useState<State>({
    src,
    current: src,
    loaded: false,
    failed: false,
  });
  if (state.src !== src) {
    setState({ src, current: src, loaded: false, failed: false });
  }

  const markLoaded = React.useCallback(
    () => setState((s) => (s.loaded ? s : { ...s, loaded: true })),
    []
  );

  const markFailed = React.useCallback(
    () =>
      setState((s) => {
        const fb = fallbackPhoto(fallbackSeed);
        if (s.failed || s.current === fb) return { ...s, loaded: true };
        return { ...s, current: fb, loaded: false, failed: true };
      }),
    [fallbackSeed]
  );

  /**
   * Server-rendered frames frequently finish downloading before React hydrates,
   * so their load/error events fire with no listener attached. Read the decoded
   * state off the node on mount instead of trusting the event.
   *
   * If the frame is still in flight we cannot just wait for React's onLoad
   * either: `load` does not bubble, so React binds it to the node during commit,
   * and an image that finishes in the window between this callback and that
   * commit fires into nothing and the frame stays at opacity-0 forever. Bind
   * natively here and let React's handler be the duplicate.
   */
  const attach = React.useCallback(
    (node: HTMLImageElement | null) => {
      if (!node) return;
      if (node.complete) {
        if (node.naturalWidth === 0) markFailed();
        else markLoaded();
        return;
      }
      node.addEventListener("load", markLoaded);
      node.addEventListener("error", markFailed);
      return () => {
        node.removeEventListener("load", markLoaded);
        node.removeEventListener("error", markFailed);
      };
    },
    [markLoaded, markFailed]
  );

  return (
    // Deliberately not next/image: these are third-party CDN frames with a
    // runtime fallback swap, which the optimizer cannot express.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      ref={attach}
      src={state.current}
      alt={alt}
      loading={props.loading ?? "lazy"}
      decoding="async"
      onLoad={markLoaded}
      onError={markFailed}
      className={cn(
        "h-full w-full object-cover transition-opacity duration-700",
        state.loaded ? "opacity-100" : "opacity-0",
        drift && "animate-drift",
        className
      )}
    />
  );
}

/** A neutral sand-coloured plate that sits behind every Photo while it loads. */
export function PhotoFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>{children}</div>
  );
}
