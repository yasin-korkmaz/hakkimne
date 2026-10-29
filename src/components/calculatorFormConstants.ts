/**
 * calculatorFormConstants.ts — Hesaplayıcı Form Sabitleri ve Seçenekleri
 */

export const REASON_OPTIONS = [
  { value: "employer_unfair", label: "İşveren beni haklı bir neden olmadan işten çıkardı" },
  { value: "employee_just_cause", label: "Ben haklı bir nedenle işten ayrıldım (4857 md. 24)" },
  { value: "retirement_military_marriage", label: "Emeklilik, askerlik veya evlilik nedeniyle ayrıldım" },
  { value: "voluntary_resignation", label: "Kendi isteğimle, haklı bir neden olmadan istifa ettim" },
  { value: "employer_just_cause", label: "İşveren beni haklı nedenle derhal çıkardı (4857 md. 25/II)" },
  { value: "other_unsure", label: "Diğer / emin değilim" },
];

export const INITIAL_FORM_STATE = {
  reason: "",
  noticeUsed: "no",
  startIso: "",
  exitIso: "",
  grossMonthly: "",
  extraMonthly: "",
  annualBonus: "",
  incomeTaxRate: "0.15",
};
