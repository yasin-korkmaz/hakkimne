/**
 * selectCeilingPeriod.ts
 * Çıkış tarihine karşılık gelen kıdem tazminatı tavan dönemini seçer.
 * 1475 Sayılı İş Kanunu Madde 14 kapsamında tavan uygulaması.
 *
 * Algoritma:
 * 1. exitIso YYYY-MM-DD biçiminde değilse veya takvimde geçersizse INVALID_DATE döner.
 * 2. severance_ceiling_periods içinde from <= exitIso <= to koşulunu sağlayan dönemi bulur.
 * 3. Dönem yoksa NO_PERIOD döner.
 * 4. Dönem bulundu ama verified: false ise PERIOD_UNVERIFIED döner.
 * 5. Her iki koşul sağlanırsa { ok: true, period } döner.
 *
 * Tarihler saf metin karşılaştırmasıyla değerlendirilir (DECISIONS.md Karar 1).
 * Varsayılan veya uydurulmuş tavan kullanılmaz (AGENTS.md Kural 3).
 */

import type { RatesConfig, PeriodResult } from "./types";

// YYYY-MM-DD biçimini ve takvim geçerliliğini kontrol eder
function parseIsoDate(s: string): boolean {
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
 * Çıkış tarihine (exitIso) karşılık gelen kıdem tavanı dönemini döner.
 * @param rates - Doğrulanmış RatesConfig nesnesi (parametre olarak alınır; test fixture verebilir)
 * @param exitIso - Çıkış tarihi, YYYY-MM-DD biçiminde
 */
export function selectCeilingPeriod(
  rates: RatesConfig,
  exitIso: string
): PeriodResult {
  // Adım 1: Tarih biçimi ve takvim geçerliliği
  if (!parseIsoDate(exitIso)) {
    return {
      ok: false,
      code: "INVALID_DATE",
      message: `Geçersiz tarih biçimi: "${exitIso}". Lütfen YYYY-AA-GG biçimini kullanın.`,
    };
  }

  // Adım 2: Eşleşen dönemi bul (saf metin karşılaştırması)
  const match = rates.severance_ceiling_periods.find(
    (p) => p.from <= exitIso && exitIso <= p.to
  );

  // Adım 3: Dönem bulunamadı
  if (!match) {
    return {
      ok: false,
      code: "NO_PERIOD",
      message: "Bu tarih için tavan verisi bulunamadı.",
    };
  }

  // Adım 4: Dönem var ama doğrulanmamış
  if (!match.verified) {
    return {
      ok: false,
      code: "PERIOD_UNVERIFIED",
      message: "Bu döneme ait tavan verisi henüz resmî olarak doğrulanmamıştır.",
    };
  }

  // Adım 5: Başarı
  return { ok: true, period: match };
}
