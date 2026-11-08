"use client";

import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * PdfExportButton.tsx — İstemci Taraflı HTML'den PDF Rapor Oluşturucu
 * Dayanak: 1475 md. 14 & 4857 md. 17 tazminat dökümünün resmî kayıt altına alınması.
 * html2canvas ve jspdf dinamik import ile SSR ortamında hata vermeden çalışır.
 */

interface PdfExportButtonProps {
  targetId?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
  fileName?: string;
}

export default function PdfExportButton({
  targetId = "result-screen-root",
  targetRef,
  fileName = "HakkimNedir_Tazminat_Raporu_2026.pdf",
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      trackEvent("pdf_click");

      // Dinamik import ile SSR ortamında 'window' hatalarını önle
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element =
        targetRef?.current ||
        (targetId ? document.getElementById(targetId) : null) ||
        document.getElementById("result-screen-root");

      if (!element) {
        console.warn("PDF dışa aktarımı için hedef element bulunamadı:", targetId);
        return;
      }

      // Elementi yüksek çözünürlüklü canvas'a çevir
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Sayfa taşmalarını yöneterek sayfaları ekle
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error("PDF raporu oluşturulurken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      aria-label="Resmi Hak Raporunu PDF İndir"
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#1769E0] text-[#1769E0] hover:bg-blue-50/90 hover:border-[#123C68] hover:text-[#123C68] font-bold text-xs sm:text-sm transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#1769E0]" aria-hidden="true" />
          <span>Rapor Hazırlanıyor...</span>
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4 text-[#1769E0]" aria-hidden="true" />
          <span>Resmi Hak Raporunu PDF İndir</span>
        </>
      )}
    </button>
  );
}
