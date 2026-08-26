"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MONTHS } from "@/lib/pricing";
import {
  EMPTY_ENQUIRY,
  ENQUIRY_REGIONS,
  enquiryReference,
  validateEnquiry,
  type DeskConfig,
  type EnquiryDraft,
  type EnquiryErrors,
} from "@/lib/enquiry";
import { cn } from "@/lib/utils";

/**
 * The corporate/MICE counterpart to the leisure checkout: a qualified brief
 * rather than a name-and-message contact form. Nothing is transmitted — it
 * validates and issues a reference, the same way the booking flow confirms
 * without taking payment.
 */
export function EnquiryForm({ desk }: { desk: DeskConfig }) {
  const [draft, setDraft] = React.useState<EnquiryDraft>(EMPTY_ENQUIRY);
  const [errors, setErrors] = React.useState<EnquiryErrors>({});
  const [reference, setReference] = React.useState<string | null>(null);

  const patch = (p: Partial<EnquiryDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(p)) delete next[k as keyof EnquiryDraft];
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateEnquiry(draft);
    setErrors(found);
    if (Object.keys(found).length === 0) setReference(enquiryReference(desk.refPrefix));
  };

  if (reference) {
    return (
      <div className="rounded-xl border border-gold/50 bg-gold-soft/30 p-8 lg:p-10">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-gold text-ink">
          <Check className="size-5" strokeWidth={2} />
        </span>
        <h3 className="display mt-6 text-[clamp(1.5rem,3vw,2rem)]">Brief received</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Your reference is{" "}
          <span className="tabular font-semibold text-foreground">{reference}</span>. A member of
          the {desk.eyebrow.toLowerCase()} desk will come back to you within one working day with
          questions and an outline of what we would propose.
        </p>
        <p className="mt-6 text-[13px] text-muted-foreground">
          Nothing has been sent yet — this build has no mail service wired to it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href="/about">About Classis</Link>
          </Button>
          <Button
            variant="ghost"
            className="h-11 rounded-full px-6"
            onClick={() => {
              setDraft(EMPTY_ENQUIRY);
              setReference(null);
            }}
          >
            Submit another brief
          </Button>
        </div>
      </div>
    );
  }

  const invalid = Object.keys(errors).length > 0;

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <h3 className="display text-[clamp(1.35rem,2.6vw,1.85rem)]">Send us the brief</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Six answers is enough for us to come back with something useful rather than a
        request for more information.
      </p>

      <div className="mt-8 space-y-6">
        <Choices
          label="What kind of brief"
          required
          error={errors.briefType}
          options={desk.briefTypes}
          value={draft.briefType}
          onChange={(v) => patch({ briefType: v })}
        />

        <Choices
          label="How many people"
          required
          error={errors.size}
          options={desk.sizes}
          value={draft.size}
          onChange={(v) => patch({ size: v })}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Where">
            <select
              value={draft.destination}
              onChange={(e) => patch({ destination: e.target.value })}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Not decided</option>
              {ENQUIRY_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Roughly when">
            <select
              value={draft.month}
              onChange={(e) => patch({ month: e.target.value })}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Not decided</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Company" required error={errors.company}>
            <Input
              value={draft.company}
              onChange={(e) => patch({ company: e.target.value })}
              className="h-11"
              aria-invalid={!!errors.company}
            />
          </Field>

          <Field label="Your name" required error={errors.name}>
            <Input
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="h-11"
              aria-invalid={!!errors.name}
            />
          </Field>

          <Field label="Work email" required error={errors.email}>
            <Input
              type="email"
              value={draft.email}
              onChange={(e) => patch({ email: e.target.value })}
              className="h-11"
              aria-invalid={!!errors.email}
            />
          </Field>

          <Field label="Phone" error={errors.phone}>
            <Input
              type="tel"
              value={draft.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              className="tabular h-11"
              aria-invalid={!!errors.phone}
            />
          </Field>
        </div>

        <Field label="Anything that decides this">
          <Textarea
            value={draft.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            rows={4}
            placeholder="Budget ceiling, board approval dates, a venue you have already looked at, an agenda that cannot move."
          />
        </Field>
      </div>

      {invalid && (
        <p className="mt-6 flex items-start gap-2 text-[13px] text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          Check the highlighted fields and send again.
        </p>
      )}

      <Button type="submit" className="mt-8 h-11 w-full gap-2 rounded-full sm:w-auto sm:px-8">
        Send the brief
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </Label>
      {children}
      {error && <p className="text-[12px] text-destructive">{error}</p>}
    </div>
  );
}

function Choices({
  label,
  required,
  error,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  error?: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={cn(
              "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
              value === o.id
                ? "border-gold bg-gold-soft/50 text-foreground"
                : "border-border text-muted-foreground hover:border-gold/60 hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}
