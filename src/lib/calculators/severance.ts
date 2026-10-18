/**
 * severance.ts — Kıdem Tazminatı Hesaplama Motoru
 * Dayanak: 1475 Sayılı İş Kanunu Madde 14
 *
 * Algoritma özeti:
 *  1. Tarihler ve kilit doğrulaması (verifyStampTax + selectCeilingPeriod).
 *  2. Fesih nedenine göre hak kazanma kontrolü.
 *  3. 1 tam yıldan az çalışmada hak yok.
 *  4. Giydirilmiş brüt = grossSalary + monthlyExtra + (annualBonus / 12).
 *  5. Baz = min(giydirilmiş brüt, dönem tavanı).
 *  6. Brüt kıdem = yıl×baz + ay×(baz/12) + gün×(baz/365).
 *  7. Damga vergisi = brüt kıdem × damga oranı.
 *  8. Net kıdem = brüt kıdem − damga vergisi.
 *  9. Yalnızca nihai parasal çıktılar roundToKurus ile yuvarlanır (DECISIONS.md Karar 3).
 *
 * Hiçbir oran veya tavan sabit (hardcoded) değildir; tümü rates parametresinden okunur.
 */

import type { RatesConfig } from "@/lib/config/types";
import { verifyStampTax } from "@/lib/config/verifyLock";
import { selectCeilingPeriod } from "@/lib/config/selectCeilingPeriod";
import { parseIsoDate, computeDuration } from "@/lib/utils/dateDuration";
import { roundToKurus } from "@/lib/utils/money";

// ─── Tipler ──────────────────────────────────────────────────────────────────

export type TerminationReason =
  | "employer_unfair"
  | "employee_just_cause"
  | "retirement_military_marriage"
  | "voluntary_resignation"
  | "employer_just_cause";

export interface SeveranceInput {
  startIso: string;
  exitIso: string;
  terminationReason: TerminationReason;
  grossSalary: number;
  monthlyExtra: number;
  annualBonus: number;
  rates: RatesConfig;
}

export type SeveranceReasonCode =
  | "TERMINATION_NOT_ELIGIBLE"
  | "UNDER_ONE_YEAR";

export interface SeveranceResult {
  ok: true;
  eligible: boolean;
  reasonCode?: SeveranceReasonCode;
  dressedGross: number;          // Giydirilmiş brüt
  ceilingApplied: boolean;       // Tavan uygulandı mı?
  base: number;                  // Kıdem bazı (tavan sonrası)
  grossSeverance: number;        // Brüt kıdem tazminatı
  stampTax: number;              // Damga vergisi
  netSeverance: number;          // Net kıdem tazminatı
  periodId: string;              // Hangi dönem tavanı kullanıldı
  duration: { years: number; months: number; days: number };
}

export interface SeveranceError {
  ok: false;
  code: string;
  message: string;
}

export type SeveranceOutput = SeveranceResult | SeveranceError;

// ─── Hak kazanmayan fesih nedenleri ──────────────────────────────────────────

const NOT_ELIGIBLE_REASONS = new Set<TerminationReason>([
  "voluntary_resignation",
  "employer_just_cause",
]);

// ─── Ana hesaplama fonksiyonu ─────────────────────────────────────────────────

/**
 * calculateSeverance — 1475 md. 14 uyarınca kıdem tazminatı hesaplar.
 * Rates parametresi olarak alınır; testler fixture verebilir.
 */
export function calculateSeverance(input: SeveranceInput): SeveranceOutput {
  const { startIso, exitIso, terminationReason, grossSalary,
          monthlyExtra, annualBonus, rates } = input;

  // ── Adım 1a: Tarih doğrulaması ────────────────────────────────────────────
  if (!parseIsoDate(startIso)) {
    return { ok: false, code: "INVALID_DATE", message: `Geçersiz giriş tarihi: "${startIso}"` };
  }
  if (!parseIsoDate(exitIso)) {
    return { ok: false, code: "INVALID_DATE", message: `Geçersiz çıkış tarihi: "${exitIso}"` };
  }
  if (exitIso < startIso) {
    return { ok: false, code: "INVALID_DATE", message: "Çıkış tarihi giriş tarihinden önce olamaz." };
  }

  // ── Adım 1b: Damga vergisi doğrulama kilidi ───────────────────────────────
  const stampResult = verifyStampTax(rates);
  if (!stampResult.ok) return stampResult;
  const stampRate = stampResult.value;

  // ── Adım 1c: Dönem tavan seçimi ve doğrulama kilidi ──────────────────────
  const periodResult = selectCeilingPeriod(rates, exitIso);
  if (!periodResult.ok) return periodResult;
  const period = periodResult.period;

  // ── Adım 2: Hak kazanma — fesih nedeni ───────────────────────────────────
  if (NOT_ELIGIBLE_REASONS.has(terminationReason)) {
    const duration = computeDuration(startIso, exitIso);
    return {
      ok: true, eligible: false,
      reasonCode: "TERMINATION_NOT_ELIGIBLE",
      dressedGross: 0, ceilingApplied: false, base: 0,
      grossSeverance: 0, stampTax: 0, netSeverance: 0,
      periodId: period.period_id, duration,
    };
  }

  // ── Adım 3: Süre hesabı ve 1 yıl koşulu ──────────────────────────────────
  const duration = computeDuration(startIso, exitIso);
  if (duration.years < 1) {
    return {
      ok: true, eligible: false,
      reasonCode: "UNDER_ONE_YEAR",
      dressedGross: 0, ceilingApplied: false, base: 0,
      grossSeverance: 0, stampTax: 0, netSeverance: 0,
      periodId: period.period_id, duration,
    };
  }

  // ── Adım 4: Giydirilmiş brüt (ara değer — yuvarlanmaz) ───────────────────
  const dressedGross = grossSalary + monthlyExtra + (annualBonus / 12);

  // ── Adım 5: Kıdem bazı ve tavan kontrolü ─────────────────────────────────
  const ceilingApplied = dressedGross > period.amount_try;
  const base = ceilingApplied ? period.amount_try : dressedGross;

  // ── Adım 6: Brüt kıdem tazminatı (ara değer — yuvarlanmaz) ───────────────
  const grossSeveranceRaw =
    (duration.years  * base) +
    (duration.months * (base / 12)) +
    (duration.days   * (base / 365));

  // ── Adım 7–9: Nihai tutarlar — yalnızca burada yuvarlama ─────────────────
  const grossSeverance = roundToKurus(grossSeveranceRaw);
  const stampTax       = roundToKurus(grossSeverance * stampRate);
  const netSeverance   = roundToKurus(grossSeverance - stampTax);

  return {
    ok: true, eligible: true,
    dressedGross, ceilingApplied,
    base: roundToKurus(base),
    grossSeverance, stampTax, netSeverance,
    periodId: period.period_id, duration,
  };
}
