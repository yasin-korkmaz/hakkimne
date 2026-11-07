/**
 * generatePDF.ts — Hesaplama Sonucu PDF Rapor Üreticisi
 * jspdf ve jspdf-autotable ile A4 dikey formatta kurumsal hesaplama dökümü üretir.
 * Dayanak: 1475 md. 14, 4857 md. 17 ve kurumsal şeffaflık ilkeleri.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { siteConfig } from "@/config/site";

export interface HesaplamaSonucu {
  netKidem?: number;
  grossKidem?: number;
  netIhbar?: number;
  grossIhbar?: number;
  toplamNet: number;
  serviceDuration?: string;
  monthlySalary?: number;
  extraBenefits?: number;
}

/**
 * Türkçe para formatı (123.456,78 TL)
 */
function formatMoney(amount?: number): string {
  if (amount === undefined || isNaN(amount)) return "0,00 TL";
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " TL"
  );
}

/**
 * Standart Helvetica fontunda bozulmayı önleyen güvenli Türkçe metin eşlemesi.
 */
function toSafePdfText(str: string): string {
  const map: Record<string, string> = {
    ğ: "g",
    Ğ: "G",
    ı: "i",
    İ: "I",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
    ö: "o",
    Ö: "O",
    ü: "u",
    Ü: "U",
  };
  return str.replace(/[ğĞıİşŞçÇöÖüÜ]/g, (m) => map[m] || m);
}

/**
 * Hesaplama sonuçlarını içeren A4 PDF raporu üretir ve indirir.
 */
export function generatePDF(data: HesaplamaSonucu): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // 1. Üst Başlık (Header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(11, 31, 51); // #0B1F33
  doc.text("HakkimNedir?", margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // #64748B
  doc.text(
    toSafePdfText("Kıdem ve İhbar Tazminatı Hesaplama Özeti"),
    margin,
    26
  );

  const today = new Date().toLocaleDateString("tr-TR");
  doc.text(`Tarih: ${today}`, pageWidth - margin - 35, 20);

  // Çizgi
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.5);
  doc.line(margin, 30, pageWidth - margin, 30);

  // 2. Yasal Uyarı Bandı (Sarı #FEF9C3 Arka Plan)
  doc.setFillColor(254, 249, 195); // #FEF9C3
  doc.roundedRect(margin, 34, pageWidth - margin * 2, 18, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text("YASAL UYARI:", margin + 3, 39);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // amber-700
  const uyariMetni = toSafePdfText(
    "Bu dokuman bilgilendirme amaclidir; resmi bordro veya mahkeme ilami yerine gecmez. Nihai hak edis tutari fesih nedeni ve ek belgelere gore degisebilir."
  );
  doc.text(uyariMetni, margin + 3, 44, {
    maxWidth: pageWidth - margin * 2 - 6,
  });

  // 3. Hesaplama Sonuç Tablosu
  const tableRows: Array<[string, string]> = [
    [toSafePdfText("Hizmet Süresi"), toSafePdfText(data.serviceDuration || "Belirtilmedi")],
  ];

  if (data.monthlySalary) {
    tableRows.push([toSafePdfText("Aylık Brüt Çıplak Ücret"), formatMoney(data.monthlySalary)]);
  }
  if (data.extraBenefits) {
    tableRows.push([toSafePdfText("Aylık Düzenli Yan Haklar"), formatMoney(data.extraBenefits)]);
  }

  tableRows.push(
    [toSafePdfText("Brüt Kıdem Tazminatı"), formatMoney(data.grossKidem)],
    [toSafePdfText("Net Kıdem Tazminatı (Damga Vergisi Kesilmiş)"), formatMoney(data.netKidem)],
    [toSafePdfText("Brüt İhbar Tazminatı"), formatMoney(data.grossIhbar)],
    [toSafePdfText("Net İhbar Tazminatı (Gelir + Damga Vergisi Kesilmiş)"), formatMoney(data.netIhbar)],
    [toSafePdfText("TOPLAM TAHMİNİ ELE GEÇECEK NET TUTAR"), formatMoney(data.toplamNet)]
  );

  autoTable(doc, {
    startY: 56,
    margin: { left: margin, right: margin },
    head: [[toSafePdfText("Hesaplama Kalemi"), toSafePdfText("Tutar / Değer")]],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [11, 31, 51], // #0B1F33
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // #F8FAFC
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: "auto", halign: "right", fontStyle: "bold" },
    },
  });

  // 4. Alt Bilgi (Footer)
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    toSafePdfText("HakkimNedir? — Guvenli, acik kaynakli ve sifir sunucu tazminat hesaplayici"),
    margin,
    pageHeight - 10
  );
  doc.text(
    siteConfig.siteUrl.replace("https://", ""),
    pageWidth - margin - 35,
    pageHeight - 10
  );

  // 5. İndir
  doc.save("hakkimnedir-tazminat-hesaplama.pdf");
}
