"use client";

import React, { useState } from "react";
import type { DocumentCheckInput, DocumentCheckResult } from "./types";
import { analyzeDocument } from "./engine";
import DocumentUploadForm from "./DocumentUploadForm";
import AnalysisResultView from "./AnalysisResultView";

export default function DocumentChecker() {
  const [result, setResult] = useState<DocumentCheckResult | null>(null);

  const handleAnalyze = (input: DocumentCheckInput) => {
    const res = analyzeDocument(input);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      {/* Güvenlik ve Sıfır Sunucu Bilgisi */}
      <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-slate-800 shadow-xs">
        <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="text-emerald-950">İstemci Taraflı ve Güvenli Analiz:</strong> Yüklediğiniz belgeler sunucularımıza veya herhangi bir harici yapay zeka bulut servisine gönderilmez. İnceleme kuralları doğrudan tarayıcınızda çalıştırılır.
        </div>
      </div>

      {!result ? (
        <DocumentUploadForm onAnalyze={handleAnalyze} />
      ) : (
        <AnalysisResultView result={result} onReset={handleReset} />
      )}
    </div>
  );
}
