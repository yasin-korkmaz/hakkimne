"use client";

import React from "react";
import { MoneyInputField } from "../FormInputFields";

/**
 * Step2Salary.tsx — 2. Adım: Ücret Bilgisi (Brüt / Net Seçimi)
 * Dayanak: 1475 sayılı Kanun md. 14 (tazminata esas brüt ücret) ve GVK 103 vergi dilimleri.
 */

interface Step2SalaryProps {
  salaryType: "brut" | "net";
  onSalaryTypeChange: (type: "brut" | "net") => void;
  salaryInput: string;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  showNoticeFields: boolean;
  incomeTaxRate: string;
  taxRates: number[];
  taxRateRef: React.RefObject<HTMLSelectElement | null>;
  onTaxRateChange: (value: string) => void;
}

export default function Step2Salary({
  salaryType,
  onSalaryTypeChange,
  salaryInput,
  error,
  inputRef,
  onChange,
  showNoticeFields,
  incomeTaxRate,
  taxRates,
  taxRateRef,
  onTaxRateChange,
}: Step2SalaryProps) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-base font-bold text-slate-900">2. Adım: Ücret Bilgisi</h3>
        <p className="text-xs text-slate-500">
          Maaşınızı brüt veya net olarak girebilirsiniz.
        </p>
      </div>

      {/* Brüt / Net Seçim Sekmeleri */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700">Ücret Türü *</span>
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => onSalaryTypeChange("brut")}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              salaryType === "brut"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Brüt Maaş
          </button>
          <button
            type="button"
            onClick={() => onSalaryTypeChange("net")}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              salaryType === "net"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Net Maaş (Otomatik Brüt)
          </button>
        </div>
        {salaryType === "net" && (
          <p className="text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
            Girdiğiniz net maaş, 2026 yasal kesintileri (SGK ve Gelir Vergisi) dikkate alınarak otomatik olarak brüte dönüştürülecektir.
          </p>
        )}
      </div>

      {/* Maaş Tutarı */}
      <MoneyInputField
        id="grossMonthly"
        label={salaryType === "brut" ? "Aylık Brüt Maaş (TL) *" : "Aylık Net Maaş (TL) *"}
        description={
          salaryType === "brut"
            ? "Bordronuzdaki kesintiler yapılmadan önceki aylık brüt ücretinizi girin."
            : "Her ay banka hesabınıza yatan net ücretinizi girin."
        }
        placeholder={salaryType === "brut" ? "Örn: 50.000,00" : "Örn: 35.000,00"}
        value={salaryInput}
        error={error}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        onChange={onChange}
      />

      {/* Gelir Vergisi Oranı (İhbar tazminatı varsa) */}
      {showNoticeFields && (
        <div className="flex flex-col gap-1 pt-1">
          <label htmlFor="incomeTaxRate" className="text-sm font-semibold text-gray-900">
            Tahmini net ihbar için gelir vergisi oranı
          </label>
          <select
            id="incomeTaxRate"
            ref={taxRateRef as React.RefObject<HTMLSelectElement>}
            value={incomeTaxRate}
            onChange={(e) => onTaxRateChange(e.target.value)}
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          >
            {taxRates.map((rate) => (
              <option key={rate} value={String(rate)}>
                %{rate * 100}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
