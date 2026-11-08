"use client";

import React from "react";
import { Check } from "lucide-react";

/**
 * ProgressBar.tsx — 3 Adımlı Hesaplama Formu İlerleme Çubuğu
 * Dayanak: WCAG 2.1 AA erişilebilirlik ve görsel ilerleme durumu.
 * Renk Kodlaması: Tamamlanan = Yeşil, Aktif = Mavi, Bekleyen = Gri.
 */

interface ProgressBarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const WIZARD_STEPS = [
  { step: 1, title: "Temel Bilgiler", shortDesc: "Fesih & Süre" },
  { step: 2, title: "Ücret", shortDesc: "Maaş Bilgisi" },
  { step: 3, title: "Yan Haklar", shortDesc: "Ek Ödenekler" },
];

export default function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <nav aria-label="Form İlerleme Durumu" className="w-full mb-6">
      <ol className="flex items-center justify-between w-full relative">
        {/* Arka plan bağlantı çizgisi */}
        <div
          className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0"
          aria-hidden="true"
        />

        {/* Dolum çizgisi */}
        <div
          className="absolute left-6 top-4 h-0.5 bg-emerald-600 transition-all duration-300 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 3rem)",
          }}
          aria-hidden="true"
        />

        {WIZARD_STEPS.map((item) => {
          const isCompleted = item.step < currentStep;
          const isActive = item.step === currentStep;

          return (
            <li key={item.step} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => isCompleted && onStepClick?.(item.step)}
                disabled={!isCompleted}
                aria-current={isActive ? "step" : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700"
                    : isActive
                    ? "bg-[#1769E0] text-white ring-4 ring-blue-100 shadow-xs"
                    : "bg-white text-slate-400 border-2 border-slate-300 cursor-default"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                ) : (
                  <span>{item.step}</span>
                )}
              </button>
              <div className="text-center mt-1.5">
                <span
                  className={`block text-xs font-semibold ${
                    isActive
                      ? "text-[#1769E0]"
                      : isCompleted
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {item.title}
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500 font-normal">
                  {item.shortDesc}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
