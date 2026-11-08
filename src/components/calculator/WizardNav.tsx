"use client";

import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * WizardNav.tsx — 3 Adımlı Form Dinamik Navigasyon Barı
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanları ve anlaşılır aksiyon etiketleri).
 */

interface WizardNavProps {
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
}

export default function WizardNav({
  currentStep,
  onPrev,
  onNext,
  onReset,
}: WizardNavProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
      {/* Sol Alan: 1. Adımda Temizle, 2 ve 3. Adımlarda Geri Butonu */}
      {currentStep === 1 ? (
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Formu Temizle
        </button>
      ) : (
        <button
          type="button"
          onClick={onPrev}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>← Geri</span>
        </button>
      )}

      {/* Sağ Alan: 1 ve 2. Adımlarda İleri, 3. Adımda Hakkımı Hesapla */}
      {currentStep < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] focus-visible:ring-offset-2 ml-auto"
        >
          <span>İleri</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="submit"
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ml-auto"
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>Hakkımı Hesapla ✓</span>
        </button>
      )}
    </div>
  );
}
