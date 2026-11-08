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
import ResultScreen from "./ResultScreen";
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

  const handleCalculate = (res: CompensationServiceResult) => {
    setResult(res);
    if (res.status === "ok") {
      try {
        fetch("https://sayac.hakkimnedir.workers.dev/api/hesaplama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tur: "tazminat" }),
        }).catch(() => {});
      } catch {
        // Telemetri hatası sessizce yutulur
      }
    }
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
          onCalculate={handleCalculate}
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

            {/* Başarılı Hesaplama Durumu: İki Katmanlı Sonuç ve Eylem Merkezi */}
            {result.status === "ok" && (
              <ResultScreen
                result={result}
                rates={rates}
                showDetails={showDetails}
                onToggleDetails={() => setShowDetails((prev) => !prev)}
                totalNet={totalNet}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
