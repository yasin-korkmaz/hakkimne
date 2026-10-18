/**
 * verifyLock.ts
 * Doğrulama kilidi: Hesaplama için gereken verilerin verified: true olduğunu kontrol eder.
 * AGENTS.md Kural 3 gereği — verified: false veriyle hesaplama yapılamaz.
 *
 * Kontroller:
 * - verifyStampTax: Kıdem tazminatı için damga vergisi oranı (193 GVK & 488 DVK)
 * - verifyNoticeWeeks: İhbar tazminatı için hafta kademeleri (4857 md. 17)
 * - verifyIncomeTax: Tahmini net hesap için gelir vergisi dilimleri
 */

import type { RatesConfig, ConfigResult } from "./types";

/**
 * Damga vergisi oranının doğrulanmış olduğunu kontrol eder.
 * Kıdem tazminatı hesaplamasında zorunludur (PRD.md: Damga = Brüt * oran).
 */
export function verifyStampTax(rates: RatesConfig): ConfigResult<number> {
  if (!rates.stamp_tax.verified) {
    return {
      ok: false,
      code: "STAMP_TAX_UNVERIFIED",
      message: "Damga vergisi oranı henüz resmî olarak doğrulanmamıştır.",
    };
  }
  return { ok: true, value: rates.stamp_tax.rate };
}

/**
 * İhbar süresi kademelerinin doğrulanmış olduğunu kontrol eder.
 * İhbar tazminatı hesaplamasında zorunludur (4857 md. 17, DECISIONS.md Karar 2).
 */
export function verifyNoticeWeeks(
  rates: RatesConfig
): ConfigResult<RatesConfig["notice_weeks"]> {
  if (!rates.notice_weeks.verified) {
    return {
      ok: false,
      code: "NOTICE_UNVERIFIED",
      message: "İhbar süresi kademeleri henüz resmî olarak doğrulanmamıştır.",
    };
  }
  return { ok: true, value: rates.notice_weeks };
}

/**
 * Tahmini gelir vergisi oranlarının doğrulanmış olduğunu kontrol eder.
 * Yalnızca net tahmin hesabında kullanılır; zorunlu değil, isteğe bağlı gösterim içindir.
 */
export function verifyIncomeTax(
  rates: RatesConfig
): ConfigResult<RatesConfig["income_tax_rates_for_estimate"]> {
  if (!rates.income_tax_rates_for_estimate.verified) {
    return {
      ok: false,
      code: "INCOME_TAX_UNVERIFIED",
      message:
        "Tahmini gelir vergisi dilimleri henüz resmî olarak doğrulanmamıştır.",
    };
  }
  return { ok: true, value: rates.income_tax_rates_for_estimate };
}
