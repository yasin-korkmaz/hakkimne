"use client";

/**
 * CalculatorForm.tsx — Kıdem ve İhbar Tazminatı Hesaplama Formu
 * Dayanak: 1475 md. 14 & 4857 md. 17
 *
 * Algoritma:
 *  1. Kullanıcıdan fesih nedeni, ihbar öneli, tarihler ve gelirleri toplar.
 *  2. Ağ isteği ve yerel depolama KESİNLİKLE KULLANMAZ (AGENTS.md Kural 6).
 *  3. Gönderimde calculateCompensation çağrılır; hata varsa ilk alana odaklanır.
 *  4. Başarılı sonuç onCalculate prop'u ile üst bileşene aktarılır.
 */

import React, { useState, useRef } from "react";
import type { RatesConfig } from "@/lib/config/types";
import {
  calculateCompensation,
  type CompensationServiceResult,
} from "@/lib/calculators/compensation";

interface CalculatorFormProps {
  rates: RatesConfig;
  onCalculate: (result: CompensationServiceResult) => void;
  onReset?: () => void;
}

const REASON_OPTIONS = [
  { value: "employer_unfair", label: "İşveren beni haklı bir neden olmadan işten çıkardı" },
  { value: "employee_just_cause", label: "Ben haklı bir nedenle işten ayrıldım (4857 md. 24)" },
  { value: "retirement_military_marriage", label: "Emeklilik, askerlik veya (kadın çalışan için) evlilik nedeniyle ayrıldım" },
  { value: "voluntary_resignation", label: "Kendi isteğimle, haklı bir neden olmadan istifa ettim" },
  { value: "employer_just_cause", label: "İşveren beni haklı nedenle derhal çıkardı (4857 md. 25/II)" },
  { value: "other_unsure", label: "Diğer / emin değilim" },
];

const INITIAL_STATE = {
  reason: "",
  noticeUsed: "no",
  startIso: "",
  exitIso: "",
  grossMonthly: "",
  extraMonthly: "",
  annualBonus: "",
  incomeTaxRate: "0.15",
};

