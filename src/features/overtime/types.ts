/**
 * types.ts — Fazla Çalışma ve Fazla Sürelerle Çalışma Tür Tanımları
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Yargıtay İçtihatları
 */

export interface OvertimeConfig {
  /** Aylık standart çalışma saati böleni (30 gün * 7.5 saat = 225 saat) */
  monthlyDivisorHours: number;
  /** Yasal azami haftalık normal çalışma süresi (saat, md. 63) */
  legalMaxWeeklyHours: number;
  /** Fazla çalışma saat ücreti çarpanı (Normal ücret + %50, md. 41/2) */
  multiplierOvertime: number;
  /** Fazla sürelerle çalışma saat ücreti çarpanı (Normal ücret + %25, md. 41/3) */
  multiplierExtraHours: number;
}

export interface OvertimeInput {
  /** Aylık brüt maaş (TL) */
  grossSalary: number;
  /** Haftalık sözleşme süresi (saat, varsayılan: 45) */
  weeklyContractHours?: number;
  /** Haftalık gerçekleşen toplam çalışma saati */
  weeklyWorkedHours: number;
  /** Özel yapılandırma parametreleri */
  config?: Partial<OvertimeConfig>;

  // Türkçe erişim alanları (opsiyonel)
  brutMaas?: number;
  haftalikSozlesmeSaati?: number;
  haftalikCalismaSaati?: number;
}

export interface OvertimeResult {
  ok: true;
  /** Saatlik brüt ücret (Aylık Brüt / 225) */
  hourlyGrossRate: number;
  /** Haftalık fazla sürelerle çalışma süresi (saat, sözleşme ile 45 saat arası) */
  extraHours25: number;
  /** Haftalık fazla çalışma süresi (saat, 45 saati aşan kısım) */
  extraHours50: number;
  /** Toplam haftalık mesai saati (extraHours25 + extraHours50) */
  totalOvertimeHours: number;
  /** Fazla sürelerle çalışma brüt ücreti (%25 zamlı) */
  grossPay25: number;
  /** Fazla çalışma brüt ücreti (%50 zamlı) */
  grossPay50: number;
  /** Toplam brüt fazla mesai ücreti (grossPay25 + grossPay50) */
  totalGrossOvertimePay: number;

  // Türkçe alan takma adları
  saatlikUcret: number;
  fazlaSureUcreti: number;
  fazlaCalismaUcreti: number;
  toplamMesaiUcreti: number;
  haftalikMesaiSaati: number;
}
