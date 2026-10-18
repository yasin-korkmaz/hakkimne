/**
 * compensation.ts — Birleşik Tazminat Hesaplayıcı
 * Hem kıdem (1475 md. 14) hem ihbar (4857 md. 17) hesaplamalarını
 * tek bir çağrıyla çalıştırır; toplamları birleştirir.
 *
 * Algoritma:
 *  1. calculateSeverance ile kıdem tazminatı hesapla.
 *  2. calculateNotice ile ihbar tazminatı hesapla.
 *  3. Her iki sonuç ok: true ise toplam alanları hesapla.
 *  4. Herhangi biri ok: false ise toplam hesaplanmaz; hata sonucu aynen iletilir.
 */

import type { RatesConfig } from "@/lib/config/types";
import type { TerminationReason } from "./severance";
import {
  calculateSeverance,
  type SeveranceOutput,
} from "./severance";
import {
  calculateNotice,
  type NoticeOutput,
} from "./notice";
import { roundToKurus } from "@/lib/utils/money";

// ─── Tipler ──────────────────────────────────────────────────────────────────

export interface CompensationInput {
  startIso: string;
  exitIso: string;
  terminationReason: TerminationReason;
  noticeWorked: boolean;
  grossSalary: number;
  monthlyExtra: number;
  annualBonus: number;
  selectedIncomeTaxRate?: number;
  rates: RatesConfig;
}

export interface CompensationTotals {
  totalGrossSeverance: number;     // Brüt kıdem
  totalGrossNotice: number;        // Brüt ihbar
  totalGross: number;              // Brüt kıdem + brüt ihbar
  totalStampTax: number;           // Kıdem damga + ihbar damga
  totalEstimatedNet: number;       // Net kıdem + tahmini net ihbar
}

export interface CompensationResult {
  ok: true;
  severance: SeveranceOutput;
  notice: NoticeOutput;
  totals: CompensationTotals;
}

export interface CompensationError {
  ok: false;
  code: string;
  message: string;
}

export type CompensationOutput = CompensationResult | CompensationError;

// ─── Ana fonksiyon ────────────────────────────────────────────────────────────

export function calculateCompensation(input: CompensationInput): CompensationOutput {
  const {
    startIso, exitIso, terminationReason, noticeWorked,
    grossSalary, monthlyExtra, annualBonus,
    selectedIncomeTaxRate, rates,
  } = input;

  const severance = calculateSeverance({
    startIso, exitIso, terminationReason,
    grossSalary, monthlyExtra, annualBonus, rates,
  });

  const notice = calculateNotice({
    startIso, exitIso, terminationReason, noticeWorked,
    grossSalary, monthlyExtra, annualBonus,
    selectedIncomeTaxRate, rates,
  });

  // Herhangi bir hesaplamada yapısal hata varsa (kilit başarısız vs.) iletle
  if (!severance.ok) return severance;
  if (!notice.ok)    return notice;

  const sGross = severance.eligible ? severance.grossSeverance : 0;
  const nGross = notice.eligible    ? notice.grossNotice        : 0;
  const sStamp = severance.eligible ? severance.stampTax        : 0;
  const nStamp = notice.eligible    ? notice.stampTax           : 0;
  const sNet   = severance.eligible ? severance.netSeverance    : 0;
  const nNet   = notice.eligible    ? notice.estimatedNetNotice : 0;

  const totals: CompensationTotals = {
    totalGrossSeverance: sGross,
    totalGrossNotice:    nGross,
    totalGross:          roundToKurus(sGross + nGross),
    totalStampTax:       roundToKurus(sStamp + nStamp),
    totalEstimatedNet:   roundToKurus(sNet   + nNet),
  };

  return { ok: true, severance, notice, totals };
}
