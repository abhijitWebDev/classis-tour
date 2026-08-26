"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Lock,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartureField, SeasonLegend, Stepper } from "@/components/package/controls";
import { PriceBreakdown } from "@/components/package/price-breakdown";
import { ClosedSeasonNote } from "@/components/package/price-calculator";
import { Photo } from "@/components/site/photo";
import type { Package } from "@/lib/types";
import { quote, endDate } from "@/lib/pricing";
import {
  bookingReference,
  formatDateLong,
  selectionFromParams,
  stripTime,
  type Selection,
} from "@/lib/booking";
import { firstOfMonth } from "@/lib/filters";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Dates & travellers" },
  { id: 2, label: "Rooms & additions" },
  { id: 3, label: "Who is travelling" },
  { id: 4, label: "Deposit" },
];

const DEPOSIT_RATE = 0.2;

type Lead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
};

const EMPTY_LEAD: Lead = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "India",
  notes: "",
};

export function BookingFlow({ pkg }: { pkg: Package }) {
  const params = useSearchParams();
  const { format } = useCurrency();

  const [sel, setSel] = React.useState<Selection>(() =>
    selectionFromParams(pkg, new URLSearchParams(params.toString()))
  );
  const [step, setStep] = React.useState(1);
  const [lead, setLead] = React.useState<Lead>(EMPTY_LEAD);
  const [payMode, setPayMode] = React.useState<"deposit" | "full">("deposit");
  const [agreed, setAgreed] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const patch = (p: Partial<Selection>) => setSel((s) => ({ ...s, ...p }));

  const q = React.useMemo(
    () =>
      quote({
        pkg,
        adults: sel.adults,
        children: sel.children,
        start: sel.start,
        roomId: sel.roomId,
        addOnIds: sel.addOnIds,
      }),
    [pkg, sel]
  );

  const dueNow = payMode === "deposit" ? Math.round(q.total * DEPOSIT_RATE) : q.total;
  const balance = q.total - dueNow;
  const balanceDue = new Date(sel.start);
  balanceDue.setDate(balanceDue.getDate() - 45);

  const leadValid =
    lead.firstName.trim().length > 1 &&
    lead.lastName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) &&
    lead.phone.replace(/\D/g, "").length >= 8;

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, submitted]);

  if (submitted) {
    return (
      <Confirmation
        pkg={pkg}
        sel={sel}
        lead={lead}
        total={q.total}
        dueNow={dueNow}
        balance={balance}
        balanceDue={balanceDue}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 lg:px-10">
      <StepRail step={step} onJump={(s) => s < step && setStep(s)} />

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0">
          {/* ------------------------------------------------- step 1 */}
          {step === 1 && (
            <StepBody
              title="When, and how many of you"
              note="Every figure on the right recalculates as you change these. Dates that are greyed out are outside the operating season for this journey."
            >
              {q.closed && <ClosedSeasonNote pkg={pkg} start={sel.start} />}

              <div className="mt-6 max-w-lg space-y-5">
                <DepartureField pkg={pkg} value={sel.start} onChange={(d) => patch({ start: d })} />
                <div className="rounded-lg border border-border bg-card p-4">
                  <span className="eyebrow">Twelve-month rate map</span>
                  <SeasonLegend
                    pkg={pkg}
                    className="mt-3"
                    onPick={(m) => patch({ start: stripTime(firstOfMonth(m)) })}
                  />
                  <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
                    Click a month to move your departure. Returning{" "}
                    <span className="tabular font-medium text-foreground">
                      {formatDateLong(endDate(sel.start, pkg.nights))}
                    </span>
                    .
                  </p>
                </div>

                <div className="space-y-4 rounded-lg border border-border bg-card p-4">
                  <Stepper
                    label="Adults"
                    hint="12 and over"
                    value={sel.adults}
                    min={1}
                    max={pkg.groupSizeMax - sel.children}
                    onChange={(v) => patch({ adults: v })}
                  />
                  <Stepper
                    label="Children"
                    hint="Under 12 — 65% of the adult land rate"
                    value={sel.children}
                    min={0}
                    max={pkg.groupSizeMax - sel.adults}
                    onChange={(v) => patch({ children: v })}
                  />
                  {q.travellers >= 4 && (
                    <p className="rounded-md bg-emerald-50 px-3 py-2 text-[11.5px] font-medium text-emerald-800">
                      Group saving applied — {q.travellers} travelling together.
                    </p>
                  )}
                </div>
              </div>
            </StepBody>
          )}

          {/* ------------------------------------------------- step 2 */}
          {step === 2 && (
            <StepBody
              title="Where you sleep, and what you add"
              note="Room choice is applied at every property on the route, not just the first night."
            >
              <div className="mt-6 space-y-3">
                <span className="eyebrow">Accommodation</span>
                <RadioGroup value={sel.roomId} onValueChange={(v) => patch({ roomId: v })} className="gap-3">
                  {pkg.rooms.map((r) => (
                    <label
                      key={r.id}
                      className={cn(
                        "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors",
                        sel.roomId === r.id ? "border-gold bg-gold-soft/40" : "border-border hover:border-gold/60"
                      )}
                    >
                      <RadioGroupItem value={r.id} className="mt-1" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-[15px] font-medium">{r.name}</span>
                          <span className="tabular text-[12px] text-muted-foreground">
                            {r.multiplier === 1
                              ? "Included in the base price"
                              : `+${Math.round((r.multiplier - 1) * 100)}% on land arrangements`}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-muted-foreground">
                          {r.description}
                        </span>
                        <span className="tabular mt-2 block text-[11px] text-muted-foreground">
                          Sleeps up to {r.maxAdults} adults ·{" "}
                          {Math.max(1, Math.ceil(sel.adults / r.maxAdults))} room
                          {Math.ceil(sel.adults / r.maxAdults) > 1 ? "s" : ""} for your party
                        </span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="mt-10 space-y-3">
                <span className="eyebrow">Optional additions</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pkg.addOns.map((a) => {
                    const on = sel.addOnIds.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                          on ? "border-gold bg-gold-soft/40" : "border-border hover:border-gold/60"
                        )}
                      >
                        <Checkbox
                          checked={on}
                          onCheckedChange={(c) =>
                            patch({
                              addOnIds: c
                                ? [...sel.addOnIds, a.id]
                                : sel.addOnIds.filter((x) => x !== a.id),
                            })
                          }
                          className="mt-0.5"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-medium">{a.name}</span>
                          <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                            {a.description}
                          </span>
                          <span className="tabular mt-2 block text-[12px] font-semibold">
                            {a.price === 0 ? "No extra charge" : format(a.price)}
                            <span className="font-normal text-muted-foreground">
                              {a.unit === "per-traveller" && a.price > 0
                                ? ` · per traveller (${format(a.price * q.travellers)} total)`
                                : " · per booking"}
                            </span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </StepBody>
          )}

          {/* ------------------------------------------------- step 3 */}
          {step === 3 && (
            <StepBody
              title="Who is travelling"
              note="We only need the lead traveller now. Passport details for everyone follow by secure link once the deposit clears."
            >
              <div className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
                <Field label="First name" required>
                  <Input
                    value={lead.firstName}
                    onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                    className="h-11"
                    autoComplete="given-name"
                  />
                </Field>
                <Field label="Last name" required>
                  <Input
                    value={lead.lastName}
                    onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
                    className="h-11"
                    autoComplete="family-name"
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="h-11"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone" required>
                  <Input
                    type="tel"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="h-11"
                    autoComplete="tel"
                    placeholder="+91 98200 00000"
                  />
                </Field>
                <Field label="Country of residence">
                  <Select value={lead.country} onValueChange={(v) => setLead({ ...lead, country: v })}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore", "Australia", "Other"].map(
                        (c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything we should plan around">
                    <textarea
                      value={lead.notes}
                      onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                      rows={4}
                      placeholder="Dietary requirements, mobility, an anniversary, a fear of small aircraft — all of it is useful."
                      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </Field>
                </div>
              </div>

              {touched && !leadValid && (
                <p className="mt-4 text-[12.5px] text-destructive">
                  Please complete name, a valid email and a contactable phone number.
                </p>
              )}
            </StepBody>
          )}

          {/* ------------------------------------------------- step 4 */}
          {step === 4 && (
            <StepBody
              title="Confirm and pay the deposit"
              note="A 20% deposit confirms the dates and starts the permit work. The balance is due 45 days before departure."
            >
              <div className="mt-6 max-w-2xl space-y-6">
                <RadioGroup
                  value={payMode}
                  onValueChange={(v) => setPayMode(v as "deposit" | "full")}
                  className="gap-3"
                >
                  <PayOption
                    value="deposit"
                    active={payMode === "deposit"}
                    title={`Pay ${format(Math.round(q.total * DEPOSIT_RATE))} deposit now`}
                    detail={`Balance of ${format(q.total - Math.round(q.total * DEPOSIT_RATE))} due ${formatDateLong(balanceDue)}`}
                  />
                  <PayOption
                    value="full"
                    active={payMode === "full"}
                    title={`Pay ${format(q.total)} in full`}
                    detail="Nothing further to pay. Free date change up to 60 days before departure."
                  />
                </RadioGroup>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" strokeWidth={1.6} />
                    <span className="text-[13px] font-medium">Card details</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Lock className="size-3" /> Encrypted
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Card number">
                        <Input placeholder="4242 4242 4242 4242" className="tabular h-11" inputMode="numeric" />
                      </Field>
                    </div>
                    <Field label="Expiry">
                      <Input placeholder="MM / YY" className="tabular h-11" inputMode="numeric" />
                    </Field>
                    <Field label="CVC">
                      <Input placeholder="123" className="tabular h-11" inputMode="numeric" />
                    </Field>
                  </div>
                  <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
                    This is a demonstration build — no card is charged and nothing entered
                    here is transmitted or stored.
                  </p>
                </div>

                <label className="flex cursor-pointer gap-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  <Checkbox checked={agreed} onCheckedChange={(c) => setAgreed(Boolean(c))} className="mt-0.5" />
                  <span>
                    I have read the booking conditions, the cancellation schedule and the
                    insurance requirement. I understand travel insurance is mandatory on
                    this journey.
                  </span>
                </label>
              </div>
            </StepBody>
          )}

          {/* ------------------------------------------------- nav */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="h-11 gap-2 rounded-full px-5">
                <ArrowLeft className="size-4" />
                Back
              </Button>
            ) : (
              <Button asChild variant="ghost" className="h-11 gap-2 rounded-full px-4">
                <Link href={`/packages/${pkg.slug}`}>
                  <ArrowLeft className="size-4" />
                  Back to the journey
                </Link>
              </Button>
            )}

            {step < 4 ? (
              <Button
                className="h-11 gap-2 rounded-full px-6"
                disabled={step === 1 && q.closed}
                onClick={() => {
                  if (step === 3) {
                    setTouched(true);
                    if (!leadValid) return;
                  }
                  setStep(step + 1);
                }}
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                className="h-11 gap-2 rounded-full px-6"
                disabled={!agreed}
                onClick={() => setSubmitted(true)}
              >
                <Lock className="size-4" />
                Confirm — {format(dueNow)}
              </Button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------- summary */}
        <aside>
          <div className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex gap-4 border-b border-border p-4">
                <span className="size-16 shrink-0 overflow-hidden rounded-md bg-sand">
                  <Photo src={pkg.hero} fallbackSeed={pkg.slug} alt="" className="size-16" />
                </span>
                <span className="min-w-0">
                  <span className="display block text-[17px] leading-tight">{pkg.name}</span>
                  <span className="tabular mt-1 block text-[11.5px] text-muted-foreground">
                    {formatDateLong(sel.start)} → {formatDateLong(endDate(sel.start, pkg.nights))}
                  </span>
                  <span className="tabular mt-0.5 block text-[11.5px] text-muted-foreground">
                    {sel.adults} adults{sel.children > 0 && `, ${sel.children} children`} ·{" "}
                    {pkg.rooms.find((r) => r.id === sel.roomId)!.name}
                  </span>
                </span>
              </div>
              <div className="p-4">
                <PriceBreakdown quote={q} compact />
              </div>
              {step === 4 && (
                <div className="border-t border-border bg-[color-mix(in_oklch,var(--card),var(--foreground)_3%)] p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-medium">Due now</span>
                    <span className="tabular display text-2xl">{format(dueNow)}</span>
                  </div>
                  {balance > 0 && (
                    <p className="tabular mt-1.5 text-[11.5px] text-muted-foreground">
                      {format(balance)} due {formatDateLong(balanceDue)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              Free cancellation for 48 hours after the deposit. Full schedule in the
              booking conditions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function StepRail({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-border pb-5">
      {STEPS.map((s, i) => {
        const done = s.id < step;
        const current = s.id === step;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onJump(s.id)}
              disabled={!done}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                current && "border-foreground bg-foreground text-background",
                done && "border-gold bg-gold-soft/50 text-foreground hover:border-foreground",
                !done && !current && "border-border text-muted-foreground"
              )}
            >
              <span className="tabular inline-flex size-4 items-center justify-center">
                {done ? <Check className="size-3.5" /> : s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="hidden h-px w-5 bg-border sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}

function StepBody({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="display text-[clamp(1.75rem,3.4vw,2.5rem)]">{title}</h2>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{note}</p>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </Label>
      {children}
    </div>
  );
}

function PayOption({
  value,
  active,
  title,
  detail,
}: {
  value: string;
  active: boolean;
  title: string;
  detail: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors",
        active ? "border-gold bg-gold-soft/40" : "border-border hover:border-gold/60"
      )}
    >
      <RadioGroupItem value={value} className="mt-1" />
      <span>
        <span className="tabular block text-[15px] font-medium">{title}</span>
        <span className="tabular mt-1 block text-[12.5px] text-muted-foreground">{detail}</span>
      </span>
    </label>
  );
}

function Confirmation({
  pkg,
  sel,
  lead,
  total,
  dueNow,
  balance,
  balanceDue,
}: {
  pkg: Package;
  sel: Selection;
  lead: Lead;
  total: number;
  dueNow: number;
  balance: number;
  balanceDue: Date;
}) {
  const { format } = useCurrency();
  const ref = bookingReference(pkg, sel);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 lg:px-10">
      <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
        <BadgeCheck className="size-10 text-gold" strokeWidth={1.2} />
        <h1 className="display mt-6 text-[clamp(2rem,4.5vw,3rem)]">
          Held. Your journey is confirmed.
        </h1>
        <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">
          A confirmation is on its way to{" "}
          <span className="font-medium text-foreground">{lead.email || "your inbox"}</span>. Your
          journey designer, who has run this route eleven times, will call within one
          business day to start on permits and seats.
        </p>

        <dl className="tabular mt-9 grid gap-x-8 gap-y-5 border-y border-border py-7 sm:grid-cols-2">
          <Row label="Booking reference" value={ref} strong />
          <Row label="Journey" value={pkg.name} />
          <Row label="Departure" value={formatDateLong(sel.start)} />
          <Row label="Return" value={formatDateLong(endDate(sel.start, pkg.nights))} />
          <Row
            label="Travellers"
            value={`${sel.adults} adults${sel.children ? `, ${sel.children} children` : ""}`}
          />
          <Row label="Accommodation" value={pkg.rooms.find((r) => r.id === sel.roomId)!.name} />
          <Row label="Paid today" value={format(dueNow)} strong />
          <Row
            label={balance > 0 ? "Balance" : "Outstanding"}
            value={balance > 0 ? `${format(balance)} by ${formatDateLong(balanceDue)}` : "Nothing further"}
          />
          <Row label="Trip total" value={format(total)} strong />
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/packages">Browse other journeys</Link>
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full px-5" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print this page
          </Button>
          <Button asChild variant="ghost" className="h-11 rounded-full px-5">
            <Link href="/saved">Your saved trips</Link>
          </Button>
        </div>

        <p className="mt-8 text-[11.5px] leading-relaxed text-muted-foreground">
          Demonstration build — no payment has been taken and no personal data has left
          this browser.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{label}</dt>
      <dd className={cn("mt-1 text-[14px]", strong ? "font-semibold" : "font-normal")}>{value}</dd>
    </div>
  );
}
