import React from "react";
import type { ReceiptRow } from "@/lib/receipt/buildReceipt";

interface ReceiptTableProps {
  rows: ReceiptRow[];
}

export default function ReceiptTable({ rows }: ReceiptTableProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <section
      role="region"
      aria-label="Adım Adım Hesaplama Fişi"
      className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-4 sm:px-5 py-4 bg-gray-50/80 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">
          Adım Adım Hesaplama Fişi
        </h2>
        <p className="text-xs text-gray-600 mt-0.5">
          Hesaplamada kullanılan tüm parametreler ve döküm
        </p>
      </div>

      <dl className="divide-y divide-gray-100 m-0">
        {rows.map((row) => {
          const isHighlight = row.kind === "highlight" || row.kind === "total";
          const isSubtext = row.kind === "subtext";

          return (
            <div
              key={row.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 gap-1 sm:gap-4 transition-colors ${
                isHighlight
                  ? "bg-blue-50/50 font-semibold"
                  : isSubtext
                  ? "bg-gray-50/30 text-gray-600"
                  : "hover:bg-gray-50/50"
              }`}
            >
              <dt className="flex-1">
                <span
                  className={`${
                    isHighlight
                      ? "text-sm text-blue-950 font-bold"
                      : isSubtext
                      ? "text-xs text-gray-600 italic"
                      : "text-sm text-gray-700 font-medium"
                  }`}
                >
                  {row.label}
                </span>
              </dt>
              <dd className="text-left sm:text-right shrink-0 m-0">
                <span
                  className={`${
                    isHighlight
                      ? "text-base text-blue-900 font-bold"
                      : isSubtext
                      ? "text-xs text-gray-600 font-mono"
                      : "text-sm text-gray-900 font-medium font-mono"
                  }`}
                >
                  {row.value}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
