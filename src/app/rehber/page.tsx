import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import ExplainSection from "@/components/ExplainSection";

export const metadata: Metadata = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama Mantığı",
  description:
    "1475 ve 4857 sayılı kanunlar kapsamında kıdem ve ihbar tazminatı hesaplama formülleri, tavan uygulaması ve örnek senaryolar.",
  alternates: {
    canonical: "/rehber",
  },
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama Mantığı | ${siteConfig.siteName}`,
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında kıdem ve ihbar tazminatı hesaplama formülleri, tavan uygulaması ve örnek senaryolar.",
    url: `${siteConfig.siteUrl}/rehber`,
  },
};

export default function RehberPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Giriş */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kıdem ve İhbar Tazminatı Hesaplama Mantığı
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          1475 sayılı Kanun md. 14 ve 4857 sayılı Kanun md. 17 hükümlerine göre tazminat haklarınızın
          hangi adımlarla ve yasal formüllerle hesaplandığını inceleyin.
        </p>
      </section>

      {/* 2. Detaylı Hesaplama Adımları ve Örnek Senaryo */}
      <ExplainSection />

      {/* 3. Diğer Rehberler (Yıllık İzin vb.) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Yıllık Ücretli İzin Rehberi</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            4857 sayılı Kanun md. 53 ve 59 kapsamında kıdem kademeleri, 18/50 yaş istisnası ve kullanılmayan izin ücreti formüllerini inceleyin.
          </p>
        </div>
        <Link
          href="/rehber/yillik-izin"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-50 text-teal-700 font-semibold text-sm rounded-xl hover:bg-teal-100 transition-colors border border-teal-200 whitespace-nowrap min-h-[44px] shrink-0"
        >
          Yıllık İzin Rehberini İncele →
        </Link>
      </section>

      {/* 4. Hesaplayıcıya Dönüş Butonu */}
      <section className="text-center bg-blue-50/60 border border-blue-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Kendi Tazminatınızı Hesaplamaya Hazır mısınız?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Maaş ve tarih bilgilerinizi girerek saniyeler içinde şeffaf adım adım hesaplama fişinizi oluşturun.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Hesaplayıcıya Git →
        </Link>
      </section>
    </div>
  );
}