export default function CalculatorForm({ rates, onCalculate, onReset }: CalculatorFormProps) {
  const [formData, setFormData] = useState(INITIAL_STATE);
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
    setFormData(INITIAL_STATE);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      {/* 1. Fesih Nedeni */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reason" className="text-sm font-semibold text-gray-900">
          İşten Ayrılış / Fesih Nedeni *
        </label>
        <span id="reason-desc" className="text-xs text-gray-600">Durumunuza en uygun fesih gerekçesini seçiniz.</span>
        <select
          id="reason"
          ref={refs.reason as React.RefObject<HTMLSelectElement>}
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          aria-describedby={errors.reason ? "reason-desc reason-err" : "reason-desc"}
          aria-invalid={!!errors.reason}
          className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
        >
          <option value="">Lütfen seçiniz</option>
          {REASON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.reason && <span id="reason-err" className="text-xs text-red-600 font-medium">{errors.reason}</span>}
      </div>

      {/* 2. İhbar Öneli */}
      {showNoticeFields && (
        <div className="flex flex-col gap-1 bg-blue-50/60 p-3 rounded-md border border-blue-100">
          <label htmlFor="noticeUsed" className="text-sm font-semibold text-gray-900">
            İhbar Süresi Kullandırıldı mı? *
          </label>
          <span id="notice-desc" className="text-xs text-gray-600">İşten çıkarılmadan önce ihbar süreniz çalıştırıldı mı?</span>
          <select
            id="noticeUsed"
            ref={refs.noticeUsed as React.RefObject<HTMLSelectElement>}
            value={formData.noticeUsed}
            onChange={(e) => handleChange("noticeUsed", e.target.value)}
            aria-describedby={errors.noticeUsed ? "notice-desc notice-err" : "notice-desc"}
            aria-invalid={!!errors.noticeUsed}
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="no">Hayır, kullandırılmadı (İhbar tazminatı talep ediyorum)</option>
            <option value="yes">Evet, ihbar süresi boyunca çalıştım</option>
          </select>
          {errors.noticeUsed && <span id="notice-err" className="text-xs text-red-600 font-medium">{errors.noticeUsed}</span>}
        </div>
      )}

      {/* 3. Tarihler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="startIso" className="text-sm font-semibold text-gray-900">İşe Giriş Tarihi *</label>
          <input
            id="startIso"
            type="date"
            ref={refs.startIso as React.RefObject<HTMLInputElement>}
            value={formData.startIso}
            onChange={(e) => handleChange("startIso", e.target.value)}
            aria-invalid={!!errors.startIso}
            aria-describedby={errors.startIso ? "start-err" : undefined}
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          />
          {errors.startIso && <span id="start-err" className="text-xs text-red-600 font-medium">{errors.startIso}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="exitIso" className="text-sm font-semibold text-gray-900">İşten Çıkış Tarihi *</label>
          <input
            id="exitIso"
            type="date"
            ref={refs.exitIso as React.RefObject<HTMLInputElement>}
            value={formData.exitIso}
            onChange={(e) => handleChange("exitIso", e.target.value)}
            aria-invalid={!!errors.exitIso}
            aria-describedby={errors.exitIso ? "exit-err" : undefined}
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          />
          {errors.exitIso && <span id="exit-err" className="text-xs text-red-600 font-medium">{errors.exitIso}</span>}
        </div>
      </div>

      {/* 4. Maaş ve Gelirler */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="grossMonthly" className="text-sm font-semibold text-gray-900">Aylık Brüt Maaş (TL) *</label>
          <span id="gross-desc" className="text-xs text-gray-600">Bordronuzdaki çıplak brüt maaş tutarı.</span>
          <input
            id="grossMonthly"
            type="text"
            inputMode="decimal"
            ref={refs.grossMonthly as React.RefObject<HTMLInputElement>}
            value={formData.grossMonthly}
            onChange={(e) => handleChange("grossMonthly", e.target.value)}
            aria-describedby={errors.grossMonthly ? "gross-desc gross-err" : "gross-desc"}
            aria-invalid={!!errors.grossMonthly}
            placeholder="Örn: 50.000,00"
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          />
          {errors.grossMonthly && <span id="gross-err" className="text-xs text-red-600 font-medium">{errors.grossMonthly}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="extraMonthly" className="text-sm font-semibold text-gray-900">Düzenli Aylık Ek Ödemeler (TL)</label>
          <span id="extra-desc" className="text-xs text-gray-600">Yol, yemek, yakacak gibi düzenli aylık brüt yardımlar.</span>
          <input
            id="extraMonthly"
            type="text"
            inputMode="decimal"
            ref={refs.extraMonthly as React.RefObject<HTMLInputElement>}
            value={formData.extraMonthly}
            onChange={(e) => handleChange("extraMonthly", e.target.value)}
            aria-describedby={errors.extraMonthly ? "extra-desc extra-err" : "extra-desc"}
            aria-invalid={!!errors.extraMonthly}
            placeholder="Örn: 5.000,00"
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          />
          {errors.extraMonthly && <span id="extra-err" className="text-xs text-red-600 font-medium">{errors.extraMonthly}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="annualBonus" className="text-sm font-semibold text-gray-900">Yıllık İkramiye / Prim Toplamı (TL)</label>
          <span id="bonus-desc" className="text-xs text-gray-600">Son 1 yılda ödenen brüt ikramiye, prim ve bayram paraları toplamı.</span>
          <input
            id="annualBonus"
            type="text"
            inputMode="decimal"
            ref={refs.annualBonus as React.RefObject<HTMLInputElement>}
            value={formData.annualBonus}
            onChange={(e) => handleChange("annualBonus", e.target.value)}
            aria-describedby={errors.annualBonus ? "bonus-desc bonus-err" : "bonus-desc"}
            aria-invalid={!!errors.annualBonus}
            placeholder="Örn: 60.000,00"
            className="min-h-[44px] px-3 py-2 border rounded-md border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
          />
          {errors.annualBonus && <span id="bonus-err" className="text-xs text-red-600 font-medium">{errors.annualBonus}</span>}
        </div>
      </div>

      {/* 5. Gelir Vergisi Oranı */}
      {showNoticeFields && (
        <div className="flex flex-col gap-1">
          <label htmlFor="incomeTaxRate" className="text-sm font-semibold text-gray-900">
            Tahmini net ihbar için gelir vergisi oranı
          </label>
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
