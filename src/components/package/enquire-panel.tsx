import Link from "next/link";
import { ArrowRight, CalendarRange, ReceiptText, Users } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import type { Package } from "@/lib/types";

/**
 * Replaces the old live price calculator. Pricing is quoted against a brief, so
 * the aside now explains what actually moves the number and sends you to the
 * request flow rather than showing a figure.
 */
export function EnquirePanel({ pkg }: { pkg: Package }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex gap-4 border-b border-border p-4">
        <span className="size-16 shrink-0 overflow-hidden rounded-md bg-sand">
          <Photo src={pkg.hero} fallbackSeed={pkg.slug} alt="" className="size-16" />
        </span>
        <span className="min-w-0">
          <span className="display block text-[17px] leading-tight">{pkg.name}</span>
          <span className="tabular mt-1 block text-[11.5px] text-muted-foreground">
            {pkg.nights} nights · {pkg.physicality} · up to {pkg.groupSizeMax}
          </span>
        </span>
      </div>

      <div className="p-5">
        <span className="block text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Pricing
        </span>
        <span className="display mt-1 block text-[26px] leading-none">On request</span>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
          We quote this journey against your party and your dates rather than publishing a
          figure that would be wrong for most of them.
        </p>

        <ul className="mt-5 space-y-3 border-t border-border pt-5">
          <Factor icon={CalendarRange} label="When you travel">
            Season changes what the ground costs, month by month.
          </Factor>
          <Factor icon={Users} label="How many are travelling">
            Party size, room split and whether anyone is travelling alone.
          </Factor>
          <Factor icon={ReceiptText} label="What you add">
            Transfers, excursions and the extensions on either end.
          </Factor>
        </ul>

        <Button asChild className="mt-6 h-11 w-full gap-2 rounded-full">
          <Link href={`/book/${pkg.slug}`}>
            Request a proposal
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          No obligation. We come back within one working day.
        </p>
      </div>
    </div>
  );
}

function Factor({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
      <span className="min-w-0">
        <span className="block text-[12.5px] font-medium">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-muted-foreground">
          {children}
        </span>
      </span>
    </li>
  );
}
