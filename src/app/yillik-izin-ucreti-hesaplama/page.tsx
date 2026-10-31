import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import AnnualLeaveCalculator from "@/features/annual-leave/AnnualLeaveCalculator";

export const metadata: Metadata = {
  title: "Yıllık İzin Ücreti Hesaplama",
  description:
    "4857 sayılı İş Kanunu md. 53 ve 59 uyarınca hizmet süresi, yaş ve maaşa göre kullanılmayan yıllık izin ücretini hesaplama aracı.",
  alternates: {
    canonical: "/yillik-izin-ucreti-hesaplama",
  },
  openGraph: {
    title: `Yıllık İzin Ücreti Hesaplama | ${siteConfig.siteName}`,
    description:
      "4857 sayılı İş Kanunu md. 53 ve 59 uyarınca hizmet süresi, yaş ve maaşa göre kullanılmayan yıllık izin ücretini hesaplama aracı.",
    url: `${siteConfig.siteUrl}/yillik-izin-ucreti-hesaplama`,
  },
};

export default function YillikIzinPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Yıllık İzin Ücreti Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 Sayılı İş Kanunu Madde 53 ve 59 uyarınca hizmet sürenize, yaşınıza ve maaşınıza
          göre kullanılmayan yıllık izin günlerinizi ve brüt izin ücretinizi hesaplayın.
        </p>
      </section>

      <section className="w-full">
        <AnnualLeaveCalculator />
      </section>

      <section className="max-w-2xl mx-auto w-full flex flex-col gap-4 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">Yıllık İzin Hakkında</h2>
        <p>
          En az 1 yıl çalışan işçiler yıllık ücretli izne hak kazanır. Hizmet süresi
          1–5 yıl (5 dahil) olanlara 14 gün, 5 yıldan fazla 15 yıldan az olanlara 20 gün,
          15 yıl (dahil) ve daha fazla olanlara 26 gün izin verilir (4857 md. 53).
        </p>
        <p>
          18 yaş ve altı ile 50 yaş ve üstü işçiler için yıllık izin süresi 20 günden az olamaz
          (md. 53/5). İşten çıkışta kullanılmayan izin günleri ücrete çevrilir (md. 59).
        </p>
      </section>
    </div>
  );
}
