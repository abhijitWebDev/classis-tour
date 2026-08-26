import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { CurrencyProvider, TripsProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CompareTray } from "@/components/site/compare-tray";

/** Editorial display face — headlines, destination and city names at large sizes. */
const editorial = Fraunces({
  variable: "--font-editorial",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

/** UI face — filters, form fields, buttons, tabular figures. */
const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Classis Travel and Tours — MICE, corporate travel & events",
    template: "%s · Classis Tour",
  },
  description:
    "Mumbai-based travel management: MICE, conferences, corporate travel and incentive programmes for companies and hospitals. Pricing quoted against your brief.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${ui.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Scroll-reveal hides its targets in CSS. If JavaScript never runs, the
          observer never fires, so un-hide everything rather than shipping a
          blank page.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <CurrencyProvider>
          <TripsProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <CompareTray />
          </TripsProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
