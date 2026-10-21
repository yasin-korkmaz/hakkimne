/**
 * check-rates.mjs — Yayın Öncesi Oran Doğrulama Betiği
 * Dayanak: AGENTS.md Kural 2 & 3 (Doğrulama Kilidi ve Oran Ayrımı)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";

/**
 * isValidUrl — Verilen metnin geçerli bir http(s):// adresi olup olmadığını ve
 * 'DOĞRULANACAK' içermediğini kontrol eder.
 */
function isValidUrl(urlStr) {
  if (typeof urlStr !== "string") return false;
  const trimmed = urlStr.trim();
  if (trimmed.startsWith("DOĞRULANACAK")) return false;
  return /^https?:\/\/.+/i.test(trimmed);
}

/**
 * validateRates — rates.json veri nesnesini 5 zorunlu kurala göre denetler.
 * @param {object} rates
 * @param {Date} [today]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateRates(rates, today = new Date()) {
  const errors = [];
  const todayIso = today.toISOString().slice(0, 10);

  if (!rates || typeof rates !== "object") {
    return { ok: false, errors: ["Geçersiz rates nesnesi."] };
  }

  // (a) Herhangi bir nesnede verified: false olması
  if (rates.stamp_tax?.verified !== true) {
    errors.push("Damga vergisi oranı doğrulanmamış (stamp_tax.verified: false).");
  }
  if (rates.notice_weeks?.verified !== true) {
    errors.push("İhbar haftaları kademeleri doğrulanmamış (notice_weeks.verified: false).");
  }
  if (rates.income_tax_rates_for_estimate?.verified !== true) {
    errors.push("Tahmini gelir vergisi oranları doğrulanmamış (income_tax_rates_for_estimate.verified: false).");
  }

  const periods = Array.isArray(rates.severance_ceiling_periods) ? rates.severance_ceiling_periods : [];
  if (periods.length === 0) {
    errors.push("Hiçbir kıdem tavanı dönemi tanımlanmamış.");
  } else {
    for (const p of periods) {
      if (p.verified !== true) {
        errors.push(`Kıdem tavanı dönemi "${p.period_id}" doğrulanmamış (verified: false).`);
      }
    }
  }

  // (b) source_url değerinin 'DOĞRULANACAK' ile başlaması veya http(s):// ile başlamaması
  if (!isValidUrl(rates.stamp_tax?.source_url)) {
    errors.push(`Damga vergisi kaynak URL'si eksik veya geçersiz: "${rates.stamp_tax?.source_url ?? ""}".`);
  }
  for (const p of periods) {
    if (!isValidUrl(p.source_url)) {
      errors.push(`Kıdem tavanı dönemi "${p.period_id}" kaynak URL'si eksik veya geçersiz: "${p.source_url ?? ""}".`);
    }
  }

  // (c) meta.last_updated tarihinin bugünden itibaren 60 günden daha eski olması
  const lastUpdatedStr = rates.meta?.last_updated;
  if (!lastUpdatedStr || isNaN(new Date(lastUpdatedStr).getTime())) {
    errors.push(`meta.last_updated tarihi geçersiz veya eksik: "${lastUpdatedStr ?? ""}".`);
  } else {
    const lastUpdatedDate = new Date(lastUpdatedStr);
    const diffMs = today.getTime() - lastUpdatedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 60) {
      errors.push(`meta.last_updated tarihi (${lastUpdatedStr}) 60 günden daha eski (${diffDays} gün önce güncellenmiş).`);
    }
  }

  // (d) Bugünün tarihine denk gelen geçerli bir kıdem tavanı döneminin bulunmaması
  const currentPeriod = periods.find(
    (p) => p.from <= todayIso && todayIso <= p.to && p.verified === true && p.amount_try > 0
  );
  if (!currentPeriod) {
    errors.push(`Bugünün tarihine (${todayIso}) denk gelen geçerli (verified: true) bir kıdem tavanı dönemi bulunamadı.`);
  }

  // (e) Bugünden itibaren 45 gün içinde biten dönemden sonraki dönemin tanımlı olmaması
  const activePeriod = periods.find((p) => p.from <= todayIso && todayIso <= p.to);
  if (activePeriod) {
    const endDate = new Date(activePeriod.to);
    const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilEnd <= 45) {
      const nextPeriod = periods.find((p) => p.from > activePeriod.to);
      if (!nextPeriod) {
        errors.push(
          `Mevcut kıdem tavanı dönemi (${activePeriod.period_id}) 45 gün içinde (${daysUntilEnd} gün sonra) bitiyor, ancak sonraki dönem tanımlanmamış.`
        );
      } else if (nextPeriod.verified !== true) {
        errors.push(
          `Sonraki kıdem tavanı dönemi (${nextPeriod.period_id}) tanımlanmış ancak henüz doğrulanmamış (verified: false).`
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function run() {
  const ratesPath = path.resolve(process.cwd(), "src/config/rates.json");
  if (!fs.existsSync(ratesPath)) {
    console.error(`\x1b[31m[HATA] ${ratesPath} dosyası bulunamadı.\x1b[0m`);
    process.exit(1);
  }

  let rates;
  try {
    const raw = fs.readFileSync(ratesPath, "utf-8");
    rates = JSON.parse(raw);
  } catch (err) {
    console.error(`\x1b[31m[HATA] rates.json ayrıştırılamadı:\x1b[0m`, err);
    process.exit(1);
  }

  const result = validateRates(rates);

  if (!result.ok) {
    console.error("\x1b[31m[HATA] Oran doğrulama başarısız oldu:\x1b[0m");
    for (const err of result.errors) {
      console.error(` \x1b[31m×\x1b[0m ${err}`);
    }
    process.exit(1);
  } else {
    console.log("\x1b[32mOK: Tüm oranlar ve kaynaklar doğrulanmış.\x1b[0m");
    process.exit(0);
  }
}

// CLI üzerinden doğrudan çalıştırıldığında run() çağrılır
if (process.argv[1] && url.pathToFileURL(process.argv[1]).href === import.meta.url) {
  run();
}
