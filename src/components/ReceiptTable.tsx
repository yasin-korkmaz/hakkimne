import React from "react";
import type { ReceiptRow } from "@/lib/receipt/buildReceipt";

interface ReceiptTableProps {
  rows: ReceiptRow[];
}

/**
 * ReceiptTable.tsx — Finansal ve Hukuki Hesaplama Raporu Bileşeni
 * Yasal dayanaklar, mevzuat varsayımları ve adım adım fiş satırlarını sunar.
 * Dayanak: 1475 md. 14, 4857 md. 17 ve WCAG 2.1 AA semantik standartları.
 */

export default function ReceiptTable({ rows }: ReceiptTableProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <section
      role="region"
      aria-label="Adım Adım Hesaplama Fişi"
      className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
    >
      {/* 1. Rapor Başlığı ve Mevzuat Rozetleri */}
      <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F33]">
              Adım Adım Hesaplama Fişi ve Yasal Rapor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              1475 ve 4857 Sayılı İş Kanunları mevzuatına göre resmi hak ediş dökümü
            </p>
          </div>
          <span className="self-start sm:self-center px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-md border border-emerald-200">
            Resmi Mevzuat Uyumlu
          </span>
        </div>

        {/* Yasal Dayanak Etiketleri */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
            1475 md. 14 (Kıdem)
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
            4857 md. 17 (İhbar)
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
            488 SK (Damga V. %0,759)
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
            193 SK (GVK md. 25 İstisna)
          </span>
        </div>
      </div>

      {/* 2. Semantik Fiş Dökümü */}
      <dl className="divide-y divide-slate-100 m-0">
        {rows.map((row) => {
          const isHighlight = row.kind === "highlight" || row.kind === "total";
          const isSubtext = row.kind === "subtext";

          return (
            <div
              key={row.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 gap-1 sm:gap-4 transition-colors ${
                isHighlight
                  ? "bg-blue-50/60 font-semibold"
                  : isSubtext
                  ? "bg-slate-50/50 text-slate-600"
                  : "hover:bg-slate-50/60"
              }`}
            >
              <dt className="flex-1">
                <span
                  className={`${
                    isHighlight
                      ? "text-sm text-[#0B1F33] font-bold"
                      : isSubtext
                      ? "text-xs text-slate-500 italic"
                      : "text-sm text-slate-700 font-medium"
                  }`}
                >
                  {row.label}
                </span>
              </dt>
              <dd className="text-left sm:text-right shrink-0 m-0">
                <span
                  className={`${
                    isHighlight
                      ? "text-base text-[#1769E0] font-bold font-mono"
                      : isSubtext
                      ? "text-xs text-slate-500 font-mono"
                      : "text-sm text-slate-900 font-medium font-mono"
                  }`}
                >
                  {row.value}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      {/* 3. Hukuki Dayanaklar ve Hesaplama Varsayımları */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 leading-relaxed flex flex-col gap-1.5">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
          Hukuki Varsayımlar ve Notlar
        </span>
        <ul className="list-disc pl-4 space-y-1 text-slate-500">
          <li>
            <strong>Kıdem Tazminatı:</strong> Yalnızca binde 7,59 damga vergisine tabidir; Gelir Vergisi Kanunu md. 25 uyarınca gelir vergisinden tamamen istisnadır.
          </li>
          <li>
            <strong>Kıdem Tavanı:</strong> Fesih tarihi itibarıyla yürürlükte olan Hazine ve Maliye Bakanlığı tavanı aşan kısım hesaplamaya dahil edilmez.
          </li>
          <li>
            <strong>İhbar Tazminatı Vergisi:</strong> İhbar ödemelerinde %15 başlangıç gelir vergisi dilimi varsayılmıştır; çalışanın yıl içindeki kümülatif matrahına göre nihai oran (%20, %27 vb.) değişebilir.
          </li>
          <li>
            <strong>Gizlilik:</strong> Tüm hesaplamalar tarayıcınızda istemci taraflı gerçekleşmiş olup hiçbir mali veri sunuculara iletilmemiştir.
          </li>
        </ul>
      </div>
    </section>
  );
}
