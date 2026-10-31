/**
 * engine.ts — Fazla Çalışma ve Fazla Sürelerle Çalışma Hesaplama Motoru
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Madde 63, Yargıtay İçtihatları
 *
 * Algoritma Özeti:
 *  1. Saatlik brüt ücret = Aylık Brüt Maaş / 225 (4857 md. 41 & Yargıtay 9. HD: 30 gün * 7.5 saat).
 *  2. Fazla Sürelerle Çalışma (Sözleşme < 45 saat ise):
 *     Sözleşme süresi ile 45 saat aralığında yapılan çalışma süreleri için saat başına %25 zamlı ücret ödenir (md. 41/3).
 *     Ücret = Saat × (Saatlik Ücret × 1.25)
 *  3. Fazla Çalışma (45 saati aşan kısım):
 *     Haftalık 45 saati aşan çalışma süreleri için saat başına %50 zamlı ücret ödenir (md. 41/2).
 *     Ücret = Saat × (Saatlik Ücret × 1.50)
 *  4. Nihai parasal çıktılar DECISIONS.md Karar 3 uyarınca roundToKurus ile 2 kuruş hanesine yuvarlanır.
 *
 * Hiçbir çarpan veya bölen koda sabit kilitli değildir; OvertimeConfig ile parametrik yönetilir.
 */

import type { OvertimeConfig, OvertimeInput, OvertimeResult } from "./types";
import { roundToKurus } from "@/lib/utils/money";

export const DEFAULT_OVERTIME_CONFIG: OvertimeConfig = {
  monthlyDivisorHours: 225,
  legalMaxWeeklyHours: 45,
  multiplierOvertime: 1.5,
  multiplierExtraHours: 1.25,
};

/**
 * Fazla mesai ve fazla sürelerle çalışma brüt ücretini hesaplar.
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41
 */
export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const config: OvertimeConfig = {
    ...DEFAULT_OVERTIME_CONFIG,
    ...input.config,
  };

  const grossSalary = input.grossSalary ?? input.brutMaas ?? 0;
  const weeklyContractHours =
    input.weeklyContractHours ?? input.haftalikSozlesmeSaati ?? config.legalMaxWeeklyHours;
  const weeklyWorkedHours =
    input.weeklyWorkedHours ?? input.haftalikCalismaSaati ?? 0;

  if (grossSalary < 0) {
    throw new Error("Aylık brüt maaş negatif olamaz.");
  }
  if (weeklyWorkedHours < 0) {
    throw new Error("Haftalık çalışma saati negatif olamaz.");
  }
  if (weeklyContractHours <= 0) {
    throw new Error("Haftalık sözleşme süresi 0'dan büyük olmalıdır.");
  }
  if (weeklyContractHours > config.legalMaxWeeklyHours) {
    throw new Error(
      `Haftalık sözleşme süresi yasal sınır olan ${config.legalMaxWeeklyHours} saati aşamaz.`
    );
  }

  // 1. Saatlik brüt ücret (Brüt / 225)
  const hourlyGrossRaw = grossSalary / config.monthlyDivisorHours;

  // 2. Fazla sürelerle çalışma (Sözleşme < 45 saat ise ve 45 saate kadar çalışma varsa)
  let extraHours25 = 0;
  if (weeklyContractHours < config.legalMaxWeeklyHours && weeklyWorkedHours > weeklyContractHours) {
    const cappedAt45 = Math.min(weeklyWorkedHours, config.legalMaxWeeklyHours);
    extraHours25 = cappedAt45 - weeklyContractHours;
  }

  // 3. Fazla çalışma (45 saati aşan kısım)
  let extraHours50 = 0;
  if (weeklyWorkedHours > config.legalMaxWeeklyHours) {
    extraHours50 = weeklyWorkedHours - config.legalMaxWeeklyHours;
  }

  // 4. Brüt ücretler (ara adımlarda yuvarlanmaz, formül doğrudan çarpılır)
  const grossPay25Raw = extraHours25 * (hourlyGrossRaw * config.multiplierExtraHours);
  const grossPay50Raw = extraHours50 * (hourlyGrossRaw * config.multiplierOvertime);
  const totalGrossRaw = grossPay25Raw + grossPay50Raw;

  // 5. DECISIONS.md Karar 3: Nihai tutarları kuruşa yuvarla
  const hourlyGrossRate = roundToKurus(hourlyGrossRaw);
  const grossPay25 = roundToKurus(grossPay25Raw);
  const grossPay50 = roundToKurus(grossPay50Raw);
  const totalGrossOvertimePay = roundToKurus(totalGrossRaw);
  const totalOvertimeHours = extraHours25 + extraHours50;

  return {
    ok: true,
    hourlyGrossRate,
    extraHours25,
    extraHours50,
    totalOvertimeHours,
    grossPay25,
    grossPay50,
    totalGrossOvertimePay,
    saatlikUcret: hourlyGrossRate,
    fazlaSureUcreti: grossPay25,
    fazlaCalismaUcreti: grossPay50,
    toplamMesaiUcreti: totalGrossOvertimePay,
    haftalikMesaiSaati: totalOvertimeHours,
  };
}
