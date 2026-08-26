import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { CurrencyProvider, TripsProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CompareTray } from "@/components/site/compare-tray";

/** Editorial display face — headlines, destination names, prices at large sizes. */
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
    default: "Classis Tour — Journeys planned properly",
    template: "%s · Classis Tour",
  },
  description:
    "Nine journeys, planned in detail — the Himalaya, the Indian Ocean, Arabia, East Africa, the Mediterranean and the Andes. Search, compare, price and book.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${ui.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
