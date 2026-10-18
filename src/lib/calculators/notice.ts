/**
 * notice.ts — İhbar Tazminatı Hesaplama Motoru
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 *
 * Algoritma özeti:
 *  1. Damga vergisi ve ihbar haftaları doğrulama kilidi (verifyStampTax + verifyNoticeWeeks).
 *  2. Hak kazanma: yalnızca employer_unfair + noticeWorked === false.
 *  3. Kademe tespiti: compareDurationToMonths ile 6/18/36 ay sınırları.
 *  4. İhbarda kıdem tavanı UYGULANMAZ; giydirilmiş brüt doğrudan kullanılır.
 *  5. Günlük giydirilmiş brüt = giydirilmiş brüt / 30 (ara adımda yuvarlama yapma).
 *  6. Brüt ihbar = günlük × (hafta × 7).
 *  7. Gelir vergisi ve damga vergisi hesaplanır; tahmini net = brüt - gv - dv.
 *  8. Yalnızca nihai parasal çıktılar roundToKurus ile yuvarlanır (DECISIONS.md Karar 3).
 *  9. İhbar kademe haftaları ASLA hardcoded değil; rates.notice_weeks'ten okunur.
 */

import type { RatesConfig } from "@/lib/config/types";
import type { TerminationReason } from "./severance";
import { verifyStampTax, verifyNoticeWeeks } from "@/lib/config/verifyLock";
import { parseIsoDate, compareDurationToMonths } from "@/lib/utils/dateDuration";
import { roundToKurus } from "@/lib/utils/money";

// ─── Tipler ──────────────────────────────────────────────────────────────────

export interface NoticeInput {
  startIso: string;
  exitIso: string;
  terminationReason: TerminationReason;
  noticeWorked: boolean;        // true = ihbar öneli kullandırıldı → eligible: false
  grossSalary: number;
  monthlyExtra: number;
  annualBonus: number;
  selectedIncomeTaxRate?: number; // varsayılan: rates.income_tax_rates_for_estimate.default_rate
  rates: RatesConfig;
}

export interface NoticeResult {
  ok: true;
  eligible: boolean;
  noticeWeeks: number;
  noticeDays: number;
  dressedGross: number;
  dailyGross: number;
  grossNotice: number;
  incomeTax: number;
  stampTax: number;
  estimatedNetNotice: number;
}

export interface NoticeError {
  ok: false;
  code: string;
  message: string;
}

export type NoticeOutput = NoticeResult | NoticeError;

// ─── Kademe tespiti ───────────────────────────────────────────────────────────

/**
 * DECISIONS.md Karar 2 uyarınca ihbar haftası kademesini belirler.
 * compareDurationToMonths kullanılır — eşik değerleri rates'ten okunur.
 * Hardcoded eşik yoktur; hafta sayıları da rates.notice_weeks'ten alınır.
 */
function resolveNoticeWeeks(
  startIso: string,
  exitIso: string,
  nw: RatesConfig["notice_weeks"]
): number {
  // > 36 ay → 8 hafta
  if (compareDurationToMonths(startIso, exitIso, 36) === 1) return nw.more_than_36_months;
  // Tam 36 ay veya 18–36 ay arası → 6 hafta
  if (compareDurationToMonths(startIso, exitIso, 18) !== -1) return nw.from_18_to_36_months;
  // Tam 6 ay veya 6–18 ay arası → 4 hafta
  if (compareDurationToMonths(startIso, exitIso, 6) !== -1) return nw.from_6_to_18_months;
  // < 6 ay → 2 hafta
  return nw.less_than_6_months;
}

// ─── Ana hesaplama fonksiyonu ─────────────────────────────────────────────────

/**
 * calculateNotice — 4857 md. 17 uyarınca ihbar tazminatı hesaplar.
 * Rates parametresi olarak alınır; testler fixture verebilir.
 */
export function calculateNotice(input: NoticeInput): NoticeOutput {
  const {
    startIso, exitIso, terminationReason, noticeWorked,
    grossSalary, monthlyExtra, annualBonus,
    selectedIncomeTaxRate, rates,
  } = input;

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

  // ── Adım 1b: Doğrulama kilitleri ─────────────────────────────────────────
  const stampResult = verifyStampTax(rates);
  if (!stampResult.ok) return stampResult;
  const stampRate = stampResult.value;

  const noticeResult = verifyNoticeWeeks(rates);
  if (!noticeResult.ok) return noticeResult;
  const nw = noticeResult.value;

  // ── Adım 2: Hak kazanma kontrolü ─────────────────────────────────────────
  const eligible = terminationReason === "employer_unfair" && !noticeWorked;
  if (!eligible) {
    return {
      ok: true, eligible: false,
      noticeWeeks: 0, noticeDays: 0,
      dressedGross: 0, dailyGross: 0,
      grossNotice: 0, incomeTax: 0,
      stampTax: 0, estimatedNetNotice: 0,
    };
  }

  // ── Adım 3: Kademe tespiti (rates.notice_weeks'ten okunur) ───────────────
  const noticeWeeks = resolveNoticeWeeks(startIso, exitIso, nw);
  const noticeDays = noticeWeeks * 7;

  // ── Adım 4: Giydirilmiş brüt (tavan uygulanmaz — PRD kesin kural) ────────
  const dressedGross = grossSalary + monthlyExtra + (annualBonus / 12);

  // ── Adım 5: Günlük giydirilmiş brüt (ara değer — yuvarlanmaz) ────────────
  const dailyGross = dressedGross / 30;

  // ── Adım 6: Brüt ihbar (ara değer — yuvarlanmaz) ─────────────────────────
  const grossNoticeRaw = dailyGross * noticeDays;

  // ── Adım 7: Vergiler (ara değerler üzerinden, yuvarlama yok) ─────────────
  const incomeTaxRate = selectedIncomeTaxRate ?? rates.income_tax_rates_for_estimate.default_rate;
  const incomeTaxRaw  = grossNoticeRaw * incomeTaxRate;
  const stampTaxRaw   = grossNoticeRaw * stampRate;
  const netRaw        = grossNoticeRaw - incomeTaxRaw - stampTaxRaw;

  // ── Adım 8: Yalnızca nihai tutarlar yuvarlanır (DECISIONS.md Karar 3) ────
  return {
    ok: true, eligible: true,
    noticeWeeks, noticeDays,
    dressedGross,
    dailyGross: roundToKurus(dailyGross),
    grossNotice:          roundToKurus(grossNoticeRaw),
    incomeTax:            roundToKurus(incomeTaxRaw),
    stampTax:             roundToKurus(stampTaxRaw),
    estimatedNetNotice:   roundToKurus(netRaw),
  };
}
