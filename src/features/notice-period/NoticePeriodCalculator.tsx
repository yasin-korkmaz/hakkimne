"use client";

/**
 * NoticePeriodCalculator.tsx — İhbar Süresi Hesaplayıcı Konteyner Bileşeni
 * Dayanak: 4857 Sayılı İş Kanunu Madde 17
 */

import React, { useState } from "react";
import { calculateNoticePeriod } from "./engine";
import type { NoticePeriodResult as Result } from "./types";
import NoticePeriodForm, { type NoticePeriodFormData } from "./NoticePeriodForm";
import NoticePeriodResultView from "./NoticePeriodResult";

export default function NoticePeriodCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const handleCalculate = (data: NoticePeriodFormData) => {
    try {
      const res = calculateNoticePeriod({
        startDate: data.startDate,
        notificationDate: data.notificationDate,
      });

      setCalcError(null);
      setResult(res);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : "Hesaplama sırasında bir hata oluştu.");
      setResult(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCalcError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* 1. Girdi Formu */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <NoticePeriodForm onCalculate={handleCalculate} onReset={handleReset} />
      </div>

      {/* 2. Sonuç Alanı */}
      <div aria-live="polite" className="w-full">
        {calcError && (
          <div
            role="alert"
            className="p-5 rounded-xl border border-red-300 bg-red-50 text-red-900 font-medium text-sm leading-relaxed shadow-sm"
          >
            {calcError}
          </div>
        )}

        {result && !calcError && <NoticePeriodResultView result={result} />}
      </div>
    </div>
  );
}
