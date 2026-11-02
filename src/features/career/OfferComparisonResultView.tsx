import React from "react";
import type { OfferComparisonResult } from "./types";
import { formatTRY } from "@/lib/utils/format";

interface OfferComparisonResultViewProps {
  result: OfferComparisonResult;
  onEdit: () => void;
}

export default function OfferComparisonResultView({
  result,
  onEdit,
}: OfferComparisonResultViewProps) {
  const { offerA, offerB, keyDifferences } = result;

  return (
    <div className="flex flex-col gap-6 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33]">
            İş Teklifi Karşılaştırma Sonucu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tek bir kazanan yerine iki seçeneğin tüm artı ve eksilerini şeffafça inceleyin.
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
        >
          Kriterleri Düzenle
        </button>
      </div>

      {/* Yan Yana İki Teklif Kartı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teklif A */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-[#1769E0] rounded">
                1. Seçenek
              </span>
              <h3 className="font-bold text-lg text-slate-900 mt-1">
                {offerA.offer.companyName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Öncelik Puanı</span>
              <span className="text-2xl font-extrabold text-[#1769E0]">
                {offerA.score}
                <span className="text-xs font-medium text-slate-400">/100</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block">Aylık Toplam Paket:</span>
              <strong className="text-sm font-bold text-slate-900">
                {formatTRY(offerA.monthlyTotalIncome)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tahmini Saatlik Kazanç:</span>
              <strong className="text-sm font-bold text-slate-900">
                {formatTRY(offerA.hourlyEarnings)}
              </strong>
            </div>
          </div>

          {/* Artılar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Öne Çıkan Artılar ({offerA.pros.length})
            </span>
            <ul className="flex flex-col gap-1 text-xs text-slate-700">
              {offerA.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eksiler */}
          {offerA.cons.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Dikkat Edilmesi Gerekenler ({offerA.cons.length})
              </span>
              <ul className="flex flex-col gap-1 text-xs text-slate-700">
                {offerA.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Teklif B */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                2. Seçenek
              </span>
              <h3 className="font-bold text-lg text-slate-900 mt-1">
                {offerB.offer.companyName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Öncelik Puanı</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                {offerB.score}
                <span className="text-xs font-medium text-slate-400">/100</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block">Aylık Toplam Paket:</span>
              <strong className="text-sm font-bold text-slate-900">
                {formatTRY(offerB.monthlyTotalIncome)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tahmini Saatlik Kazanç:</span>
              <strong className="text-sm font-bold text-slate-900">
                {formatTRY(offerB.hourlyEarnings)}
              </strong>
            </div>
          </div>

          {/* Artılar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Öne Çıkan Artılar ({offerB.pros.length})
            </span>
            <ul className="flex flex-col gap-1 text-xs text-slate-700">
              {offerB.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eksiler */}
          {offerB.cons.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Dikkat Edilmesi Gerekenler ({offerB.cons.length})
              </span>
              <ul className="flex flex-col gap-1 text-xs text-slate-700">
                {offerB.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Temel Farklar Özeti */}
      {keyDifferences.length > 0 && (
        <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <h4 className="text-sm font-bold text-[#0B1F33]">Karar Rehberi ve Temel Farklar:</h4>
          <ul className="flex flex-col gap-1 text-xs sm:text-sm text-slate-700">
            {keyDifferences.map((d, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#1769E0] font-bold">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
