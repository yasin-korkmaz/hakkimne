import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "İhbar Tazminatı Hesaplama",
  description:
    "4857 sayılı Kanun md. 17 uyarınca çalışma süresi kademelerine göre ihbar süresi ve ihbar tazminatı hesaplayıcı.",
  alternates: {
    canonical: "/ihbar-tazminati-hesaplama",
  },
  openGraph: {
    title: `İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "4857 sayılı Kanun md. 17 uyarınca çalışma süresi kademelerine göre ihbar süresi ve ihbar tazminatı hesaplayıcı.",
    url: `${siteConfig.siteUrl}/ihbar-tazminati-hesaplama`,
  },
};

/**
 * İhbar Tazminatı Hesaplama Sayfası
 * Açıklama ve formüller kaldırılmış olup doğrudan sade form, sonuç ve rehber yönlendirmesi içerir.
 */

export default function IhbarTazminatiPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          İhbar Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 Sayılı İş Kanunu Madde 17 uyarınca ihbar öneli kullandırılmayan hallerde çalışma süresine göre hak kazanılan ihbar tazminatınızı hesaplayın.
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
