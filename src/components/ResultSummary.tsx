import React from "react";
import type { ReceiptRow } from "@/lib/receipt/buildReceipt";
import { formatTRY } from "@/lib/utils/format";

interface ResultSummaryProps {
  rows: ReceiptRow[];
  severanceEligible: boolean;
  noticeEligible: boolean;
  totalNet?: number;
}

export default function ResultSummary({
  rows,
  severanceEligible,
  noticeEligible,
  totalNet,
}: ResultSummaryProps) {
  const grossSeveranceRow = rows.find((r) => r.id === "gross_severance");
  const netSeveranceRow = rows.find((r) => r.id === "net_severance");
  const grossNoticeRow = rows.find((r) => r.id === "gross_notice");
  const netNoticeRow = rows.find((r) => r.id === "net_notice");

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Tahmini Toplam Ele Geçecek Tutar */}
      {totalNet !== undefined && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Tahmini Toplam Ele Geçecek Tutar
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {formatTRY(totalNet)}
          </p>
          <span className="text-xs text-slate-500 mt-1.5">
            Kıdem ve ihbar net tutarlarının toplamıdır (kesintiler sonrasıdır).
          </span>
        </div>
      )}

      {/* 2. Kıdem ve İhbar Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Kıdem Tazminatı */}
        <div className="bg-white border-2 border-blue-600 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Kıdem Tazminatı
            </span>
            <div className="flex justify-between items-baseline mt-1 text-xs text-gray-500">
              <span>Brüt Kıdem:</span>
              <span className="font-semibold text-gray-800 font-mono">
                {severanceEligible && grossSeveranceRow ? grossSeveranceRow.value : "0,00 TL"}
              </span>
            </div>
            <h3 className="text-base font-medium text-gray-700 mt-2">
              {netSeveranceRow?.label ?? "Net Kıdem Tazminatı"}
            </h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {severanceEligible && netSeveranceRow ? netSeveranceRow.value : "0,00 TL"}
            </p>
            {!severanceEligible && (
              <span className="text-xs text-amber-700 font-medium mt-1 inline-block">
                Koşullar sağlanmadığı için hak kazanılamadı
              </span>
            )}
          </div>
        </div>

        {/* İhbar Tazminatı */}
        <div className="bg-white border-2 border-emerald-600 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              İhbar Tazminatı
            </span>
            <div className="flex justify-between items-baseline mt-1 text-xs text-gray-500">
              <span>Brüt İhbar:</span>
              <span className="font-semibold text-gray-800 font-mono">
                {noticeEligible && grossNoticeRow ? grossNoticeRow.value : "0,00 TL"}
              </span>
            </div>
            <h3 className="text-base font-medium text-gray-700 mt-2">
              {netNoticeRow?.label ?? "Tahmini Net İhbar"}
            </h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {noticeEligible && netNoticeRow ? netNoticeRow.value : "0,00 TL"}
            </p>
            {!noticeEligible && (
              <span className="text-xs text-gray-500 mt-1 inline-block">
                İhbar tazminatı hakkı bulunmuyor
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bilgilendirme Çekincesi */}
      <p className="text-xs text-slate-500 text-center italic">
        Bu sonuç bilgilendirme amaçlıdır; bordro kalemlerine ve vergi matrahına göre kuruş farkları oluşabilir.
      </p>
    </div>
  );
}
