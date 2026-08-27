"use client";

import { COMPANY } from "@/lib/company";
import { useTrips } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Floating contact affordance. For an Indian travel business WhatsApp is the
 * channel most enquiries actually arrive on, so this is a real conversion path
 * rather than decoration — the pulse ring is what makes it noticed.
 *
 * The number is a placeholder until the client supplies the business line;
 * `COMPANY.whatsapp` is the one place to change it.
 *
 * The compare tray is also fixed to the bottom and, on a phone, spans the full
 * width — so this lifts above it whenever the tray is up rather than sitting
 * on top of the "Compare" button.
 */
export function WhatsAppButton() {
  const { compare, ready } = useTrips();
  const trayUp = ready && compare.length > 0;

  const message = encodeURIComponent(
    "Hello Classis — I'd like to talk about an event / group booking."
  );

  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Classis on WhatsApp"
      className={cn(
        "animate-ring fixed right-5 z-40 flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none lg:right-8",
        trayUp ? "bottom-28 sm:bottom-24 lg:bottom-8" : "bottom-5 lg:bottom-8"
      )}
    >
      {/* Inline mark rather than an emoji: emoji render differently per platform
          and are announced by screen readers as their unicode name. */}
      <svg viewBox="0 0 24 24" className="size-6.5 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.25 8.24z" />
      </svg>
    </a>
  );
}
