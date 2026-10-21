/**
 * ratesSource.ts — Çalışma zamanı oran kaynağı seçicisi.
 * Dayanak: AGENTS.md Kural 2 & Kural 3 (Doğrulama Kilidi ve Oranlar Ayrımı)
 *
 * Algoritma:
 *  1. Eğer process.env.NODE_ENV === 'production' ise HER ZAMAN üretim src/config/rates.json döner.
 *     (NEXT_PUBLIC_USE_TEST_RATES bayrağı true olsa dahi üretimde test verisi kullanılamaz).
 *  2. Geliştirme modunda ve process.env.NEXT_PUBLIC_USE_TEST_RATES === 'true' ise
 *     tests/fixtures/rates.test.json döner ve isTestData: true bayrağı set edilir.
 *  3. Diğer tüm durumlarda üretim src/config/rates.json döner ve isTestData: false olur.
 */

import type { RatesConfig } from "./types";
import productionRates from "@/config/rates.json";
import testRates from "../../../tests/fixtures/rates.test.json";

export interface RatesSourceResult {
  rates: RatesConfig;
  isTestData: boolean;
}

/**
 * getRates — Ortam değişkenlerine göre doğrulanmış üretim veya geliştirme test oranlarını döner.
 */
export function getRates(): RatesSourceResult {
  const isProduction = process.env.NODE_ENV === "production";
  const useTestRates = process.env.NEXT_PUBLIC_USE_TEST_RATES === "true";

  if (!isProduction && useTestRates) {
    return {
      rates: testRates as unknown as RatesConfig,
      isTestData: true,
    };
  }

  return {
    rates: productionRates as unknown as RatesConfig,
    isTestData: false,
  };
}
