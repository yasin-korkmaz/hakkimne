"use client";

/**
 * OvertimeForm.tsx — Fazla Mesai Hesaplama Formu
 * Dayanak: 4857 Sayılı İş Kanunu Madde 41 ve Madde 63
 */

import React, { useState, useRef } from "react";
import { MoneyInputField } from "@/components/FormInputFields";

export interface OvertimeFormData {
  grossSalary: string;
  weeklyContractHours: string;
  weeklyWorkedHours: string;
}

interface OvertimeFormProps {
  onCalculate: (data: OvertimeFormData) => void;
  onReset?: () => void;
}

const INITIAL_STATE: OvertimeFormData = {
  grossSalary: "",
  weeklyContractHours: "45",
  weeklyWorkedHours: "",
};

function validateOvertimeForm(data: OvertimeFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.grossSalary) {
    errors.grossSalary = "Aylık brüt maaş zorunludur.";
  }

  const contractHours = Number(data.weeklyContractHours);
  if (!data.weeklyContractHours || isNaN(contractHours) || contractHours <= 0) {
    errors.weeklyContractHours = "Geçerli bir sözleşme süresi girin.";
  } else if (contractHours > 45) {
    errors.weeklyContractHours = "Haftalık sözleşme süresi yasal sınır olan 45 saati aşamaz.";
  }

  const workedHours = Number(data.weeklyWorkedHours);
  if (data.weeklyWorkedHours === "" || isNaN(workedHours) || workedHours < 0) {
    errors.weeklyWorkedHours = "Haftalık gerçekleşen çalışma saati 0 veya daha büyük olmalıdır.";
  }

  return errors;
}

export default function OvertimeForm({ onCalculate, onReset }: OvertimeFormProps) {
  const [formData, setFormData] = useState<OvertimeFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grossRef = useRef<HTMLInputElement>(null);
  const contractRef = useRef<HTMLInputElement>(null);
  const workedRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof OvertimeFormData, value: string) => {
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
    const validationErrors = validateOvertimeForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.grossSalary) grossRef.current?.focus();
      else if (validationErrors.weeklyContractHours) contractRef.current?.focus();
      else if (validationErrors.weeklyWorkedHours) workedRef.current?.focus();
      return;
    }

    setErrors({});
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      {/* 1. Aylık Brüt Maaş */}
      <MoneyInputField
        id="otGrossSalary"
        label="Aylık Brüt Maaş (TL) *"
        description="Saatlik ücret hesabında (Brüt / 225) kullanılır. Kesintiler yapılmadan önceki tutarı girin."
        placeholder="Örn: 45.000,00"
        value={formData.grossSalary}
        error={errors.grossSalary}
        inputRef={grossRef}
        onChange={(val) => handleChange("grossSalary", val)}
      />

      {/* 2. Haftalık Sözleşme Süresi */}
      <div className="flex flex-col gap-1">
        <label htmlFor="otContractHours" className="text-sm font-semibold text-gray-900">
          Haftalık Sözleşme Çalışma Süresi (Saat) *
        </label>
        <span id="otContractHours-desc" className="text-xs text-gray-600">
          İş sözleşmenizdeki haftalık normal çalışma süresi (Yasal azami sınır 45 saattir).
        </span>
        <input
          id="otContractHours"
          type="number"
          inputMode="numeric"
          min="1"
          max="45"
          step="0.5"
          ref={contractRef}
          value={formData.weeklyContractHours}
          onChange={(e) => handleChange("weeklyContractHours", e.target.value)}
          aria-describedby={errors.weeklyContractHours ? "otContractHours-desc otContractHours-err" : "otContractHours-desc"}
          aria-invalid={!!errors.weeklyContractHours}
          placeholder="45"
          className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
        />
        {errors.weeklyContractHours && (
          <span id="otContractHours-err" role="alert" className="text-xs text-red-600 font-medium">
            {errors.weeklyContractHours}
          </span>
        )}
      </div>

      {/* 3. Haftalık Fiili Çalışma Saati */}
      <div className="flex flex-col gap-1">
        <label htmlFor="otWorkedHours" className="text-sm font-semibold text-gray-900">
          Haftalık Gerçekleşen Toplam Çalışma Saati *
        </label>
        <span id="otWorkedHours-desc" className="text-xs text-gray-600">
          İlgili haftada fiilen çalıştığınız toplam süre (Örn: 50 saat).
        </span>
        <input
          id="otWorkedHours"
          type="number"
          inputMode="numeric"
          min="0"
          step="0.5"
          ref={workedRef}
          value={formData.weeklyWorkedHours}
          onChange={(e) => handleChange("weeklyWorkedHours", e.target.value)}
          aria-describedby={errors.weeklyWorkedHours ? "otWorkedHours-desc otWorkedHours-err" : "otWorkedHours-desc"}
          aria-invalid={!!errors.weeklyWorkedHours}
          placeholder="Örn: 50"
          className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
        />
        {errors.weeklyWorkedHours && (
          <span id="otWorkedHours-err" role="alert" className="text-xs text-red-600 font-medium">
            {errors.weeklyWorkedHours}
          </span>
        )}
      </div>

      {/* 4. Butonlar */}
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
