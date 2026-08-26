"use client";

import { Heart } from "lucide-react";
import { useTrips } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SaveButton({
  slug,
  className,
  tone = "light",
  withLabel = false,
}: {
  slug: string;
  className?: string;
  tone?: "light" | "dark";
  withLabel?: boolean;
}) {
  const { isSaved, toggleSaved, ready } = useTrips();
  const saved = ready && isSaved(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved trips" : "Save this trip"}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border transition-all",
        withLabel ? "h-9 px-3.5 text-xs font-medium" : "size-9 justify-center",
        tone === "dark"
          ? "border-white/30 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40"
          : "border-border bg-card/90 text-foreground backdrop-blur-sm hover:border-gold",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-all",
          saved ? "fill-gold text-gold scale-110" : "group-hover:text-gold"
        )}
        strokeWidth={1.6}
      />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
