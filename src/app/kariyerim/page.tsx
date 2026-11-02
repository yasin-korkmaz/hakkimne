import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CareerHub } from "@/features/career";
import JsonLd from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Kariyerim — İş Teklifi Kıyaslama ve Mülakat Simülatörü",
  description:
    "İki iş teklifini maaş, yol, yemek ve esnekliğe göre kıyaslayın; STAR yöntemiyle metin tabanlı mülakat simülatöründe pratik yapın.",
  alternates: {
    canonical: "/kariyerim",
  },
  openGraph: {
    title: `Kariyerim | ${siteConfig.siteName}`,
    description:
      "İki iş teklifini maaş, yol, yemek ve esnekliğe göre kıyaslayın; STAR yöntemiyle metin tabanlı mülakat simülatöründe pratik yapın.",
    url: `${siteConfig.siteUrl}/kariyerim`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kariyerim | ${siteConfig.siteName}`,
    description:
      "İki iş teklifini maaş, yol, yemek ve esnekliğe göre kıyaslayın; STAR yöntemiyle metin tabanlı mülakat simülatöründe pratik yapın.",
  },
};

export default function KariyerimPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Kariyerim", url: "/kariyerim" },
  ]);
  const appSchema = buildWebApplicationSchema({
    name: "Kariyerim: Teklif Kıyaslama ve Mülakat Aracı",
    path: "/kariyerim",
    description:
      "İki iş teklifini maaş, yol, yemek ve esnekliğe göre kıyaslayın; STAR yöntemiyle metin tabanlı mülakat simülatöründe pratik yapın.",
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      {/* Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#123C68] self-center">
          <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
          Kariyer & Karar Destek Merkezi
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          Kariyerim: Teklif Kıyaslama & Mülakat Simülatörü
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          İş tekliflerini tüm yan hakları ve yaşam dengesiyle karşılaştırın; STAR yöntemiyle mülakat sorularına yapay zeka destekli geri bildirimlerle hazırlanın.
        </p>
      </section>

      {/* Kariyer Modülü */}
      <CareerHub />
    </div>
  );
}
