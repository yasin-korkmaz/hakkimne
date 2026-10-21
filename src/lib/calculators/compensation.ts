/**
 * compensation.ts — Birleşik Tazminat Hesaplama Servisi
 * Dayanak: 1475 Sayılı İş Kanunu Madde 14 & 4857 Sayılı İş Kanunu Madde 17
 *
 * Algoritma:
 *  1. Ham form girdilerini validateInput ile doğrular.
 *  2. Hata varsa status: 'invalid_input' ve fieldErrors döner.
 *  3. Fesih nedeni 'other_unsure' ise status: 'unsure_reason' döner (tutar hesaplanmaz).
 *  4. Kıdem tazminatını (calculateSeverance) çalıştırır; kilit/tarih hatası varsa status: 'blocked' döner.
 *  5. İhbar tazminatını (calculateNotice) çalıştırır; kilit/tarih hatası varsa status: 'blocked' döner.
 *  6. Tüm adımlar başarılıysa status: 'ok', input, severance ve notice sonuçlarını döner.
 */

import type { RatesConfig } from "@/lib/config/types";
import {
  validateInput,
  type RawCompensationInput,
  type ValidatedCompensationInput,
} from "@/lib/utils/validation";
import {
  calculateSeverance,
  type SeveranceResult,
  type TerminationReason,
} from "./severance";
import {
  calculateNotice,
  type NoticeResult,
} from "./notice";
import { roundToKurus } from "@/lib/utils/money";

// ─── Tipler ──────────────────────────────────────────────────────────────────

export interface CompensationTotals {
  totalGrossSeverance: number;     // Brüt kıdem
  totalGrossNotice: number;        // Brüt ihbar
  totalGross: number;              // Brüt kıdem + brüt ihbar
  totalStampTax: number;           // Kıdem damga + ihbar damga
  totalEstimatedNet: number;       // Net kıdem + tahmini net ihbar
}

export type CompensationServiceResult =
  | { status: "invalid_input"; fieldErrors: Record<string, string> }
  | { status: "unsure_reason" }
  | { status: "blocked"; code: string; message: string }
  | {
      status: "ok";
      input: ValidatedCompensationInput;
      severance: SeveranceResult;
      notice: NoticeResult;
    };

/**
 * calculateCompensationTotals — Kıdem ve ihbar sonuçlarından toplam tutarları türetir.
 */
export function calculateCompensationTotals(
  severance: SeveranceResult,
  notice: NoticeResult
): CompensationTotals {
  const sGross = severance.eligible ? severance.grossSeverance : 0;
  const nGross = notice.eligible ? notice.grossNotice : 0;
  const sStamp = severance.eligible ? severance.stampTax : 0;
  const nStamp = notice.eligible ? notice.stampTax : 0;
  const sNet = severance.eligible ? severance.netSeverance : 0;
  const nNet = notice.eligible ? notice.estimatedNetNotice : 0;

  return {
    totalGrossSeverance: sGross,
    totalGrossNotice: nGross,
    totalGross: roundToKurus(sGross + nGross),
    totalStampTax: roundToKurus(sStamp + nStamp),
    totalEstimatedNet: roundToKurus(sNet + nNet),
  };
}

// ─── Ana Servis Fonksiyonu ────────────────────────────────────────────────────

/**
 * calculateCompensation — Birleşik tazminat servisi.
 * Girdi doğrulama, fesih nedeni kontrolü ve kilit kontrollerini tek elden yönetir.
 */
export function calculateCompensation(
  raw: RawCompensationInput,
  rates: RatesConfig
): CompensationServiceResult {
  // 1. Girdi doğrulama
  const validation = validateInput(raw, rates);
  if (!validation.isValid || !validation.data) {
    return {
      status: "invalid_input",
      fieldErrors: validation.fieldErrors,
    };
  }

  const valid = validation.data;

  // 2. Diğer / emin değilim kontrolü
  if (valid.reason === "other_unsure") {
    return {
      status: "unsure_reason",
    };
  }

  // 3. Kıdem Tazminatı Hesaplama
  const severance = calculateSeverance({
    startIso: valid.startIso,
    exitIso: valid.exitIso,
    terminationReason: valid.reason as TerminationReason,
    grossSalary: valid.grossMonthly,
    monthlyExtra: valid.extraMonthly,
    annualBonus: valid.annualBonus,
    rates,
  });

  if (!severance.ok) {
    return {
      status: "blocked",
      code: severance.code,
      message: severance.message,
    };
  }

  // 4. İhbar Tazminatı Hesaplama
  const notice = calculateNotice({
    startIso: valid.startIso,
    exitIso: valid.exitIso,
    terminationReason: valid.reason as TerminationReason,
    noticeWorked: valid.noticeWorked,
    grossSalary: valid.grossMonthly,
    monthlyExtra: valid.extraMonthly,
    annualBonus: valid.annualBonus,
    selectedIncomeTaxRate: valid.incomeTaxRate,
    rates,
  });

  if (!notice.ok) {
    return {
      status: "blocked",
      code: notice.code,
      message: notice.message,
    };
  }

  // 5. Başarılı Sonuç
  return {
    status: "ok",
    input: valid,
    severance,
    notice,
  };
}
