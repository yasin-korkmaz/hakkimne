import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import OvertimeCalculator from "@/features/overtime/OvertimeCalculator";

export const metadata: Metadata = {
  title: "Fazla Mesai Hesaplama",
  description:
    "4857 sayılı İş Kanunu md. 41 uyarınca haftalık çalışma saatine göre %25 ve %50 zamlı fazla çalışma ve fazla sürelerle çalışma ücreti hesaplama aracı.",
  alternates: {
    canonical: "/fazla-mesai-hesaplama",
  },
  openGraph: {
    title: `Fazla Mesai Hesaplama | ${siteConfig.siteName}`,
    description:
      "4857 sayılı İş Kanunu md. 41 uyarınca haftalık çalışma saatine göre %25 ve %50 zamlı fazla çalışma ve fazla sürelerle çalışma ücreti hesaplama aracı.",
    url: `${siteConfig.siteUrl}/fazla-mesai-hesaplama`,
  },
};

export default function FazlaMesaiPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Fazla Mesai Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 Sayılı İş Kanunu Madde 41 uyarınca haftalık sözleşme ve çalışma saatlerinize göre
          %25 zamlı fazla sürelerle çalışma ve %50 zamlı fazla çalışma hak edişinizi hesaplayın.
        </p>
      </section>

      {/* 2. Hesaplayıcı */}
      <section className="w-full">
        <OvertimeCalculator />
      </section>

      {/* Detaylı Hesaplama Yöntemi Bağlantısı */}
      <div className="text-center -mt-4">
        <Link
          href="/rehber/fazla-mesai"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] py-2 px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Detaylı hesaplama yöntemini incele →
        </Link>
      </div>

      {/* 3. Yasal Dayanak ve Formül Bilgilendirmesi */}
      <section className="max-w-2xl mx-auto w-full flex flex-col gap-4 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Fazla Çalışma Esasları (4857 md. 41)</h2>
        <p>
          Yargıtay yerleşik içtihatları ve 4857 sayılı İş Kanunu gereğince saatlik brüt ücret,
          aylık brüt maaşın <strong>225 saate</strong> bölünmesiyle (30 gün × 7,5 saat) hesaplanır.
        </p>
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs sm:text-sm">
          <p>
            <strong>• Fazla Sürelerle Çalışma (%25 Zamlı):</strong> Haftalık sözleşme süresi 45 saatin altında
            olan işyerlerinde, sözleşme süresini aşan ve 45 saate kadar olan çalışmalar saat başına %25 zamlı ödenir.
          </p>
          <p>
            <strong>• Fazla Çalışma (%50 Zamlı):</strong> Haftalık 45 saati aşan tüm çalışmalar saat başına
            %50 zamlı (saatlik ücret × 1,50) olarak ödenir.
          </p>
        </div>
      </section>
    </div>
  );
}
