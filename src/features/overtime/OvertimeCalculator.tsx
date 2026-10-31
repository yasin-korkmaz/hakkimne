"use client";

/**
 * OvertimeCalculator.tsx — Fazla Mesai Hesaplayıcı Konteyner Bileşeni
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Madde 63
 */

import React, { useState } from "react";
import { calculateOvertime } from "./engine";
import type { OvertimeResult as Result } from "./types";
import { parseTRNumber } from "@/lib/utils/format";
import OvertimeForm, { type OvertimeFormData } from "./OvertimeForm";
import OvertimeResultView from "./OvertimeResult";

export default function OvertimeCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [activeContractHours, setActiveContractHours] = useState<number>(45);
  const [activeWorkedHours, setActiveWorkedHours] = useState<number>(0);

  const handleCalculate = (data: OvertimeFormData) => {
    try {
      const grossSalary = parseTRNumber(data.grossSalary) ?? 0;
      const weeklyContractHours = Number(data.weeklyContractHours) || 45;
      const weeklyWorkedHours = Number(data.weeklyWorkedHours) || 0;

      const res = calculateOvertime({
        grossSalary,
        weeklyContractHours,
        weeklyWorkedHours,
      });

      setActiveContractHours(weeklyContractHours);
      setActiveWorkedHours(weeklyWorkedHours);
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
        <OvertimeForm onCalculate={handleCalculate} onReset={handleReset} />
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

        {result && !calcError && (
          <OvertimeResultView
            result={result}
            contractHours={activeContractHours}
            workedHours={activeWorkedHours}
          />
        )}
      </div>
    </div>
  );
}
