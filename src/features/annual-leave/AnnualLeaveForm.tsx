"use client";

/**
 * AnnualLeaveForm.tsx — Yıllık İzin Ücreti Hesaplama Formu
 * Dayanak: 4857 Sayılı İş Kanunu Madde 53 ve Madde 59
 *
 * Girdiler: İşe giriş tarihi, çıkış tarihi, yaş, kullanılan izin günü, brüt maaş.
 * Doğrulama: Zorunlu alanlar (tarihler, brüt maaş), pozitif değer kontrolü.
 */

import React, { useState, useRef } from "react";
import { DateInputField, MoneyInputField } from "@/components/FormInputFields";

export interface AnnualLeaveFormData {
  startDate: string;
  exitDate: string;
  age: string;
  usedDays: string;
  grossSalary: string;
}

interface AnnualLeaveFormProps {
  onCalculate: (data: AnnualLeaveFormData) => void;
  onReset?: () => void;
}

const INITIAL: AnnualLeaveFormData = {
  startDate: "",
  exitDate: "",
  age: "",
  usedDays: "",
  grossSalary: "",
};

function validateForm(data: AnnualLeaveFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.startDate) errors.startDate = "İşe giriş tarihi zorunludur.";
  if (!data.exitDate) errors.exitDate = "Çıkış tarihi zorunludur.";
  if (data.startDate && data.exitDate && data.exitDate < data.startDate)
    errors.exitDate = "Çıkış tarihi giriş tarihinden önce olamaz.";
  if (!data.grossSalary) errors.grossSalary = "Brüt maaş zorunludur.";
  if (data.age !== "" && (isNaN(Number(data.age)) || Number(data.age) < 14))
    errors.age = "Geçerli bir yaş girin (14 ve üzeri).";
  if (data.usedDays !== "" && (isNaN(Number(data.usedDays)) || Number(data.usedDays) < 0))
    errors.usedDays = "Kullanılan izin günü 0 veya daha büyük olmalıdır.";
  return errors;
}

export default function AnnualLeaveForm({ onCalculate, onReset }: AnnualLeaveFormProps) {
  const [form, setForm] = useState<AnnualLeaveFormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startRef = useRef<HTMLInputElement>(null);
  const exitRef = useRef<HTMLInputElement>(null);
  const grossRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AnnualLeaveFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.startDate) startRef.current?.focus();
      else if (errs.exitDate) exitRef.current?.focus();
      else if (errs.grossSalary) grossRef.current?.focus();
      return;
    }
    setErrors({});
    onCalculate(form);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      {/* Tarihler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInputField
          id="alStartDate"
          label="İşe Giriş Tarihi *"
          value={form.startDate}
          error={errors.startDate}
          inputRef={startRef}
          onChange={(v) => handleChange("startDate", v)}
        />
        <DateInputField
          id="alExitDate"
          label="Çıkış / Hesaplama Tarihi *"
          value={form.exitDate}
          error={errors.exitDate}
          inputRef={exitRef}
          onChange={(v) => handleChange("exitDate", v)}
        />
      </div>

      {/* Yaş */}
      <div className="flex flex-col gap-1">
        <label htmlFor="alAge" className="text-sm font-semibold text-gray-900">
          Hesaplama Tarihindeki Yaşınız
        </label>
        <span id="alAge-desc" className="text-xs text-gray-600">
          18 yaş ve altı ile 50 yaş ve üstü için minimum 20 gün izin hakkı uygulanır (md. 53/5).
        </span>
        <input
          id="alAge"
          type="number"
          inputMode="numeric"
          min="14"
          max="99"
          value={form.age}
          onChange={(e) => handleChange("age", e.target.value)}
          aria-describedby={errors.age ? "alAge-desc alAge-err" : "alAge-desc"}
          aria-invalid={!!errors.age}
          placeholder="Örn: 32"
          className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
        />
        {errors.age && <span id="alAge-err" role="alert" className="text-xs text-red-600 font-medium">{errors.age}</span>}
      </div>

      {/* Kullanılan İzin Günü */}
      <div className="flex flex-col gap-1">
        <label htmlFor="alUsedDays" className="text-sm font-semibold text-gray-900">
          Bugüne Kadar Kullandığınız Yıllık İzin Günü
        </label>
        <input
          id="alUsedDays"
          type="number"
          inputMode="numeric"
          min="0"
          value={form.usedDays}
          onChange={(e) => handleChange("usedDays", e.target.value)}
          aria-invalid={!!errors.usedDays}
          aria-describedby={errors.usedDays ? "alUsedDays-err" : undefined}
          placeholder="Örn: 14"
          className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
        />
        {errors.usedDays && <span id="alUsedDays-err" role="alert" className="text-xs text-red-600 font-medium">{errors.usedDays}</span>}
      </div>

      {/* Brüt Maaş */}
      <MoneyInputField
        id="alGrossSalary"
        label="Güncel Aylık Brüt Maaş (TL) *"
        description="İzin ücreti hesabında kullanılır. Kesintiler yapılmadan önceki tutarı yazın."
        placeholder="Örn: 50.000,00"
        value={form.grossSalary}
        error={errors.grossSalary}
        inputRef={grossRef}
        onChange={(v) => handleChange("grossSalary", v)}
      />

      {/* Butonlar */}
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
