/**
 * buildReceipt.ts — Hesaplama Fişi Satır Üreticisi
 * Dayanak: 1475 Sayılı İş Kanunu Madde 14 & 4857 Sayılı İş Kanunu Madde 17
 *
 * Algoritma:
 *  1. status: 'ok' olan birleşik hesaplama sonucunu ve rates yapılandırmasını alır.
 *  2. Sırasıyla çalışma süresi, kural notu, giydirilmiş brüt, tavan, kıdem bazı,
 *     brüt kıdem, damga vergisi, net kıdem tazminatı satırlarını ekler.
 *  3. İhbar tazminatı hak edildiyse ihbar süresi, brüt ihbar, gelir vergisi,
 *     damga vergisi ve tahmini net ihbar satırlarını ekler.
 *  4. Kurallar sürümü (period_id) satırını ekler.
 *  5. Tüm parasal değerler formatTRY ile biçimlendirilir (arayüz biçimlendirme yapmaz).
 */

import type { RatesConfig } from "@/lib/config/types";
import type { CompensationServiceResult } from "@/lib/calculators/compensation";
import { formatTRY, formatPercent } from "@/lib/utils/format";

export type ReceiptRowKind = "default" | "highlight" | "subtext" | "total";

export interface ReceiptRow {
  id: string;
  label: string;
  value: string;
  kind: ReceiptRowKind;
}

/**
 * buildReceipt — Hesaplama sonuçlarından UI için hazır, biçimlendirilmiş fiş satırları üretir.
 */
export function buildReceipt(
  result: CompensationServiceResult,
  rates: RatesConfig
): ReceiptRow[] {
  if (result.status !== "ok") {
    return [];
  }

  const { input, severance, notice } = result;
  const rows: ReceiptRow[] = [];

  // 1. Çalışma Süresi
  const dur = severance.duration;
  rows.push({
    id: "duration",
    label: "Çalışma Süresi",
    value: `${dur.years} yıl ${dur.months} ay ${dur.days} gün`,
    kind: "default",
  });

  // 2. Çıkış Günü Notu (DECISIONS.md Karar 1)
  rows.push({
    id: "exit_day_note",
    label: "Hesaplama Kuralı",
    value: "Çıkış günü dahil edilmiştir",
    kind: "subtext",
  });

  // 3. Giydirilmiş Aylık Brüt Ücret
  rows.push({
    id: "dressed_gross",
    label: "Giydirilmiş Aylık Brüt Ücret",
    value: formatTRY(severance.dressedGross),
    kind: "default",
  });

  // 4. Uygulanan Kıdem Tavanı (dönem etiketiyle)
  const ceilingPeriod = rates.severance_ceiling_periods.find(
    (p) => p.period_id === severance.periodId
  );
  const periodLabel = ceilingPeriod?.label
    ? `Kıdem Tazminatı Tavanı (${ceilingPeriod.label})`
    : `Kıdem Tazminatı Tavanı (${severance.periodId})`;

  rows.push({
    id: "severance_ceiling",
    label: periodLabel,
    value: formatTRY(ceilingPeriod?.amount_try ?? 0),
    kind: "default",
  });

  // 5. Kıdem Baz Ücreti
  rows.push({
    id: "severance_base",
    label: "Kıdem Baz Ücreti",
    value: formatTRY(severance.base),
    kind: "default",
  });

  // 6. Brüt Kıdem Tazminatı
  rows.push({
    id: "gross_severance",
    label: "Brüt Kıdem Tazminatı",
    value: formatTRY(severance.grossSeverance),
    kind: "default",
  });

  // 7. Damga Vergisi (Kıdem)
  const stampTaxLabel = `Damga Vergisi (${formatPercent(rates.stamp_tax.rate)})`;
  rows.push({
    id: "severance_stamp_tax",
    label: stampTaxLabel,
    value: formatTRY(severance.stampTax),
    kind: "default",
  });

  // 8. Net Kıdem Tazminatı
  rows.push({
    id: "net_severance",
    label: "Net Kıdem Tazminatı",
    value: formatTRY(severance.netSeverance),
    kind: "highlight",
  });

  // 9–13. İhbar Tazminatı Satırları (Hak kazanıldıysa)
  if (notice.eligible) {
    rows.push({
      id: "notice_duration",
      label: "İhbar Süresi",
      value: `${notice.noticeWeeks} hafta (${notice.noticeDays} gün)`,
      kind: "default",
    });

    rows.push({
      id: "gross_notice",
      label: "Brüt İhbar Tazminatı",
      value: formatTRY(notice.grossNotice),
      kind: "default",
    });

    const incomeTaxRateLabel = formatPercent(input.incomeTaxRate);
    rows.push({
      id: "notice_income_tax",
      label: `Gelir Vergisi (Tahmini ${incomeTaxRateLabel})`,
      value: formatTRY(notice.incomeTax),
      kind: "default",
    });

    const noticeStampLabel = `Damga Vergisi (İhbar ${formatPercent(rates.stamp_tax.rate)})`;
    rows.push({
      id: "notice_stamp_tax",
      label: noticeStampLabel,
      value: formatTRY(notice.stampTax),
      kind: "default",
    });

    rows.push({
      id: "net_notice",
      label: "Tahmini Net İhbar Tazminatı",
      value: formatTRY(notice.estimatedNetNotice),
      kind: "highlight",
    });
  }

  // 14. Kurallar Sürümü
  rows.push({
    id: "rules_version",
    label: "Kurallar Sürümü",
    value: severance.periodId,
    kind: "subtext",
  });

  return rows;
}
