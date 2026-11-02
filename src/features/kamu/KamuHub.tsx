"use client";

/**
 * KamuHub.tsx — Kamu & KPSS Nitelik Kodları Ana Bileşeni
 * Kadro eşleştirme aracı, taban puan filtresi ve tercih rehberi sekmelerini yönetir.
 * Dayanak: ÖSYM KPSS Önlisans Kılavuzu ve WCAG 2.1 AA kuralları.
 */

import React, { useState, useMemo } from "react";
import { KamuFilterParams } from "./types";
import { matchPublicPositions } from "./kamuEngine";
import { KamuFilterForm } from "./KamuFilterForm";
import { KamuPositionCard } from "./KamuPositionCard";
import { KamuGuideSection } from "./KamuGuideSection";

const DEFAULT_PARAMS: KamuFilterParams = {
  p93Score: undefined,
  graduationCode: "3249",
  includeGeneral3001: true,
  noYdsRequired: false,
  noCertificateRequired: false,
  institutionCategory: "all",
  searchQuery: "",
};

export function KamuHub() {
  const [activeTab, setActiveTab] = useState<"matcher" | "guide">("matcher");
  const [params, setParams] = useState<KamuFilterParams>(DEFAULT_PARAMS);

  const { matches, summary } = useMemo(() => matchPublicPositions(params), [params]);

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  return (
    <div className="w-full">
      {/* Sekme Seçici */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("matcher")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors min-h-[44px] flex items-center ${
            activeTab === "matcher"
              ? "border-[#1769E0] text-[#1769E0]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Kadro & Puan Eşleştirme
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guide")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors min-h-[44px] flex items-center ${
            activeTab === "guide"
              ? "border-[#1769E0] text-[#1769E0]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          KPSS & Nitelik Kodları Rehberi
        </button>
      </div>

      {activeTab === "matcher" && (
        <div>
          {/* Filtreleme Formu */}
          <KamuFilterForm params={params} onChange={setParams} onReset={handleReset} />

          {/* İstatistik ve Özet Çubuğu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-center">
              <span className="text-[11px] text-slate-500 block">Başvurulabilir Kadro</span>
              <span className="text-lg font-bold text-[#0B1F33]">{summary.totalMatched}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-center">
              <span className="text-[11px] text-slate-500 block">Yüksek Şans</span>
              <span className="text-lg font-bold text-emerald-700">{summary.highChanceCount}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-center">
              <span className="text-[11px] text-slate-500 block">Sınırda / Rekabetçi</span>
              <span className="text-lg font-bold text-amber-700">{summary.moderateChanceCount}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-center">
              <span className="text-[11px] text-slate-500 block">En Düşük Taban Puan</span>
              <span className="text-lg font-bold text-[#1769E0]">
                {summary.minScoreNeeded > 0 ? summary.minScoreNeeded.toFixed(2) : "-"}
              </span>
            </div>
          </div>

          {/* Kadro Listesi */}
          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((item) => (
                <KamuPositionCard key={item.position.id} item={item} userScore={params.p93Score} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-700 mb-1">Seçilen Kriterlere Uygun Kadro Bulunamadı</p>
              <p className="text-xs text-slate-500 mb-4">
                Lütfen filtreleri esnetmeyi veya 3001 genel kadrolarını dahil etmeyi deneyin.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs bg-[#0B1F33] text-white px-4 py-2 rounded-lg font-medium min-h-[36px]"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "guide" && <KamuGuideSection />}

      {/* Güvenlik ve Gizlilik Bildirimi */}
      <div className="mt-8 border-t border-slate-200 pt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sıfır Sunucu Mimarisi: KPSS puanınız ve tercihleriniz yalnızca cihazınızda işlenir.</span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-slate-400">ÖSYM P93 Veritabanı</span>
      </div>
    </div>
  );
}
