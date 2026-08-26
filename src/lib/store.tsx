"use client";

import * as React from "react";
import type { CurrencyCode } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Currency                                                                   */
/* -------------------------------------------------------------------------- */

/** Indicative rate, refreshed daily in production. Base currency is INR. */
export const USD_PER_INR = 1 / 87.4;

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; locale: string }> = {
  INR: { symbol: "₹", label: "Indian Rupee", locale: "en-IN" },
  USD: { symbol: "$", label: "US Dollar", locale: "en-US" },
};

type CurrencyCtx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  /** Format an INR amount in the active currency. */
  format: (inr: number, opts?: { precise?: boolean }) => string;
  /** Convert without formatting. */
  convert: (inr: number) => number;
};

const CurrencyContext = React.createContext<CurrencyCtx | null>(null);

const STORAGE_EVENT = "ct:storage";

function readRaw(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    /* private mode or blocked storage — behave as if nothing was stored */
    return null;
  }
}

function subscribeToKey(callback: () => void) {
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, onStorage);
  };
}

/**
 * localStorage read through useSyncExternalStore rather than an effect: the
 * server snapshot is always the default, so the first client paint matches the
 * HTML and React swaps in the stored value straight after hydration.
 */
function usePersisted<T>(key: string, initial: T) {
  const raw = React.useSyncExternalStore(
    subscribeToKey,
    () => readRaw(key),
    () => null
  );
  const ready = React.useSyncExternalStore(
    subscribeToKey,
    () => true,
    () => false
  );

  const value = React.useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
    // `initial` is a literal at every call site; re-parsing on its identity would thrash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = (() => {
        const r = readRaw(key);
        if (r === null) return initial;
        try {
          return JSON.parse(r) as T;
        } catch {
          return initial;
        }
      })();
      const resolved = typeof next === "function" ? (next as (p: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* nothing we can do, and nothing that should break the page */
      }
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, setValue, ready] as const;
}

/**
 * Currency display is locked to INR for now — the USD toggle is switched off at
 * the client's request, not removed. To bring it back: restore the persisted
 * state below, re-export <CurrencyToggle> into the header, and undo the
 * single-currency note in the footer. Every consumer already reads `format`
 * and `convert` off this context, so nothing else needs to change.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency: CurrencyCode = "INR";
  const setCurrency = React.useCallback(() => {}, []);

  const value = React.useMemo<CurrencyCtx>(() => {
    const convert = (inr: number) => inr;
    return {
      currency,
      setCurrency,
      convert,
      format: (inr, opts) => {
        const amount = convert(inr);
        const meta = CURRENCIES[currency];
        const fractionDigits = opts?.precise ? 2 : 0;
        return new Intl.NumberFormat(meta.locale, {
          style: "currency",
          currency,
          maximumFractionDigits: fractionDigits,
          minimumFractionDigits: fractionDigits,
        }).format(amount);
      },
    };
  }, [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Saved trips + comparison tray                                              */
/* -------------------------------------------------------------------------- */

export const COMPARE_LIMIT = 3;

type TripsCtx = {
  saved: string[];
  compare: string[];
  ready: boolean;
  isSaved: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
  isComparing: (slug: string) => boolean;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  compareFull: boolean;
};

const TripsContext = React.createContext<TripsCtx | null>(null);

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved, savedReady] = usePersisted<string[]>("ct.saved", []);
  const [compare, setCompare, compareReady] = usePersisted<string[]>("ct.compare", []);

  const value = React.useMemo<TripsCtx>(
    () => ({
      saved,
      compare,
      ready: savedReady && compareReady,
      isSaved: (slug) => saved.includes(slug),
      toggleSaved: (slug) =>
        setSaved((list) =>
          list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]
        ),
      isComparing: (slug) => compare.includes(slug),
      toggleCompare: (slug) =>
        setCompare((list) => {
          if (list.includes(slug)) return list.filter((s) => s !== slug);
          if (list.length >= COMPARE_LIMIT) return [...list.slice(1), slug];
          return [...list, slug];
        }),
      clearCompare: () => setCompare([]),
      compareFull: compare.length >= COMPARE_LIMIT,
    }),
    [saved, compare, savedReady, compareReady, setSaved, setCompare]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = React.useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
