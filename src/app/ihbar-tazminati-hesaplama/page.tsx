import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";
import ExplainSection from "@/components/ExplainSection";
import FaqSection from "@/components/FaqSection";

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

      <ExplainSection />

      <FaqSection />
    </div>
  );
}
