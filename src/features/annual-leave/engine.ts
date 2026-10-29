/**
 * engine.ts — Yıllık Ücretli İzin ve İzin Ücreti Hesaplama Motoru
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 *
 * Algoritma Özeti:
 *  1. Hizmet süresi hesabı: İşe giriş ve çıkış tarihleri arasındaki tam tamamlanan
 *     hizmet yılları (kıdem) esas alınır (4857 md. 53/1).
 *  2. Kıdem kuralı: 1 tam yıldan az çalışanlar izne hak kazanamaz (kıstelyevm uygulanmaz).
 *  3. Kademeler:
 *     - 1 yıldan 5 yıla kadar (5 dahil): 14 gün
 *     - 5 yıldan fazla 15 yıldan az: 20 gün
 *     - 15 yıl (dahil) ve daha fazla: 26 gün
 *  4. Yaş istisnası: 18 ve daha küçük yaştaki işçilerle 50 ve daha yukarı yaştaki
 *     işçilere verilecek yıllık ücretli izin süresi 20 günden az olamaz (md. 53/5).
 *  5. Kullanılmayan gün: Hak edilen toplam gün − kullanılan gün (negatife düşmez).
 *  6. Günlük brüt ücret: Son brüt maaş / 30.
 *  7. Brüt izin ücreti: Günlük brüt ücret × Kalan gün (DECISIONS.md Karar 3 uyarınca kuruşa yuvarlanır).
 *
 * Hiçbir oran veya gün sayısı koda kilitli değildir; yapılandırma (config) ile yönetilebilir.
 */

import type {
  AnnualLeaveConfig,
  AnnualLeaveInput,
  AnnualLeaveResult,
  AnnualLeaveYearDetail,
} from "./types";
import {
  parseIsoDate,
  computeDuration,
  addYearsClamped,
  type Duration,
} from "@/lib/utils/dateDuration";
import { roundToKurus } from "@/lib/utils/money";

export const DEFAULT_ANNUAL_LEAVE_CONFIG: AnnualLeaveConfig = {
  minServiceYears: 1,
  minProtectedDays: 20,
  youngAgeLimit: 18,
  elderAgeLimit: 50,
  brackets: [
    { fromYear: 1, toYear: 5, days: 14 },
    { fromYear: 6, toYear: 14, days: 20 },
    { fromYear: 15, toYear: null, days: 26 },
  ],
};

/**
 * Belirli bir hizmet yılı için yasal hak edilen gün sayısını döner.
 * Dayanak: 4857 Sayılı İş Kanunu Md. 53
 */
export function getDaysForServiceYear(
  year: number,
  age?: number,
  config: AnnualLeaveConfig = DEFAULT_ANNUAL_LEAVE_CONFIG
): { days: number; isProtectedAge: boolean } {
  if (year < config.minServiceYears) {
    return { days: 0, isProtectedAge: false };
  }

  let baseDays = 14;
  for (const bracket of config.brackets) {
    const minOk = year >= bracket.fromYear;
    const maxOk = bracket.toYear === null || year <= bracket.toYear;
    if (minOk && maxOk) {
      baseDays = bracket.days;
      break;
    }
  }

  const isProtected =
    age !== undefined &&
    (age <= config.youngAgeLimit || age >= config.elderAgeLimit);

  const finalDays = isProtected
    ? Math.max(baseDays, config.minProtectedDays)
    : baseDays;

  return { days: finalDays, isProtectedAge: isProtected };
}

/**
 * Yıllık izin gün ve ücret hesaplamasını gerçekleştirir.
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 */
export function calculateAnnualLeave(
  input: AnnualLeaveInput
): AnnualLeaveResult {
  const config: AnnualLeaveConfig = {
    ...DEFAULT_ANNUAL_LEAVE_CONFIG,
    ...input.config,
  };

  const startDate = input.startDate ?? input.startIso ?? input.iseGirisTarihi;
  const exitDate =
    input.exitDate ??
    input.exitIso ??
    input.cikisTarihi ??
    input.calculationDate;
  const birthDate =
    input.birthDate ?? input.birthDateIso ?? input.dogumTarihi;
  const age = input.age ?? input.yas;
  const usedDays =
    input.usedDays ?? input.usedLeaveDays ?? input.kullanilanIzinGunu ?? 0;
  const grossSalary = input.grossSalary ?? input.brutMaas ?? 0;

  if (grossSalary < 0) throw new Error("Brüt maaş negatif olamaz.");
  if (usedDays < 0) throw new Error("Kullanılan izin günü negatif olamaz.");
  if (age !== undefined && age < 0) throw new Error("Yaş negatif olamaz.");

  let duration: Duration;
  let completedYears: number;

  if (input.completedYears !== undefined) {
    if (input.completedYears < 0) {
      throw new Error("Tamamlanan hizmet yılı negatif olamaz.");
    }
    completedYears = Math.floor(input.completedYears);
    duration = { years: completedYears, months: 0, days: 0 };
  } else {
    if (!startDate || !exitDate) {
      throw new Error("İşe giriş ve çıkış tarihleri veya hizmet yılı girilmelidir.");
    }
    if (!parseIsoDate(startDate)) {
      throw new Error(`Geçersiz işe giriş tarihi: "${startDate}"`);
    }
    if (!parseIsoDate(exitDate)) {
      throw new Error(`Geçersiz çıkış tarihi: "${exitDate}"`);
    }
    if (exitDate < startDate) {
      throw new Error(`Çıkış tarihi (${exitDate}) giriş tarihinden (${startDate}) önce olamaz.`);
    }
    duration = computeDuration(startDate, exitDate);
    completedYears = duration.years;
  }

  const breakdown: AnnualLeaveYearDetail[] = [];
  let totalEarnedDays = 0;

  if (completedYears >= config.minServiceYears) {
    for (let y = 1; y <= completedYears; y++) {
      let ageAtYear: number | undefined;
      if (birthDate && startDate) {
        const anniversary = addYearsClamped(startDate, y);
        ageAtYear = computeDuration(birthDate, anniversary).years;
      } else if (age !== undefined) {
        ageAtYear = age - (completedYears - y);
      }

      const { days, isProtectedAge } = getDaysForServiceYear(
        y,
        ageAtYear,
        config
      );
      totalEarnedDays += days;
      breakdown.push({
        year: y,
        earnedDays: days,
        isProtectedAge,
        ageAtYearEnd: ageAtYear,
      });
    }
  }

  const remainingDays = Math.max(0, totalEarnedDays - usedDays);
  const dailyGross = grossSalary / 30;
  const grossLeavePay = roundToKurus(dailyGross * remainingDays);

  return {
    ok: true,
    totalEarnedDays,
    usedDays,
    remainingDays,
    dailyGross: roundToKurus(dailyGross),
    grossLeavePay,
    completedYears,
    duration,
    breakdown,
    hakEdilenToplamGun: totalEarnedDays,
    kalanGun: remainingDays,
    brutUcret: grossLeavePay,
  };
}
