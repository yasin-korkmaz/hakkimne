import React from "react";
import type { ReceiptRow } from "@/lib/receipt/buildReceipt";

interface ResultSummaryProps {
  rows: ReceiptRow[];
  severanceEligible: boolean;
  noticeEligible: boolean;
}

export default function ResultSummary({
  rows,
  severanceEligible,
  noticeEligible,
}: ResultSummaryProps) {
  const netSeveranceRow = rows.find((r) => r.id === "net_severance");
  const grossNoticeRow = rows.find((r) => r.id === "gross_notice");
  const netNoticeRow = rows.find((r) => r.id === "net_notice");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* 1. Net Kıdem Tazminatı */}
      <div className="bg-white border-2 border-blue-600 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Kıdem Tazminatı
          </span>
          <h3 className="text-base font-medium text-gray-700 mt-1">
            {netSeveranceRow?.label ?? "Net Kıdem Tazminatı"}
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {severanceEligible && netSeveranceRow ? netSeveranceRow.value : "0,00 TL"}
          </p>
          {!severanceEligible && (
            <span className="text-xs text-amber-700 font-medium mt-1 inline-block">
              Koşullar sağlanmadığı için hak kazanılamadı
            </span>
          )}
        </div>
      </div>

      {/* 2. İhbar Tazminatı */}
      <div className="bg-white border-2 border-emerald-600 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            İhbar Tazminatı
          </span>
          <h3 className="text-base font-medium text-gray-700 mt-1">
            {grossNoticeRow?.label ?? "Brüt İhbar Tazminatı"}
          </h3>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {noticeEligible && grossNoticeRow ? grossNoticeRow.value : "0,00 TL"}
          </p>
          {noticeEligible && netNoticeRow ? (
            <div className="flex items-baseline gap-1.5 pt-1 border-t border-gray-100 text-xs text-gray-600">
              <span className="font-medium text-gray-500">
                {netNoticeRow.label}:
              </span>
              <span className="font-semibold text-gray-800">
                {netNoticeRow.value}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 mt-1 inline-block">
              İhbar tazminatı hakkı bulunmuyor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
