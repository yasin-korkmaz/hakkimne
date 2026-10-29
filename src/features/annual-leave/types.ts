/**
 * types.ts — Yıllık Ücretli İzin Tür Tanımları
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 */

import type { Duration } from "@/lib/utils/dateDuration";

export interface AnnualLeaveBracket {
  /** Asgari kıdem yılı (dahil) */
  fromYear: number;
  /** Azami kıdem yılı (dahil). null ise üst sınır yok */
  toYear: number | null;
  /** Yıllık hak edilen izin günü */
  days: number;
}

export interface AnnualLeaveConfig {
  /** İzne hak kazanmak için gereken asgari hizmet süresi (yıl) */
  minServiceYears: number;
  /** Koruma altındaki yaş grupları için asgari izin günü */
  minProtectedDays: number;
  /** Genç işçi yaş üst sınırı (dahil) */
  youngAgeLimit: number;
  /** Kıdemli işçi yaş alt sınırı (dahil) */
  elderAgeLimit: number;
  /** Hizmet süresi kademeleri */
  brackets: AnnualLeaveBracket[];
}

export interface AnnualLeaveYearDetail {
  /** Hizmet yılı (1, 2, 3...) */
  year: number;
  /** O yıl için hak edilen gün sayısı */
  earnedDays: number;
  /** Yaş koruması (<=18 veya >=50) uygulandı mı? */
  isProtectedAge: boolean;
  /** O hizmet yılı sonundaki yaş (biliniyorsa) */
  ageAtYearEnd?: number;
}

export interface AnnualLeaveInput {
  /** İşe giriş tarihi (YYYY-MM-DD) */
  startDate?: string;
  startIso?: string;
  iseGirisTarihi?: string;

  /** Hesaplama veya işten çıkış tarihi (YYYY-MM-DD) */
  exitDate?: string;
  exitIso?: string;
  cikisTarihi?: string;
  calculationDate?: string;

  /** Doğrudan tamamlanan hizmet yılı (tarih yerine veya yanında) */
  completedYears?: number;

  /** İşçinin yaşı (çıkış/hesaplama tarihindeki) */
  age?: number;
  yas?: number;

  /** Doğum tarihi (YYYY-MM-DD) */
  birthDate?: string;
  birthDateIso?: string;
  dogumTarihi?: string;

  /** Kullanılan toplam yıllık izin günü */
  usedDays?: number;
  usedLeaveDays?: number;
  kullanilanIzinGunu?: number;

  /** Son brüt maaş (TL) */
  grossSalary?: number;
  brutMaas?: number;

  /** Özel yapılandırma (varsayılan: yasal oranlar) */
  config?: Partial<AnnualLeaveConfig>;
}

export interface AnnualLeaveResult {
  ok: true;
  /** Hizmet süresi boyunca hak edilen toplam izin günü */
  totalEarnedDays: number;
  /** Kullanılan izin günü */
  usedDays: number;
  /** Kalan (kullanılmayan) izin günü */
  remainingDays: number;
  /** Günlük brüt ücret (Brüt Maaş / 30) */
  dailyGross: number;
  /** Kullanılmayan izin ücreti brüt tutarı ((Brüt Maaş / 30) * Kalan Gün) */
  grossLeavePay: number;
  /** Tamamlanan hizmet yılı */
  completedYears: number;
  /** Hizmet süresi ayrıntısı (yıl, ay, gün) */
  duration: Duration;
  /** Yıl bazında hak ediş kırılımı */
  breakdown: AnnualLeaveYearDetail[];

  // Türkçe erişim takma adları (test ve kolay erişim)
  hakEdilenToplamGun: number;
  kalanGun: number;
  brutUcret: number;
}
