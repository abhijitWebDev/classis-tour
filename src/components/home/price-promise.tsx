import Link from "next/link";
import { CalendarRange, Layers, ReceiptText } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";

const ITEMS = [
  {
    icon: CalendarRange,
    title: "Dates change the price, visibly",
    body: "Every journey carries twelve monthly multipliers. Move your departure from August to October and the number moves with it, on screen, before you speak to anyone.",
    href: "/packages/ladakh-high-passes",
    cta: "See a live calculator",
  },
  {
    icon: ReceiptText,
    title: "The breakdown, line by line",
    body: "Land arrangements, room supplement, season adjustment, group saving, add-ons, the non-discountable flights component, and GST. No single unexplained figure.",
    href: "/packages/maldives-atoll-solitude#price",
    cta: "Open a breakdown",
  },
  {
    icon: Layers,
    title: "Compare before you commit",
    body: "Stack up to three journeys side by side — duration, pace, what is included, what is not, and the same all-in price for the same party.",
    href: "/compare",
    cta: "Open the comparison",
  },
];

export function PricePromise() {
  return (
    <Section>
      <SectionHeader
        eyebrow="The numbers"
        title={"No \u201cstarting from\u201d, anywhere on this site"}
        blurb="A headline price with no party size and no dates behind it is a marketing number. Everything quoted here is calculated for the travellers and the month you actually chose."
        href="/packages"
        linkLabel="Price a journey"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <article
            key={item.title}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/70"
          >
            <item.icon className="size-5 text-gold" strokeWidth={1.4} />
            <h3 className="display mt-5 text-[21px] leading-snug text-balance">{item.title}</h3>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
              {item.body}
            </p>
            <Link
              href={item.href}
              className="mt-5 text-[13px] font-medium underline-offset-4 after:absolute after:inset-0 group-hover:text-gold group-hover:underline"
            >
              {item.cta} →
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
