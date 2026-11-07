"use client";

/**
 * SonucPaylasim.tsx — Hesaplama Sonucu Paylaşım ve PDF İndirme Modülü
 * İki temel aksiyon sunar:
 * 1. PDF İndir (generatePDF motoruyla kurumsal A4 döküm indirme)
 * 2. WhatsApp'ta Paylaş (wa.me deep link ile hazır metinli mesaj gönderme)
 * Dayanak: WCAG 2.1 AA (min 44px dokunma hedefleri), %100 istemci taraflı çalışma.
 */

import React, { useState } from "react";
import { Download, Share2, Check } from "lucide-react";
import { generatePDF, HesaplamaSonucu } from "@/lib/generatePDF";
import { formatTRY } from "@/lib/utils/format";

interface SonucPaylasimProps {
  result: HesaplamaSonucu;
}

export default function SonucPaylasim({ result }: SonucPaylasimProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      generatePDF(result);
    } catch (err) {
      console.error("PDF üretilirken hata oluştu:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // WhatsApp paylaşım mesajı formatı
  const shareText = [
    "📌 HakkımNedir? Tazminat Hesaplama Sonucum:",
    "",
    `💰 Tahmini Toplam Ele Geçecek Net: ${formatTRY(result.toplamNet)}`,
    result.netKidem ? `🔹 Net Kıdem Tazminatı: ${formatTRY(result.netKidem)}` : null,
    result.netIhbar ? `🔹 Net İhbar Tazminatı: ${formatTRY(result.netIhbar)}` : null,
    result.serviceDuration ? `⏱️ Hizmet Süresi: ${result.serviceDuration}` : null,
    "",
    "Sen de kıdem, ihbar ve diğer yasal haklarını kuruşu kuruşuna öğrenmek için hesapla:",
    "👉 https://hakkimnedir.com.tr",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2.5">
        <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider">
          Sonucu Sakla ve Paylaş
        </span>
        <span className="text-[11px] text-slate-500">
          Cihazınıza güvenle indirin veya yakınlarınızla paylaşın
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* 1. PDF İndir Butonu */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={downloading}
          aria-label="Hesaplama sonucunu PDF olarak indir"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B1F33] hover:bg-[#123C68] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
        >
          {downloading ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Hazırlanıyor...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#4CC9B0]" aria-hidden="true" />
              <span>PDF İndir (Resmî Format)</span>
            </>
          )}
        </button>

        {/* 2. WhatsApp'ta Paylaş Butonu */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hesaplama sonucunu WhatsApp'ta paylaş"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-1"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          <span>WhatsApp&apos;ta Paylaş</span>
        </a>
      </div>
    </div>
  );
}
