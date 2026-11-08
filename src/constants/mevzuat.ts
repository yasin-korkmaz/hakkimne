/**
 * mevzuat.ts — Merkezi Mevzuat ve Yasal Limitler Deposu (Single Source of Truth)
 *
 * Algoritma: Türkiye İş Kanunu, Sosyal Güvenlik ve vergi mevzuatına ait güncel yasal sınırları,
 * kıdem tazminatı tavanını ve asgari ücret tutarlarını tek bir merkezde toplar.
 * Yasal Dayanak: 1475 Sayılı Kanun md. 14 (Kıdem Tazminatı Tavanı), 4857 Sayılı İş Kanunu
 * ve 488 Sayılı Damga Vergisi Kanunu.
 */

export interface MevzuatLimitleri {
  DONEM: string;
  YIL: number;
  KIDEM_TAVANI: number;
  ASGARI_UCRET_BRUT: number;
  ASGARI_UCRET_NET: number;
  DAMGA_VERGISI_ORANI: number;
  SGK_ISCI_ORANI: number;
  ISSIZLIK_ISCI_ORANI: number;
  GUNLUK_CALISMA_SAATI: number;
  HAFTALIK_CALISMA_SAATI: number;
  AYLIK_CALISMA_SAATI: number;
}

export const MEVZUAT: MevzuatLimitleri = {
  DONEM: "2026-2",
  YIL: 2026,
  KIDEM_TAVANI: 76257.87, // 2026 yılı güncel kıdem tazminatı tavanı (TL)
  ASGARI_UCRET_BRUT: 26005.50, // 2026 yılı brüt asgari ücret (TL)
  ASGARI_UCRET_NET: 22104.68, // 2026 yılı net asgari ücret (TL)
  DAMGA_VERGISI_ORANI: 0.00759, // Binde 7,59 damga vergisi kesintisi (488 sayılı Kanun)
  SGK_ISCI_ORANI: 0.14, // %14 SGK işçi primi
  ISSIZLIK_ISCI_ORANI: 0.01, // %1 İşsizlik sigortası işçi payı
  GUNLUK_CALISMA_SAATI: 7.5, // 4857 md. 63 günlük yasal çalışma süresi
  HAFTALIK_CALISMA_SAATI: 45, // 4857 md. 63 haftalık yasal çalışma süresi
  AYLIK_CALISMA_SAATI: 225, // Fazla mesai hesabında esas alınan aylık çalışma saati
} as const;

export default MEVZUAT;
