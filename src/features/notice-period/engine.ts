/**
 * engine.ts — İhbar Süresi ve Olası Bitiş Tarihi Hesaplama Motoru
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17 (Süreli Fesih)
 *
 * Algoritma Özeti:
 *  1. İşe giriş ve bildirim tarihlerinin geçerliliği kontrol edilir (parseIsoDate).
 *  2. İhbar süreleri kademeleri AGENTS.md Kural 2 gereğince asla sabit (hardcoded)
 *     yazılmaz; rates parametresinden veya ratesSource (rates.json) üzerinden okunur.
 *  3. Hizmet süresi takvim aritmetiğiyle hesaplanır (computeDuration).
 *  4. 4857 md. 17 ve DECISIONS.md Karar 2 uyarınca kademe tespiti yapılır:
 *     - 6 aydan az: 2 hafta (14 gün)
 *     - 6 ay - 1.5 yıl (18 ay dahil): 4 hafta (28 gün)
 *     - 1.5 yıl - 3 yıl (36 ay dahil): 6 hafta (42 gün)
 *     - 3 yıldan fazla: 8 hafta (56 gün)
 *  5. Olası bitiş tarihi, bildirim tarihinin üzerine tam ihbar gün sayısı eklenerek
 *     bulunur (addDays(notificationDate, noticeDays)).
 */

import type { NoticePeriodInput, NoticePeriodResult } from "./types";
import {
  parseIsoDate,
  computeDuration,
  compareDurationToMonths,
  addDays,
} from "@/lib/utils/dateDuration";
import { getRates } from "@/lib/config/ratesSource";

/**
 * Verilen giriş ve bildirim tarihlerine göre ihbar süresini ve olası bitiş tarihini hesaplar.
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 */
export function calculateNoticePeriod(input: NoticePeriodInput): NoticePeriodResult {
  const startDate = input.startDate ?? input.startIso ?? input.iseGirisTarihi;
  const notificationDate =
    input.notificationDate ??
    input.notificationIso ??
    input.noticeDate ??
    input.bildirimTarihi;

  if (!startDate || !notificationDate) {
    throw new Error("İşe giriş tarihi ve bildirim tarihi girilmelidir.");
  }

  if (!parseIsoDate(startDate)) {
    throw new Error(`Geçersiz işe giriş tarihi: "${startDate}"`);
  }

  if (!parseIsoDate(notificationDate)) {
    throw new Error(`Geçersiz bildirim tarihi: "${notificationDate}"`);
  }

  if (notificationDate < startDate) {
    throw new Error(
      `Bildirim tarihi (${notificationDate}) işe giriş tarihinden (${startDate}) önce olamaz.`
    );
  }

  // AGENTS.md Kural 2: Oranlar hardcoded değil, rates üzerinden okunur
  const loadedRates = input.rates ?? getRates().rates;
  const nw = {
    ...loadedRates.notice_weeks,
    ...input.customWeeks,
  };

  // 4857 md. 17 & DECISIONS.md Karar 2: Kademe tespiti
  let noticeWeeks: number;
  if (compareDurationToMonths(startDate, notificationDate, 36) === 1) {
    // > 36 ay (3 yıldan fazla) -> 8 hafta
    noticeWeeks = nw.more_than_36_months;
  } else if (compareDurationToMonths(startDate, notificationDate, 18) === 1) {
    // > 18 ay ve <= 36 ay (36 ay dahil) -> 6 hafta
    noticeWeeks = nw.from_18_to_36_months;
  } else if (compareDurationToMonths(startDate, notificationDate, 6) !== -1) {
    // >= 6 ay ve <= 18 ay (6 ay ve 18 ay dahil) -> 4 hafta
    noticeWeeks = nw.from_6_to_18_months;
  } else {
    // < 6 ay -> 2 hafta
    noticeWeeks = nw.less_than_6_months;
  }

  const duration = computeDuration(startDate, notificationDate);
  const noticeDays = noticeWeeks * 7;
  const endDate = addDays(notificationDate, noticeDays);

  return {
    ok: true,
    startDate,
    notificationDate,
    duration,
    noticeWeeks,
    noticeDays,
    endDate,
    endDateIso: endDate,
    kidemSuresi: duration,
    ihbarHaftasi: noticeWeeks,
    ihbarGunu: noticeDays,
    olasiBitisTarihi: endDate,
  };
}
