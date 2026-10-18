/**
 * loadRates.ts
 * Üretim rates.json dosyasını içe aktarır ve yapısal doğrulamasını yapar.
 * Harici paket kullanılmaz; yalnızca TypeScript tip korumaları kullanılır.
 * verified alanları bu katmanda kontrol edilmez — verifyLock.ts sorumludur.
 */

import type { RatesConfig, ConfigResult } from "./types";
import productionRates from "@/config/rates.json";

// YYYY-MM-DD biçimini doğrular; saf metin aritmetiği (DECISIONS.md Karar 1)
function isValidIsoDate(s: unknown): s is string {
  if (typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() + 1 === m &&
    date.getUTCDate() === d
  );
}

/**
 * Ham JSON nesnesinin RatesConfig biçimiyle uyumlu olduğunu doğrular.
 * Geçerliyse { ok: true, value: RatesConfig } döner.
 * Hata varsa { ok: false, code: "CONFIG_INVALID", message } döner.
 */
export function validateRatesConfig(raw: unknown): ConfigResult<RatesConfig> {
  const err = (msg: string): ConfigResult<RatesConfig> => ({
    ok: false,
    code: "CONFIG_INVALID",
    message: msg,
  });

  if (typeof raw !== "object" || raw === null) return err("Yapılandırma nesnesi bulunamadı.");

  const r = raw as Record<string, unknown>;

  // stamp_tax
  if (typeof r["stamp_tax"] !== "object" || r["stamp_tax"] === null) return err("stamp_tax alanı eksik.");
  const st = r["stamp_tax"] as Record<string, unknown>;
  if (typeof st["rate"] !== "number" || st["rate"] <= 0) return err("stamp_tax.rate pozitif sayı olmalıdır.");
  if (typeof st["verified"] !== "boolean") return err("stamp_tax.verified boolean olmalıdır.");

  // severance_ceiling_periods
  if (!Array.isArray(r["severance_ceiling_periods"])) return err("severance_ceiling_periods dizi olmalıdır.");
  const periods = r["severance_ceiling_periods"] as unknown[];
  for (let i = 0; i < periods.length; i++) {
    const p = periods[i] as Record<string, unknown>;
    if (typeof p["period_id"] !== "string") return err(`Dönem ${i}: period_id string olmalıdır.`);
    if (!isValidIsoDate(p["from"])) return err(`Dönem ${p["period_id"] ?? i}: from tarihi geçersiz (${String(p["from"])}).`);
    if (!isValidIsoDate(p["to"])) return err(`Dönem ${p["period_id"] ?? i}: to tarihi geçersiz (${String(p["to"])}).`);
    if ((p["from"] as string) > (p["to"] as string)) return err(`Dönem ${p["period_id"] ?? i}: from tarihi to tarihinden sonra olamaz.`);
    if (typeof p["amount_try"] !== "number" || p["amount_try"] <= 0) return err(`Dönem ${p["period_id"] ?? i}: amount_try pozitif sayı olmalıdır.`);
    if (typeof p["verified"] !== "boolean") return err(`Dönem ${p["period_id"] ?? i}: verified boolean olmalıdır.`);
  }

  // Dönem çakışması kontrolü — O(n²), period sayısı küçük olduğu için kabul edilebilir
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const a = periods[i] as Record<string, unknown>;
      const b = periods[j] as Record<string, unknown>;
      const aFrom = a["from"] as string;
      const aTo = a["to"] as string;
      const bFrom = b["from"] as string;
      const bTo = b["to"] as string;
      if (aFrom <= bTo && bFrom <= aTo) {
        return err(`Dönemler çakışıyor: ${a["period_id"]} ile ${b["period_id"]}.`);
      }
    }
  }

  // notice_weeks
  if (typeof r["notice_weeks"] !== "object" || r["notice_weeks"] === null) return err("notice_weeks alanı eksik.");
  const nw = r["notice_weeks"] as Record<string, unknown>;
  for (const key of ["less_than_6_months", "from_6_to_18_months", "from_18_to_36_months", "more_than_36_months"]) {
    if (typeof nw[key] !== "number") return err(`notice_weeks.${key} sayı olmalıdır.`);
  }
  if (typeof nw["verified"] !== "boolean") return err("notice_weeks.verified boolean olmalıdır.");

  // income_tax_rates_for_estimate
  if (typeof r["income_tax_rates_for_estimate"] !== "object" || r["income_tax_rates_for_estimate"] === null) {
    return err("income_tax_rates_for_estimate alanı eksik.");
  }
  const it = r["income_tax_rates_for_estimate"] as Record<string, unknown>;
  if (!Array.isArray(it["rates"]) || (it["rates"] as unknown[]).some((x) => typeof x !== "number")) {
    return err("income_tax_rates_for_estimate.rates sayı dizisi olmalıdır.");
  }
  if (typeof it["verified"] !== "boolean") return err("income_tax_rates_for_estimate.verified boolean olmalıdır.");

  return { ok: true, value: raw as RatesConfig };
}

/**
 * Üretim rates.json dosyasını yükler ve yapısal doğrulamasını yapar.
 * verified kontrolü yapılmaz — bu verifyLock.ts'in sorumluluğundadır.
 */
export function loadProductionRates(): ConfigResult<RatesConfig> {
  return validateRatesConfig(productionRates);
}
