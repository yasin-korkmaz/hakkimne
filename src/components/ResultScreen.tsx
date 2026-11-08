"use client";

import React, { useEffect } from "react";
import type { RatesConfig } from "@/lib/config/types";
import type { CompensationServiceResult } from "@/lib/calculators/compensation";
import { buildReceipt } from "@/lib/receipt/buildReceipt";
import { buildNotices } from "@/lib/receipt/buildNotices";
import { formatTRY } from "@/lib/utils/format";
import { trackEvent } from "@/lib/analytics";
import { Share2, ChevronDown } from "lucide-react";
import ResultSummary from "./ResultSummary";
import ReceiptTable from "./ReceiptTable";
import NoticeList from "./NoticeList";
import PdfExportButton from "./PdfExportButton";
import NextStepsCard from "./NextStepsCard";
import LeadCapture from "./LeadCapture";

/**
 * ResultScreen.tsx — Hesaplama Sonuç, Eylem ve Dönüşüm Merkezi
 * Dayanak: 1475 md. 14, 4857 md. 17 ve 7036 sayılı Kanun zorunlu arabuluculuk bilgilendirmesi.
 * Hiyerarşi: 1. Tazminat Tutarları -> 2. PDF İndir & Paylaşım -> 3. Şimdi Ne Yapmalıyım -> 4. Lead Capture
 */

interface ResultScreenProps {
  result: CompensationServiceResult & { status: "ok" };
  rates: RatesConfig;
  showDetails: boolean;
  onToggleDetails: () => void;
  totalNet?: number;
}

export default function ResultScreen({
  result,
  rates,
  showDetails,
  onToggleDetails,
  totalNet,
}: ResultScreenProps) {
  useEffect(() => {
    trackEvent("result_view");
  }, []);

  const receiptRows = buildReceipt(result, rates);
  const notices = buildNotices(result);

  const shareText = [
    "⚖️ HakkımNedir? Tazminat Hesaplama Sonucum:",
    `💰 Tahmini Net Ele Geçecek: ${formatTRY(totalNet ?? 0)}`,
    result.severance.eligible ? `🔹 Net Kıdem Tazminatı: ${formatTRY(result.severance.netSeverance)}` : null,
    result.notice.eligible ? `🔹 Net İhbar Tazminatı: ${formatTRY(result.notice.estimatedNetNotice)}` : null,
    "",
    "🔗 Sen de yasal haklarını ücretsiz öğren: https://hakkimnedir.com.tr",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(shareText);

  return (
    <div className="w-full flex flex-col gap-6" id="result-screen-root">
      {/* 1. Tazminat Tutarları (Özet Kartları) */}
      <ResultSummary
        rows={receiptRows}
        severanceEligible={result.severance.eligible}
        noticeEligible={result.notice.eligible}
        totalNet={totalNet}
      />

      {/* 2. PDF İndir & Paylaşım Eylem Çubuğu */}
      <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-xs">
        <div className="flex flex-col gap-0.5 text-center sm:text-left">
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            Resmî Hak Raporunu Sakla
          </span>
          <span className="text-[11px] text-slate-500">
            Sonuçlarınızı PDF olarak cihazınıza indirin veya WhatsApp&apos;tan paylaşın.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
          <PdfExportButton targetId="result-screen-root" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hesaplama sonucunu WhatsApp'ta paylaş"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs min-h-[44px]"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Katman 2 Toggle Butonu ve Adım Adım Fiş */}
      <div className="w-full flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onToggleDetails}
          aria-expanded={showDetails}
          aria-controls="detailed-receipt"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
        >
          <span>{showDetails ? "Ayrıntılı hesaplamayı gizle" : "Ayrıntılı hesaplamayı göster"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {showDetails && (
          <div id="detailed-receipt" className="w-full">
            <ReceiptTable rows={receiptRows} />
          </div>
        )}
      </div>

      {/* Tavan & Mevzuat Bildirimleri */}
      <NoticeList notices={notices} />

      {/* 3. Şimdi Ne Yapmalıyım? Eylem Kartı */}
      <NextStepsCard />

      {/* 4. E-Posta / Lead Toplama Kartı */}
      <LeadCapture />
    </div>
  );
}
