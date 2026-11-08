"use client";

/**
 * CalculatorForm.tsx — 3 Adımlı Kıdem ve İhbar Tazminatı Sihirbaz Formu
 * Dayanak: 1475 md. 14 & 4857 md. 17 (İlerleme çubuklu modern Wizard UX)
 */

import React, { useState, useRef } from "react";
import type { RatesConfig } from "@/lib/config/types";
import {
  calculateCompensation,
  type CompensationServiceResult,
} from "@/lib/calculators/compensation";
import { nettenBrute } from "@/lib/netBrutHesapla";
import { parseTRNumber } from "@/lib/utils/format";
import { trackEvent } from "@/lib/analytics";
import { INITIAL_FORM_STATE } from "./calculatorFormConstants";
import ProgressBar from "./calculator/ProgressBar";
import Step1BasicInfo from "./calculator/Step1BasicInfo";
import Step2Salary from "./calculator/Step2Salary";
import Step3Benefits from "./calculator/Step3Benefits";
import WizardNav from "./calculator/WizardNav";

interface CalculatorFormProps {
  rates: RatesConfig;
  onCalculate: (result: CompensationServiceResult) => void;
  onReset?: () => void;
}

export default function CalculatorForm({
  rates,
  onCalculate,
  onReset,
}: CalculatorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [salaryType, setSalaryType] = useState<"brut" | "net">("brut");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const refs = {
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
  const taxRates = rates.income_tax_rates_for_estimate?.rates ?? [0.15, 0.2, 0.27, 0.35, 0.4];

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

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.reason) errs.reason = "Fesih nedeni seçilmelidir.";
    if (!formData.startIso) errs.startIso = "İşe giriş tarihi girilmelidir.";
    if (!formData.exitIso) errs.exitIso = "İşten çıkış tarihi girilmelidir.";
    else if (formData.startIso && formData.exitIso < formData.startIso) {
      errs.exitIso = "İşten çıkış tarihi, işe giriş tarihinden önce olamaz.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.reason) refs.reason.current?.focus();
      else if (errs.startIso) refs.startIso.current?.focus();
      else if (errs.exitIso) refs.exitIso.current?.focus();
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    const val = parseTRNumber(formData.grossMonthly);
    if (!formData.grossMonthly.trim()) {
      errs.grossMonthly =
        salaryType === "brut" ? "Aylık brüt maaş girilmelidir." : "Aylık net maaş girilmelidir.";
    } else if (val === null || isNaN(val) || val <= 0) {
      errs.grossMonthly = "Maaş 0'dan büyük geçerli bir tutar olmalıdır.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      refs.grossMonthly.current?.focus();
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        trackEvent("calc_start");
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      handleNext();
      return;
    }

    trackEvent("calc_submit");
    let effectiveGross = formData.grossMonthly;
    if (salaryType === "net") {
      const netVal = parseTRNumber(formData.grossMonthly);
      if (netVal !== null && !isNaN(netVal) && netVal > 0) {
        effectiveGross = String(nettenBrute(netVal).brutUcret);
      }
    }

    const payload = { ...formData, grossMonthly: effectiveGross };
    const result = calculateCompensation(payload, rates);

    if (result.status === "invalid_input") {
      setErrors(result.fieldErrors);
    } else {
      setErrors({});
    }
    onCalculate(result);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setSalaryType("brut");
    setCurrentStep(1);
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      <ProgressBar currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />
      {currentStep === 1 && (
        <Step1BasicInfo
          formData={formData}
          errors={errors}
          showNoticeFields={showNoticeFields}
          refs={refs}
          onChange={handleChange}
        />
      )}
      {currentStep === 2 && (
        <Step2Salary
          salaryType={salaryType}
          onSalaryTypeChange={(t) => setSalaryType(t)}
          salaryInput={formData.grossMonthly}
          error={errors.grossMonthly}
          inputRef={refs.grossMonthly}
          onChange={(val) => handleChange("grossMonthly", val)}
          showNoticeFields={showNoticeFields}
          incomeTaxRate={formData.incomeTaxRate}
          taxRates={taxRates}
          taxRateRef={refs.incomeTaxRate}
          onTaxRateChange={(val) => handleChange("incomeTaxRate", val)}
        />
      )}
      {currentStep === 3 && (
        <Step3Benefits
          extraMonthly={formData.extraMonthly}
          annualBonus={formData.annualBonus}
          errors={errors}
          refs={refs}
          onChange={handleChange}
        />
      )}
      <WizardNav
        currentStep={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={handleReset}
      />
    </form>
  );
}
