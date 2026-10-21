/**
 * buildNotices.ts — Hesaplama ve Durum Uyarı Metinleri Üreticisi
 * Dayanak: 1475 Sayılı İş Kanunu Madde 14 & 4857 Sayılı İş Kanunu Madde 17, 25/II
 *
 * Algoritma:
 *  1. Sonuç durumuna göre ilgili bilgi (info) ve uyarı (warning) mesajlarını derler.
 *  2. DISCLAIMER uyarısı her durumda listenin sonunda yer alır.
 *  3. Metinler PRD ve karar kayıtlarında belirtilen kurallara birebir uygun üretilir.
 */

import type { CompensationServiceResult } from "@/lib/calculators/compensation";
import { formatTRY } from "@/lib/utils/format";
import { compareDurationToMonths } from "@/lib/utils/dateDuration";

export type NoticeKind = "info" | "warning";

export interface NoticeMessage {
  kind: NoticeKind;
  code: string;
  text: string;
}

/**
 * buildNotices — Hesaplama sonucuna göre kullanıcıya gösterilecek yasal ve teknik uyarıları üretir.
 */
export function buildNotices(result: CompensationServiceResult): NoticeMessage[] {
  const notices: NoticeMessage[] = [];

  // 1. Emin Değilim Durumu (UNSURE)
  if (result.status === "unsure_reason") {
    notices.push({
      kind: "warning",
      code: "UNSURE",
      text: "Seçtiğiniz durumda hesap yapılamıyor. Lütfen bir iş hukuku uzmanına danışın.",
    });
  }

  // 2. Başarılı Hesaplama Durumu
  if (result.status === "ok") {
    const { input, severance, notice } = result;

    // CEILING_APPLIED
    if (severance.ceilingApplied) {
      notices.push({
        kind: "warning",
        code: "CEILING_APPLIED",
        text: `Giydirilmiş brüt ücretiniz kıdem tazminatı tavanını aştığı için hesaplamada tavan tutar (${formatTRY(severance.base)}) kullanıldı.`,
      });
    }

    // LESS_THAN_ONE_YEAR
    if (severance.reasonCode === "UNDER_ONE_YEAR") {
      notices.push({
        kind: "warning",
        code: "LESS_THAN_ONE_YEAR",
        text: "Kıdem tazminatı için aynı işyerinde en az 1 tam yıl çalışmış olmak gerekir. Çalışma süreniz 1 yıldan az olduğu için kıdem tazminatı 0 TL gösterilmiştir.",
      });
    }

    // RESIGNATION
    if (input.reason === "voluntary_resignation") {
      notices.push({
        kind: "warning",
        code: "RESIGNATION",
        text: "Haklı bir neden olmadan kendi isteğinizle ayrılma durumunda kıdem tazminatı doğmaz. İhbar süresine uymadan ayrılırsanız işverene ihbar tazminatı ödemeniz gerekebilir.",
      });
    }

    // EMPLOYER_JUST_CAUSE
    if (input.reason === "employer_just_cause") {
      notices.push({
        kind: "warning",
        code: "EMPLOYER_JUST_CAUSE",
        text: "İşverenin haklı nedenle derhal feshi (4857 md. 25/II) durumunda kıdem ve ihbar tazminatı doğmaz.",
      });
    }

    // NOTICE_USED
    if (input.reason === "employer_unfair" && input.noticeWorked) {
      notices.push({
        kind: "info",
        code: "NOTICE_USED",
        text: "İhbar süresi kullandırıldığı için ihbar tazminatı 0 TL gösterilmiştir.",
      });
    }

    // NO_NOTICE_REASON
    if (
      input.reason === "employee_just_cause" ||
      input.reason === "retirement_military_marriage"
    ) {
      notices.push({
        kind: "info",
        code: "NO_NOTICE_REASON",
        text: "Bu fesih nedeninde ihbar tazminatı hesaplanmaz.",
      });
    }

    // BOUNDARY_1_5_YEARS (Tam 18 ay = 1,5 yıl sınırı kontrolü)
    try {
      if (compareDurationToMonths(input.startIso, input.exitIso, 18) === 0) {
        notices.push({
          kind: "warning",
          code: "BOUNDARY_1_5_YEARS",
          text: "Çalışma süreniz tam 1,5 yıl olduğundan ihbar süresi bu araçta hesaplanmadı. Lütfen bir uzmana danışın.",
        });
      }
    } catch {
      // Tarih karşılaştırma hatası olursa bu özel uyarı atlanır
    }

    // ESTIMATE (Tahmini net ihbar hesaplandıysa)
    if (notice.eligible) {
      notices.push({
        kind: "info",
        code: "ESTIMATE",
        text: "Tahmini net tutar, seçtiğiniz gelir vergisi oranı ve damga vergisiyle hesaplanmıştır; gerçek vergi yıllık kümülatif matrahınıza göre değişir.",
      });
    }
  }

  // 3. Yasal Çekince (DISCLAIMER — her zaman listelenir)
  notices.push({
    kind: "info",
    code: "DISCLAIMER",
    text: "Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Sonuç, fesih nedeni ve ek koşullara göre değişebilir.",
  });

  return notices;
}
