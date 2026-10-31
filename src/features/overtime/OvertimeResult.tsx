"use client";

/**
 * OvertimeResult.tsx — Fazla Mesai Sonuç Ekranı (İki Katmanlı)
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Madde 63
 */

import React, { useState } from "react";
import type { OvertimeResult as Result } from "./types";
import { formatTRY } from "@/lib/utils/format";

interface OvertimeResultProps {
  result: Result;
  contractHours: number;
  workedHours: number;
}

export default function OvertimeResultView({
  result,
  contractHours,
  workedHours,
}: OvertimeResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    hourlyGrossRate,
    extraHours25,
    extraHours50,
    totalOvertimeHours,
    grossPay25,
    grossPay50,
    totalGrossOvertimePay,
  } = result;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Katman: Özet Kartı — Toplam Brüt Mesai Ücreti */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
          Toplam Haftalık Brüt Mesai Ücreti
        </span>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
          {formatTRY(totalGrossOvertimePay)}
        </p>
        <span className="text-xs text-slate-500 mt-1.5">
          Toplam {totalOvertimeHours} saatlik fazla çalışma karşılığı brüt hak edişinizdir.
        </span>
      </div>

      {/* 2. Özet Bilgi Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Saatlik Brüt Ücret</span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-800">{formatTRY(hourlyGrossRate)}</span>
          <span className="text-xs text-slate-400">Brüt Maaş / 225</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">%25 Zamlı Süre (md. 41/3)</span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-800">{extraHours25} saat</span>
          <span className="text-xs text-slate-400">{formatTRY(grossPay25)}</span>
        </div>
        <div className="bg-blue-600 border border-blue-600 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-white/80 font-medium">%50 Zamlı Süre (md. 41/2)</span>
          <span className="text-lg sm:text-xl font-extrabold text-white">{extraHours50} saat</span>
          <span className="text-xs text-white/90 font-medium">{formatTRY(grossPay50)}</span>
        </div>
      </div>

      {/* 3. Ayrıntılı Fiş Toggle Butonu */}
      <div className="w-full flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          aria-expanded={showDetails}
          aria-controls="overtime-detailed-receipt"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-sm transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
        >
          <span>{showDetails ? "Ayrıntılı hesaplamayı gizle" : "Ayrıntılı hesaplamayı göster"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 4. Katman 2: Detaylı Hesaplama Fişi */}
      {showDetails && (
        <div id="overtime-detailed-receipt" className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-sm text-left">
            <caption className="text-xs text-slate-500 p-3 text-left font-semibold bg-slate-50 border-b border-slate-200 rounded-t-xl">
              Fazla Mesai Adım Adım Hesaplama Fişi (4857 md. 41)
            </caption>
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2">Kalem / Açıklama</th>
                <th className="px-4 py-2 text-center">Hesaplama Formülü</th>
                <th className="px-4 py-2 text-right">Tutar / Değer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-800">Saatlik Brüt Ücret</td>
                <td className="px-4 py-2.5 text-center text-xs text-slate-500">Aylık Brüt Maaş / 225 saat</td>
                <td className="px-4 py-2.5 text-right font-mono font-semibold">{formatTRY(hourlyGrossRate)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-800">Çalışma Süreleri</td>
                <td className="px-4 py-2.5 text-center text-xs text-slate-500">Sözleşme: {contractHours} sa | Fiili: {workedHours} sa</td>
                <td className="px-4 py-2.5 text-right font-mono">{totalOvertimeHours} saat mesai</td>
              </tr>
              {extraHours25 > 0 && (
                <tr className="bg-amber-50/50">
                  <td className="px-4 py-2.5 font-medium text-amber-950">
                    Fazla Sürelerle Çalışma (%25 Zamlı)
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs text-amber-900">
                    {extraHours25} saat × ({formatTRY(hourlyGrossRate)} × 1,25)
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-amber-950">
                    {formatTRY(grossPay25)}
                  </td>
                </tr>
              )}
              {extraHours50 > 0 && (
                <tr className="bg-blue-50/50">
                  <td className="px-4 py-2.5 font-medium text-blue-950">
                    Fazla Çalışma (%50 Zamlı)
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs text-blue-900">
                    {extraHours50} saat × ({formatTRY(hourlyGrossRate)} × 1,50)
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-blue-950">
                    {formatTRY(grossPay50)}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-50 font-bold border-t border-slate-200">
                <td className="px-4 py-3 text-slate-900">Toplam Brüt Mesai Ücreti</td>
                <td className="px-4 py-3 text-center text-xs text-slate-500">%25 Zamlı + %50 Zamlı</td>
                <td className="px-4 py-3 text-right font-mono text-base text-blue-700">
                  {formatTRY(totalGrossOvertimePay)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Bilgilendirme Çekincesi */}
      <p className="text-xs text-slate-500 text-center italic">
        Bu sonuç bilgilendirme amaçlıdır; brüt tutar üzerinden SGK primi, gelir ve damga vergisi kesintileri bordronuza yansıtılır.
      </p>
    </div>
  );
}
