import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { KamuHub } from "@/features/kamu";
import JsonLd from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "KPSS Önlisans Kadro ve Nitelik Kodları | HakkımNedir",
  description:
    "KPSS P93 puanınız ve 3249, 3001 önlisans nitelik kodları ile başvurabileceğiniz kamu kadrolarını ve taban puanları filtreleyin.",
  alternates: {
    canonical: "/kamu",
  },
  openGraph: {
    title: `KPSS Önlisans Kadro ve Nitelik Kodları | ${siteConfig.siteName}`,
    description:
      "KPSS P93 puanınız ve 3249, 3001 önlisans nitelik kodları ile başvurabileceğiniz kamu kadrolarını ve taban puanları filtreleyin.",
    url: `${siteConfig.siteUrl}/kamu`,
  },
  twitter: {
    card: "summary_large_image",
    title: `KPSS Önlisans Kadro ve Nitelik Kodları | ${siteConfig.siteName}`,
    description:
      "KPSS P93 puanınız ve 3249, 3001 önlisans nitelik kodları ile başvurabileceğiniz kamu kadrolarını ve taban puanları filtreleyin.",
  },
};

export default function KamuPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Kamu & KPSS", url: "/kamu" },
  ]);
  const appSchema = buildWebApplicationSchema({
    name: "Kamu & KPSS: Önlisans Nitelik Kodları ve Kadro Eşleştirme",
    path: "/kamu",
    description:
      "KPSS P93 puanınız ve 3249, 3001 önlisans nitelik kodları ile başvurabileceğiniz kamu kadrolarını ve taban puanları filtreleyin.",
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      {/* Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#123C68] self-center">
          <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
          ÖSYM KPSS Önlisans Rehberi
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          Kamu Kadro & Nitelik Kodları Eşleştirme
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          KPSS P93 puanınızı ve mezuniyet alanınızı (3249, 3001 vb.) girerek başvurabileceğiniz kamu pozisyonlarını, taban puan eğilimlerini ve 6225 sertifika muafiyetlerini inceleyin.
        </p>
      </section>

      {/* Kamu Modülü */}
      <KamuHub />
    </div>
  );
}
