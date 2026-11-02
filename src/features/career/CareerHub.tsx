"use client";

import React, { useState } from "react";
import type { JobOffer, OfferWeights, OfferComparisonResult } from "./types";
import { compareOffers } from "./offerEngine";
import OfferComparisonForm from "./OfferComparisonForm";
import OfferComparisonResultView from "./OfferComparisonResultView";
import InterviewSimulator from "./InterviewSimulator";

export default function CareerHub() {
  const [activeTab, setActiveTab] = useState<"compare" | "interview">("compare");
  const [offerResult, setOfferResult] = useState<OfferComparisonResult | null>(null);

  const handleCompare = (offerA: JobOffer, offerB: JobOffer, weights: OfferWeights) => {
    const res = compareOffers(offerA, offerB, weights);
    setOfferResult(res);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Gizlilik Güvencesi */}
      <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-slate-800 shadow-xs">
        <svg className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="text-[#0B1F33]">Gizlilik Esaslı Kariyer Araçları:</strong> Girdiğiniz maaş teklifleri, çalışma saatleri ve mülakat simülasyon yanıtları sunucularımıza kaydedilmez. Tüm analizler tarayıcınızda yerel olarak çalışır.
        </div>
      </div>

      {/* Sekmeler (Tabs) */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl self-start">
        <button
          type="button"
          onClick={() => setActiveTab("compare")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
            activeTab === "compare"
              ? "bg-white text-[#0B1F33] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          İş Teklifi Karşılaştırma
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("interview")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
            activeTab === "interview"
              ? "bg-white text-[#0B1F33] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Mülakat Simülatörü (STAR)
        </button>
      </div>

      {/* Sekme İçerikleri */}
      {activeTab === "compare" ? (
        !offerResult ? (
          <OfferComparisonForm onCompare={handleCompare} />
        ) : (
          <OfferComparisonResultView
            result={offerResult}
            onEdit={() => setOfferResult(null)}
          />
        )
      ) : (
        <InterviewSimulator />
      )}
    </div>
  );
}
