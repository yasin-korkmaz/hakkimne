/**
 * validation.ts — Ham form girdisi doğrulama yardımcısı.
 * Dayanak: PRD Bölüm 3 (Fesih Nedenleri ve Girdi Kuralları)
 *
 * Algoritma Özeti:
 *  1. Fesih nedeni (reason) zorunlu ve geçerli bir seçenek olmalıdır.
 *  2. 'employer_unfair' seçildiyse noticeUsed ('yes' | 'no') zorunludur.
 *  3. startIso ve exitIso geçerli takvim tarihi olmalı ve startIso >= '1970-01-01'.
 *  4. exitIso >= startIso olmalıdır (değilse Türkçe hata döner).
 *  5. grossMonthly zorunlu, > 0 ve <= 100.000.000 TL olmalıdır (parseTRNumber ile sayıya çevrilir).
 *  6. extraMonthly ve annualBonus >= 0 ve <= 100.000.000 TL olmalıdır (boşsa 0 kabul edilir).
 *  7. incomeTaxRate, rates.income_tax_rates_for_estimate içinde olmalıdır (boşsa default_rate).
 */

import type { RatesConfig } from "@/lib/config/types";
import type { TerminationReason } from "@/lib/calculators/severance";
import { parseIsoDate } from "@/lib/utils/dateDuration";
import { parseTRNumber } from "@/lib/utils/format";

export type InputTerminationReason = TerminationReason | "other_unsure";

export interface RawCompensationInput {
  reason?: string;
  noticeUsed?: string;
  startIso?: string;
  exitIso?: string;
  grossMonthly?: string | number;
  extraMonthly?: string | number;
  annualBonus?: string | number;
  incomeTaxRate?: string | number;
}

export interface ValidatedCompensationInput {
  reason: InputTerminationReason;
  noticeUsed?: "yes" | "no";
  noticeWorked: boolean;
  startIso: string;
  exitIso: string;
  grossMonthly: number;
  extraMonthly: number;
  annualBonus: number;
  incomeTaxRate: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  fieldErrors: Record<string, string>;
  data?: ValidatedCompensationInput;
}

const VALID_REASONS = new Set<string>([
  "employer_unfair",
  "employee_just_cause",
  "retirement_military_marriage",
  "voluntary_resignation",
  "employer_just_cause",
  "other_unsure",
]);

const MAX_MONETARY_VALUE = 100_000_000;

function parseAmount(val: unknown): { value: number | null; rawEmpty: boolean } {
  if (val === undefined || val === null || val === "") {
    return { value: 0, rawEmpty: true };
  }
  if (typeof val === "number") {
    return { value: isNaN(val) ? null : val, rawEmpty: false };
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") return { value: 0, rawEmpty: true };
    return { value: parseTRNumber(trimmed), rawEmpty: false };
  }
  return { value: null, rawEmpty: false };
}

/**
 * validateInput — Ham formu denetler, alan bazlı hata listesi ve sözlüğü üretir.
 */
