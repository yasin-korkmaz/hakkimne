"use client";

/**
 * Calculator.tsx — Ana Hesaplayıcı Konteyner Bileşeni
 * Dayanak: PRD & AGENTS.md (Aşama 2: İki Katmanlı Sonuç Ekranı)
 */

import React, { useState } from "react";
import { getRates, type RatesSourceResult } from "@/lib/config/ratesSource";
import type { CompensationServiceResult } from "@/lib/calculators/compensation";
import { buildReceipt } from "@/lib/receipt/buildReceipt";
import { buildNotices } from "@/lib/receipt/buildNotices";
import CalculatorForm from "./CalculatorForm";
import ResultSummary from "./ResultSummary";
import ReceiptTable from "./ReceiptTable";
import NoticeList from "./NoticeList";

interface CalculatorProps {
  ratesData?: RatesSourceResult;
}

export default function Calculator({ ratesData }: CalculatorProps) {
  const currentRatesData = ratesData ?? getRates();
  const { rates, isTestData } = currentRatesData;

  const [result, setResult] = useState<CompensationServiceResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleReset = () => {
    setResult(null);
    setShowDetails(false);
  };

  const totalNet =
    result?.status === "ok"
      ? (result.severance.eligible ? result.severance.netSeverance : 0) +
        (result.notice.eligible ? result.notice.estimatedNetNotice : 0)
      : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* 1. Test Verisi Uyarı Bandı */}
      {isTestData && (
        <div
          role="status"
          className="w-full bg-red-600 text-white font-bold text-center py-2.5 px-4 rounded-lg text-sm shadow-sm tracking-wide"
        >
          TEST VERİSİ — gerçek oran değildir
        </div>
      )}

      {/* 2. Girdi Formu */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <CalculatorForm
          rates={rates}
          onCalculate={setResult}
          onReset={handleReset}
        />
      </div>

      {/* 3. Sonuç Konteyneri (Erişilebilir Canlı Bölge) */}
      <div aria-live="polite" className="w-full flex flex-col gap-6">
        {result && (
          <>
            {/* Engellenmiş / Kilit Durumu */}
            {result.status === "blocked" && (
              <div
                role="alert"
                className="p-5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-medium text-sm leading-relaxed shadow-sm"
              >
                {result.message}
              </div>
            )}

            {/* Fesih Nedeni Emin Değilim Durumu */}
            {result.status === "unsure_reason" && (
              <div className="w-full">
                <NoticeList notices={buildNotices(result)} />
              </div>
            )}

            {/* Başarılı Hesaplama Durumu: İki Katmanlı Sonuç */}
            {result.status === "ok" && (
              <div className="w-full flex flex-col gap-6">
                {/* Katman 1: Hesaplama Özeti */}
                <ResultSummary
                  rows={buildReceipt(result, rates)}
                  severanceEligible={result.severance.eligible}
                  noticeEligible={result.notice.eligible}
                  totalNet={totalNet}
                />

                {/* Katman 2 Toggle Butonu */}
                <div className="w-full flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    aria-expanded={showDetails}
                    aria-controls="detailed-receipt"
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

                {/* Katman 2: Adım Adım Hesaplama Fişi */}
                {showDetails && (
                  <div id="detailed-receipt" className="w-full">
                    <ReceiptTable rows={buildReceipt(result, rates)} />
                  </div>
                )}

                {/* Durum / Tavan Uyarıları */}
                <NoticeList notices={buildNotices(result)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
