"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Photo } from "@/components/site/photo";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Gallery({ pkg }: { pkg: Package }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const shots = pkg.gallery;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden bg-sand",
              i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-[4/3]"
            )}
          >
            <Photo
              src={shot.src}
              fallbackSeed={`${pkg.slug}-${i}`}
              alt={shot.caption}
              className="transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 scrim-bottom px-3 pt-10 pb-2.5 text-left text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {shot.caption}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl overflow-hidden p-0" showCloseButton>
          {open !== null && (
            <>
              <DialogTitle className="sr-only">{shots[open].caption}</DialogTitle>
              <div className="aspect-[3/2] w-full bg-sand">
                <Photo src={shots[open].src} fallbackSeed={`${pkg.slug}-${open}`} alt={shots[open].caption} />
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                <p className="text-[13px]">{shots[open].caption}</p>
                <div className="flex gap-1.5">
                  {shots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setOpen(i)}
                      aria-label={`Photograph ${i + 1}`}
                      className={cn(
                        "h-1 w-6 rounded-full transition-colors",
                        i === open ? "bg-gold" : "bg-border hover:bg-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
