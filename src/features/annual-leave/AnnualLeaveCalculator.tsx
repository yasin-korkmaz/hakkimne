"use client";

/**
 * AnnualLeaveCalculator.tsx — Yıllık İzin Hesaplayıcı Konteyner Bileşeni
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 *
 * Form girişini alır, engine.ts motorunu çağırır, AnnualLeaveResult ile sonucu gösterir.
 * parseTRNumber ile Türkçe formatlı maaş metni sayıya çevrilir.
 */

import React, { useState } from "react";
import { calculateAnnualLeave } from "./engine";
import type { AnnualLeaveResult as Result } from "./types";
import { parseTRNumber } from "@/lib/utils/format";
import AnnualLeaveForm, { type AnnualLeaveFormData } from "./AnnualLeaveForm";
import AnnualLeaveResult from "./AnnualLeaveResult";

export default function AnnualLeaveCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const handleCalculate = (data: AnnualLeaveFormData) => {
    try {
      const grossSalary = parseTRNumber(data.grossSalary) ?? 0;
      const age = data.age !== "" ? Number(data.age) : undefined;
      const usedDays = data.usedDays !== "" ? Number(data.usedDays) : 0;

      const res = calculateAnnualLeave({
        startDate: data.startDate,
        exitDate: data.exitDate,
        age,
        usedDays,
        grossSalary,
      });

      setCalcError(null);
      setResult(res);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : "Hesaplama sırasında hata oluştu.");
      setResult(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCalcError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Girdi Formu */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <AnnualLeaveForm onCalculate={handleCalculate} onReset={handleReset} />
      </div>

      {/* Sonuç Alanı */}
      <div aria-live="polite" className="w-full">
        {calcError && (
          <div role="alert" className="p-5 rounded-xl border border-red-300 bg-red-50 text-red-900 font-medium text-sm leading-relaxed shadow-sm">
            {calcError}
          </div>
        )}
        {result && !calcError && <AnnualLeaveResult result={result} />}
      </div>
    </div>
  );
}
