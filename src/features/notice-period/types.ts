/**
 * types.ts — İhbar Süresi ve Olası Bitiş Tarihi Tür Tanımları
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 */

import type { Duration } from "@/lib/utils/dateDuration";
import type { RatesConfig } from "@/lib/config/types";

export interface NoticePeriodInput {
  /** İşe giriş tarihi (YYYY-MM-DD) */
  startDate?: string;
  startIso?: string;
  iseGirisTarihi?: string;

  /** Bildirim / Fesih tarihi (YYYY-MM-DD) */
  notificationDate?: string;
  notificationIso?: string;
  noticeDate?: string;
  bildirimTarihi?: string;

  /** İsteğe bağlı yasal oran konfigürasyonu (varsayılan: rates.json) */
  rates?: RatesConfig;
  customWeeks?: Partial<RatesConfig["notice_weeks"]>;
}

export interface NoticePeriodResult {
  ok: true;
  /** İşe giriş tarihi */
  startDate: string;
  /** Bildirim tarihi */
  notificationDate: string;
  /** Hizmet süresi (yıl, ay, gün) */
  duration: Duration;
  /** Hak edilen ihbar süresi (hafta cinsinden: 2, 4, 6, 8) */
  noticeWeeks: number;
  /** Hak edilen ihbar süresi (gün cinsinden: hafta × 7) */
  noticeDays: number;
  /** İhbar süresi sonunda iş sözleşmesinin olası bitiş tarihi (YYYY-MM-DD) */
  endDate: string;
  endDateIso: string;

  // Türkçe erişim takma adları
  kidemSuresi: Duration;
  ihbarHaftasi: number;
  ihbarGunu: number;
  olasiBitisTarihi: string;
}
