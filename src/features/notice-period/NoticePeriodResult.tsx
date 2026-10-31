"use client";

/**
 * NoticePeriodResult.tsx — İhbar Süresi ve Olası Bitiş Tarihi Sonuç Ekranı (İki Katmanlı)
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17 ve Madde 27
 */

import React, { useState } from "react";
import type { NoticePeriodResult as Result } from "./types";

interface NoticePeriodResultProps {
  result: Result;
}

function formatDateTR(iso: string): string {
  if (!iso || !iso.includes("-")) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function getLegalBracketExplanation(weeks: number): string {
  switch (weeks) {
    case 2:
      return "İşi 6 aydan az sürmüş işçi için 2 hafta (14 gün) ihbar öneli uygulanır (md. 17/a).";
    case 4:
      return "İşi 6 aydan 1,5 yıla kadar sürmüş işçi için 4 hafta (28 gün) ihbar öneli uygulanır (md. 17/b).";
    case 6:
      return "İşi 1,5 yıldan 3 yıla kadar sürmüş işçi için 6 hafta (42 gün) ihbar öneli uygulanır (md. 17/c).";
    case 8:
      return "İşi 3 yıldan fazla sürmüş işçi için 8 hafta (56 gün) ihbar öneli uygulanır (md. 17/d).";
    default:
      return "4857 sayılı İş Kanunu md. 17 uyarınca ihbar süresi uygulanmıştır.";
  }
}

export default function NoticePeriodResultView({ result }: NoticePeriodResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    startDate,
    notificationDate,
    duration,
    noticeWeeks,
    noticeDays,
    endDate,
  } = result;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Katman: Özet Kartı — Olası Son İş Günü */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
          Olası Son İş Günü (Bitiş Tarihi)
        </span>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-mono">
          {formatDateTR(endDate)}
        </p>
        <span className="text-xs text-slate-500 mt-1.5">
          {formatDateTR(notificationDate)} bildirim tarihine {noticeWeeks} hafta ({noticeDays} gün) eklenmiştir.
        </span>
      </div>

      {/* 2. Özet Bilgi Kutuları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Bildirim Tarihi</span>
          <span className="text-lg font-bold text-slate-800 font-mono">{formatDateTR(notificationDate)}</span>
          <span className="text-xs text-slate-400">Tebliğ / İstifa Günü</span>
        </div>
        <div className="bg-blue-600 border border-blue-600 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-white/80 font-medium">Hak Edilen İhbar Süresi</span>
          <span className="text-xl font-extrabold text-white">{noticeWeeks} Hafta</span>
          <span className="text-xs text-white/90 font-medium">{noticeDays} Takvim Günü</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Hizmet Süresi</span>
          <span className="text-lg font-bold text-slate-800">
            {duration.years} yıl {duration.months} ay {duration.days} gün
          </span>
          <span className="text-xs text-slate-400">Net Kıdem</span>
        </div>
      </div>

      {/* 3. Ayrıntılı Fiş Toggle Butonu */}
      <div className="w-full flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          aria-expanded={showDetails}
          aria-controls="notice-period-receipt"
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
        <div id="notice-period-receipt" className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-sm text-left">
            <caption className="text-xs text-slate-500 p-3 text-left font-semibold bg-slate-50 border-b border-slate-200 rounded-t-xl">
              İhbar Süresi Hesaplama Fişi (4857 Sayılı Kanun Madde 17)
            </caption>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-700 w-1/3">İşe Giriş Tarihi</td>
                <td className="px-4 py-2.5 font-mono text-slate-900">{formatDateTR(startDate)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-700">Bildirim Tarihi</td>
                <td className="px-4 py-2.5 font-mono text-slate-900">{formatDateTR(notificationDate)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-700">Toplam Hizmet Süresi</td>
                <td className="px-4 py-2.5 font-semibold text-slate-900">
                  {duration.years} yıl {duration.months} ay {duration.days} gün
                </td>
              </tr>
              <tr className="bg-blue-50/60">
                <td className="px-4 py-2.5 font-medium text-blue-950">Uygulanan Kanun Kademesi</td>
                <td className="px-4 py-2.5 text-xs sm:text-sm text-blue-900 font-medium">
                  {getLegalBracketExplanation(noticeWeeks)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-700">Hesaplama Formülü</td>
                <td className="px-4 py-2.5 text-xs text-slate-600 font-mono">
                  {formatDateTR(notificationDate)} + ({noticeWeeks} Hafta × 7 Gün = {noticeDays} Gün) = {formatDateTR(endDate)}
                </td>
              </tr>
              <tr className="bg-amber-50/60">
                <td className="px-4 py-2.5 font-medium text-amber-950">Yeni İş Arama İzni (Md. 27)</td>
                <td className="px-4 py-2.5 text-xs text-amber-900">
                  İhbar süresi boyunca işveren, işçiye çalışma saatleri içinde ve ücret kesintisi yapmaksızın günde <strong>en az 2 saat</strong> yeni iş arama izni vermekle yükümlüdür.
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold border-t border-slate-200">
                <td className="px-4 py-3 text-slate-900">Sözleşme Bitiş Tarihi</td>
                <td className="px-4 py-3 font-mono text-base text-blue-700">{formatDateTR(endDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Bilgilendirme Çekincesi */}
      <p className="text-xs text-slate-500 text-center italic">
        Bu sonuç bilgilendirme amaçlıdır. Toplu iş sözleşmesi veya iş sözleşmesinde yasal süreleri artıran özel hükümler saklıdır.
      </p>
    </div>
  );
}
