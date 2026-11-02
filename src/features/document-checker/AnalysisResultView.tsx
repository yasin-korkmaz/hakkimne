import React from "react";
import Link from "next/link";
import type { DocumentCheckResult, FindingCategory } from "./types";

interface AnalysisResultViewProps {
  result: DocumentCheckResult;
  onReset: () => void;
}

const CATEGORY_STYLES: Record<
  FindingCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  info: { label: "Bilgi", bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  warning: { label: "Kontrol Edilmeli", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  danger: { label: "Muhtemel Risk", bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  missing: { label: "Eksik Bilgi", bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  legal_consultation: { label: "Uzman İncelemesi", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
};

export default function AnalysisResultView({ result, onReset }: AnalysisResultViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Üst Başlık ve Dosya Özeti */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#1769E0] rounded-lg">
            {result.documentTypeName}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33] mt-2">
            Belge Hukuki İnceleme Raporu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dosya: <strong>{result.fileName}</strong> ({result.fileSizeFormatted}) • Cihaz içi denetim
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
        >
          Yeni Belge İncele
        </button>
      </div>

      {/* Kategori Sayaçları */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
        {(Object.keys(CATEGORY_STYLES) as FindingCategory[]).map((cat) => (
          <div
            key={cat}
            className={`p-3 rounded-xl border ${CATEGORY_STYLES[cat].bg} ${CATEGORY_STYLES[cat].border}`}
          >
            <div className={`text-xl font-extrabold ${CATEGORY_STYLES[cat].text}`}>
              {result.summaryCounts[cat] || 0}
            </div>
            <div className={`text-[11px] font-semibold ${CATEGORY_STYLES[cat].text}`}>
              {CATEGORY_STYLES[cat].label}
            </div>
          </div>
        ))}
      </div>

      {/* Bulgular Listesi */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900">
          Tespit Edilen Maddeler ve Hukuki Tavsiyeler ({result.findings.length})
        </h3>

        {result.findings.map((f) => {
          const style = CATEGORY_STYLES[f.category];
          return (
            <div
              key={f.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                    {style.label}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">
                    {f.title}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                  {f.legalBase}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {f.description}
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Tavsiye:</strong> {f.recommendation}
                </div>

                {f.relatedTool && (
                  <Link
                    href={f.relatedTool.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1769E0] hover:underline shrink-0"
                  >
                    <span>{f.relatedTool.label}</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Yasal Uyarı / Disclaimer */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed">
        <strong>Hukuki Uyarı:</strong> {result.disclaimer}
      </div>
    </div>
  );
}
