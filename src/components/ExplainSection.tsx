import React from "react";
import { HOW_IT_WORKS_STEPS, SCENARIO_1_EXAMPLE } from "@/content/explain";

export default function ExplainSection() {
  return (
    <section aria-labelledby="explain-heading" className="w-full flex flex-col gap-8">
      {/* 1. Nasıl Hesaplanır? */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 id="explain-heading" className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Tazminat Nasıl Hesaplanır?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Kıdem ve ihbar tazminatı hesaplamaları yürürlükteki 1475 ve 4857 sayılı kanun hükümleri çerçevesinde 5 temel aşamada gerçekleştirilir:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.stepNumber}
              className="flex flex-col gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
              {step.formula && (
                <div className="mt-auto pt-2">
                  <code className="text-xs font-mono bg-blue-50/80 text-blue-900 px-2 py-1 rounded block">
                    {step.formula}
                  </code>
                </div>
              )}
              {step.lawReference && (
                <span className="text-[11px] text-gray-600 italic">Dayanak: {step.lawReference}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Örnek Hesaplama (PRD Senaryo 1) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-2">
          {SCENARIO_1_EXAMPLE.title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Aşağıdaki örnekte 4 tam yıl çalışmış ve işveren tarafından haksız fesihle çıkarılmış bir çalışanın yasal hakları hesaplanmıştır:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Girdiler */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
              Girdi Parametreleri
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/40">
              {SCENARIO_1_EXAMPLE.parameters.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-2.5 text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium">{p.label}</span>
                  <span className="text-gray-900 font-semibold">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Çıktılar */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
              Hesaplama Sonuçları
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {SCENARIO_1_EXAMPLE.results.map((r, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2.5 text-xs sm:text-sm gap-0.5">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{r.label}</span>
                    {r.note && <span className="text-[11px] text-gray-600">{r.note}</span>}
                  </div>
                  <span className="text-gray-950 font-bold font-mono sm:text-right">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
