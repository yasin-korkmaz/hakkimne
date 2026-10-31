import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Kıdem Tazminatı Hesaplama",
  description:
    "1475 sayılı Kanun md. 14 uyarınca hizmet süresi ve güncel tavan tutarına göre kıdem tazminatı hesaplama aracı.",
  alternates: {
    canonical: "/kidem-tazminati-hesaplama",
  },
  openGraph: {
    title: `Kıdem Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "1475 sayılı Kanun md. 14 uyarınca hizmet süresi ve güncel tavan tutarına göre kıdem tazminatı hesaplama aracı.",
    url: `${siteConfig.siteUrl}/kidem-tazminati-hesaplama`,
  },
};

export default function KidemTazminatiPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kıdem Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          1475 Sayılı İş Kanunu Madde 14 uyarınca en az 1 yıllık çalışma süresi ve yasal fesih koşullarına göre kıdem tazminatınızı hesaplayın.
        </p>
      </section>

      <section className="w-full">
        <TrustBadge />
      </section>

      <section className="w-full">
        <Calculator />
      </section>

      {/* Detaylı Hesaplama Yöntemi Bağlantısı */}
      <div className="text-center -mt-4">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] py-2 px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Detaylı hesaplama yöntemini incele →
        </Link>
      </div>
    </div>
  );
}
