import React, { useState } from "react";
import type { AnnualLeaveResult as Result } from "./types";
import { formatTRY } from "@/lib/utils/format";

/**
 * AnnualLeaveResult.tsx — Yıllık İzin Sonuç Ekranı (İki Katmanlı)
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve 59
 *
 * Katman 1: Özet — Hak edilen gün, kalan gün ve brüt izin ücreti.
 * Katman 2: Akordeon — Yıl bazında kırılım tablosu (toggle ile açılır).
 */

interface AnnualLeaveResultProps {
  result: Result;
}

export default function AnnualLeaveResult({ result }: AnnualLeaveResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { totalEarnedDays, usedDays, remainingDays, dailyGross, grossLeavePay, completedYears, breakdown } = result;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Özet Kartı — Brüt İzin Ücreti */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50/70 border border-teal-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
          Kullanılmayan İzin Brüt Ücreti
        </span>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
          {formatTRY(grossLeavePay)}
        </p>
        <span className="text-xs text-slate-500 mt-1.5">
          {remainingDays} kalan gün × {formatTRY(dailyGross)} günlük brüt ücret
        </span>
      </div>

      {/* Özet Bilgi Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Hak Edilen Toplam</span>
          <span className="text-xl font-extrabold text-slate-800">{totalEarnedDays} gün</span>
          <span className="text-xs text-slate-400">{completedYears} yıl hizmet</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Kullanılan</span>
          <span className="text-xl font-extrabold text-slate-800">{usedDays} gün</span>
        </div>
        <div className="bg-teal-600 border border-teal-600 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-white/80 font-medium">Kalan (Hak)</span>
          <span className="text-xl font-extrabold text-white">{remainingDays} gün</span>
        </div>
      </div>

      {/* Toggle Butonu */}
      {breakdown.length > 0 && (
        <div className="w-full flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            aria-expanded={showDetails}
            aria-controls="annual-leave-detail"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 text-teal-700 font-semibold text-sm transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 min-h-[44px]"
          >
            <span>{showDetails ? "Yıl kırılımını gizle" : "Yıl kırılımını göster"}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Detay Tablosu */}
      {showDetails && (
        <div id="annual-leave-detail" className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-sm text-left">
            <caption className="text-xs text-slate-500 p-3 text-left font-semibold bg-slate-50 border-b border-slate-200 rounded-t-xl">
              Yıl Bazında Hak Ediş Kırılımı (4857 md. 53)
            </caption>
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2">Hizmet Yılı</th>
                <th className="px-4 py-2 text-right">Hak Edilen Gün</th>
                <th className="px-4 py-2 text-center">Yaş Koruması</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {breakdown.map((row) => (
                <tr key={row.year} className="bg-white hover:bg-slate-50/70">
                  <td className="px-4 py-2 font-medium">{row.year}. yıl</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">{row.earnedDays}</td>
                  <td className="px-4 py-2 text-center">
                    {row.isProtectedAge ? (
                      <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Uygulandı</span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bilgilendirme Çekincesi */}
      <p className="text-xs text-slate-500 text-center italic">
        Bu sonuç bilgilendirme amaçlıdır. İşten çıkış sebebi, sözleşme koşulları ve hizmet kırılımlarına göre değişebilir.
      </p>
    </div>
  );
}
