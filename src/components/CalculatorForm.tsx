"use client";

/**
 * CalculatorForm.tsx — Kıdem ve İhbar Tazminatı Hesaplama Formu
 * Dayanak: 1475 md. 14 & 4857 md. 17 (Aşama 2 Form UX Sadeleştirmesi)
 */

import React, { useState, useRef } from "react";
import type { RatesConfig } from "@/lib/config/types";
import {
  calculateCompensation,
  type CompensationServiceResult,
} from "@/lib/calculators/compensation";
import { INITIAL_FORM_STATE } from "./calculatorFormConstants";
import { MoneyInputField, DateInputField } from "./FormInputFields";
import { ReasonSelectField, NoticeUsedField } from "./FormSelectFields";

interface CalculatorFormProps {
  rates: RatesConfig;
  onCalculate: (result: CompensationServiceResult) => void;
  onReset?: () => void;
}

export default function CalculatorForm({ rates, onCalculate, onReset }: CalculatorFormProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const refs: Record<string, React.RefObject<HTMLInputElement | HTMLSelectElement | null>> = {
    reason: useRef<HTMLSelectElement>(null),
    noticeUsed: useRef<HTMLSelectElement>(null),
    startIso: useRef<HTMLInputElement>(null),
    exitIso: useRef<HTMLInputElement>(null),
    grossMonthly: useRef<HTMLInputElement>(null),
    extraMonthly: useRef<HTMLInputElement>(null),
    annualBonus: useRef<HTMLInputElement>(null),
    incomeTaxRate: useRef<HTMLSelectElement>(null),
  };

  const showNoticeFields = formData.reason === "employer_unfair";
  const taxRates = rates.income_tax_rates_for_estimate?.rates ?? [0.15, 0.20, 0.27, 0.35, 0.40];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateCompensation(formData, rates);

    if (result.status === "invalid_input") {
      setErrors(result.fieldErrors);
      const firstField = Object.keys(refs).find((key) => result.fieldErrors[key]);
      if (firstField && refs[firstField]?.current) {
        refs[firstField].current?.focus();
      }
    } else {
      setErrors({});
    }
    onCalculate(result);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      {/* 1. Fesih Nedeni */}
      <ReasonSelectField
        value={formData.reason}
        error={errors.reason}
        selectRef={refs.reason as React.RefObject<HTMLSelectElement>}
        onChange={(val) => handleChange("reason", val)}
      />

      {/* 2. İhbar Öneli */}
      {showNoticeFields && (
        <NoticeUsedField
          value={formData.noticeUsed}
          error={errors.noticeUsed}
          selectRef={refs.noticeUsed as React.RefObject<HTMLSelectElement>}
          onChange={(val) => handleChange("noticeUsed", val)}
        />
      )}

      {/* 3. Tarihler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInputField
          id="startIso"
          label="İşe Giriş Tarihi *"
          value={formData.startIso}
          error={errors.startIso}
          inputRef={refs.startIso as React.RefObject<HTMLInputElement>}
          onChange={(val) => handleChange("startIso", val)}
        />
        <DateInputField
          id="exitIso"
          label="İşten Çıkış Tarihi *"
          value={formData.exitIso}
          error={errors.exitIso}
          inputRef={refs.exitIso as React.RefObject<HTMLInputElement>}
          onChange={(val) => handleChange("exitIso", val)}
        />
      </div>

      {/* 4. Maaş ve Gelirler */}
      <div className="flex flex-col gap-4">
        <MoneyInputField
          id="grossMonthly"
          label="Aylık Brüt Maaş (TL) *"
          description="Aylık brüt ücretinizi girin. Kesintiler yapılmadan önceki tutarı yazın."
          placeholder="Örn: 50.000,00"
          value={formData.grossMonthly}
          error={errors.grossMonthly}
          inputRef={refs.grossMonthly as React.RefObject<HTMLInputElement>}
          onChange={(val) => handleChange("grossMonthly", val)}
        />

        <MoneyInputField
          id="extraMonthly"
          label="Düzenli Aylık Ek Ödemeler (TL)"
          description="Yol, yemek, yakacak gibi her ay düzenli aldığınız ek ödemeleri girin."
          placeholder="Örn: 5.000,00"
          value={formData.extraMonthly}
          error={errors.extraMonthly}
          inputRef={refs.extraMonthly as React.RefObject<HTMLInputElement>}
          onChange={(val) => handleChange("extraMonthly", val)}
        />

        <MoneyInputField
          id="annualBonus"
          label="Yıllık İkramiye / Prim Toplamı (TL)"
          description="Son 1 yılda aldığınız brüt ikramiye, prim ve bayram paraları toplamını girin."
          placeholder="Örn: 60.000,00"
          value={formData.annualBonus}
          error={errors.annualBonus}
          inputRef={refs.annualBonus as React.RefObject<HTMLInputElement>}
          onChange={(val) => handleChange("annualBonus", val)}
        />
      </div>

      {/* 5. Gelir Vergisi Oranı */}
      {showNoticeFields && (
        <div className="flex flex-col gap-1">
          <label htmlFor="incomeTaxRate" className="text-sm font-semibold text-gray-900">Tahmini net ihbar için gelir vergisi oranı</label>
          <select
            id="incomeTaxRate"
            ref={refs.incomeTaxRate as React.RefObject<HTMLSelectElement>}
            value={formData.incomeTaxRate}
            onChange={(e) => handleChange("incomeTaxRate", e.target.value)}
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          >
            {taxRates.map((rate) => (
              <option key={rate} value={String(rate)}>%{rate * 100}</option>
            ))}
          </select>
        </div>
      )}

      {/* 6. Butonlar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="min-h-[44px] flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Hesapla
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md text-sm transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
        >
          Temizle
        </button>
      </div>
    </form>
  );
}
