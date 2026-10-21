"use client";

/**
 * Calculator.tsx — Ana Hesaplayıcı Konteyner Bileşeni
 * Dayanak: PRD & AGENTS.md
 *
 * Algoritma:
 *  1. ratesSource üzerinden çalışma oranlarını ve isTestData durumunu alır.
 *  2. isTestData aktifse ekranın en üstünde kırmızı uyarı bandı gösterir.
 *  3. CalculatorForm ile kullanıcı girdilerini toplar.
 *  4. Sonuçları aria-live="polite" konteyneri içinde yönetir:
 *     - blocked: tavan veya kilit hatası mesajı gösterilir, TL tutarı basılmaz.
 *     - unsure_reason: uzman yönlendirme uyarısı gösterilir, TL tutarı basılmaz.
 *     - ok: ResultSummary, ReceiptTable ve NoticeList eksiksiz render edilir.
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

  const handleReset = () => {
    setResult(null);
  };

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

            {/* Başarılı Hesaplama Durumu */}
            {result.status === "ok" && (
              <div className="w-full flex flex-col gap-6">
                <ResultSummary
                  rows={buildReceipt(result, rates)}
                  severanceEligible={result.severance.eligible}
                  noticeEligible={result.notice.eligible}
                />

                <ReceiptTable rows={buildReceipt(result, rates)} />

                <NoticeList notices={buildNotices(result)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