export function validateInput(
  raw: RawCompensationInput,
  rates: RatesConfig
): ValidationResult {
  const errors: ValidationError[] = [];
  const fieldErrors: Record<string, string> = {};

  const addError = (field: string, message: string) => {
    errors.push({ field, message });
    if (!fieldErrors[field]) {
      fieldErrors[field] = message;
    }
  };

  // 1. Fesih Nedeni
  let reason: InputTerminationReason | undefined;
  if (!raw.reason || raw.reason.trim() === "") {
    addError("reason", "Fesih nedeni seçilmelidir.");
  } else if (!VALID_REASONS.has(raw.reason)) {
    addError("reason", "Geçerli bir fesih nedeni seçilmelidir.");
  } else {
    reason = raw.reason as InputTerminationReason;
  }

  // 2. İhbar Bildirimi (noticeUsed)
  let noticeWorked = false;
  let noticeUsedVal: "yes" | "no" | undefined;
  if (reason === "employer_unfair") {
    if (raw.noticeUsed !== "yes" && raw.noticeUsed !== "no") {
      addError("noticeUsed", "İhbar süresinin kullandırılıp kullandırılmadığı seçilmelidir.");
    } else {
      noticeUsedVal = raw.noticeUsed;
      noticeWorked = raw.noticeUsed === "yes";
    }
  } else if (raw.noticeUsed === "yes" || raw.noticeUsed === "no") {
    noticeUsedVal = raw.noticeUsed;
    noticeWorked = raw.noticeUsed === "yes";
  }

  // 3. Giriş ve Çıkış Tarihleri
  const startIso = typeof raw.startIso === "string" ? raw.startIso.trim() : "";
  const exitIso = typeof raw.exitIso === "string" ? raw.exitIso.trim() : "";
  let isStartValid = false;
  let isExitValid = false;

  if (!startIso) {
    addError("startIso", "İşe giriş tarihi girilmelidir.");
  } else if (!parseIsoDate(startIso)) {
    addError("startIso", "Geçerli bir işe giriş tarihi giriniz (YYYY-AA-GG).");
  } else if (startIso < "1970-01-01") {
    addError("startIso", "İşe giriş tarihi 01.01.1970 tarihinden önce olamaz.");
  } else {
    isStartValid = true;
  }

  if (!exitIso) {
    addError("exitIso", "İşten çıkış tarihi girilmelidir.");
  } else if (!parseIsoDate(exitIso)) {
    addError("exitIso", "Geçerli bir işten çıkış tarihi giriniz (YYYY-AA-GG).");
  } else {
    isExitValid = true;
  }

  if (isStartValid && isExitValid && exitIso < startIso) {
    addError("exitIso", "Çıkış tarihi, giriş tarihinden önce olamaz.");
  }

  // 4. Aylık Brüt Maaş
  const grossParsed = parseAmount(raw.grossMonthly);
  let grossMonthly = 0;
  if (grossParsed.rawEmpty || grossParsed.value === null) {
    addError("grossMonthly", "Aylık brüt maaş 0'dan büyük olmalı.");
  } else if (grossParsed.value <= 0) {
    addError("grossMonthly", "Aylık brüt maaş 0'dan büyük olmalı.");
  } else if (grossParsed.value > MAX_MONETARY_VALUE) {
    addError("grossMonthly", "Aylık brüt maaş 100.000.000 TL'den büyük olamaz.");
  } else {
    grossMonthly = grossParsed.value;
  }

  // 5. Aylık Ek Ödeme
  const extraParsed = parseAmount(raw.extraMonthly);
  let extraMonthly = 0;
  if (extraParsed.value === null) {
    addError("extraMonthly", "Geçerli bir ek ödeme tutarı giriniz.");
  } else if (extraParsed.value < 0) {
    addError("extraMonthly", "Aylık ek ödeme 0'dan küçük olamaz.");
  } else if (extraParsed.value > MAX_MONETARY_VALUE) {
    addError("extraMonthly", "Aylık ek ödeme 100.000.000 TL'den büyük olamaz.");
  } else {
    extraMonthly = extraParsed.value;
  }

  // 6. Yıllık İkramiye
  const bonusParsed = parseAmount(raw.annualBonus);
  let annualBonus = 0;
  if (bonusParsed.value === null) {
    addError("annualBonus", "Geçerli bir yıllık ikramiye tutarı giriniz.");
  } else if (bonusParsed.value < 0) {
    addError("annualBonus", "Yıllık ikramiye 0'dan küçük olamaz.");
  } else if (bonusParsed.value > MAX_MONETARY_VALUE) {
    addError("annualBonus", "Yıllık ikramiye 100.000.000 TL'den büyük olamaz.");
  } else {
    annualBonus = bonusParsed.value;
  }

  // 7. Gelir Vergisi Oranı
  const availableTaxRates = rates.income_tax_rates_for_estimate?.rates ?? [0.15];
  const defaultTaxRate = rates.income_tax_rates_for_estimate?.default_rate ?? availableTaxRates[0] ?? 0.15;
  let incomeTaxRate = defaultTaxRate;

  if (raw.incomeTaxRate !== undefined && raw.incomeTaxRate !== null && raw.incomeTaxRate !== "") {
    const parsedRate = typeof raw.incomeTaxRate === "number"
      ? raw.incomeTaxRate
      : parseTRNumber(String(raw.incomeTaxRate)) ?? Number(raw.incomeTaxRate);

    if (isNaN(parsedRate) || !availableTaxRates.some((r) => Math.abs(r - parsedRate) < 0.0001)) {
      addError("incomeTaxRate", "Geçerli bir gelir vergisi oranı seçiniz.");
    } else {
      incomeTaxRate = parsedRate;
    }
  }

  if (errors.length > 0 || !reason) {
    return { isValid: false, errors, fieldErrors };
  }

  return {
    isValid: true,
    errors: [],
    fieldErrors: {},
    data: {
      reason,
      noticeUsed: noticeUsedVal,
      noticeWorked,
      startIso,
      exitIso,
      grossMonthly,
      extraMonthly,
      annualBonus,
      incomeTaxRate,
    },
  };
}
