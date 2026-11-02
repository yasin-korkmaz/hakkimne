import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { RightsTracker } from "@/features/rights-tracking";
import JsonLd from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Hak Takip Merkezi",
  description:
    "Üye olmadan çalışma profilinizi ve hizmet sürenizi takip edin; yıllık izin, fazla mesai ve kıdem hak edişlerinizi cihazınızda güvenle yönetin.",
  alternates: {
    canonical: "/hak-takip-merkezi",
  },
  openGraph: {
    title: `Hak Takip Merkezi | ${siteConfig.siteName}`,
    description:
      "Üye olmadan çalışma profilinizi ve hizmet sürenizi takip edin; yıllık izin, fazla mesai ve kıdem hak edişlerinizi cihazınızda güvenle yönetin.",
    url: `${siteConfig.siteUrl}/hak-takip-merkezi`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Hak Takip Merkezi | ${siteConfig.siteName}`,
    description:
      "Üye olmadan çalışma profilinizi ve hizmet sürenizi takip edin; yıllık izin, fazla mesai ve kıdem hak edişlerinizi cihazınızda güvenle yönetin.",
  },
};

export default function HakTakipMerkeziPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Hak Takip Merkezi", url: "/hak-takip-merkezi" },
  ]);
  const appSchema = buildWebApplicationSchema({
    name: "İşçi Hak Takip Merkezi",
    path: "/hak-takip-merkezi",
    description:
      "Üye olmadan çalışma profilinizi ve hizmet sürenizi takip edin; yıllık izin, fazla mesai ve kıdem hak edişlerinizi cihazınızda güvenle yönetin.",
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      {/* Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Kişisel ve Güvenli Çalışma Paneli
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          Hak Takip Merkezi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Üye olmadan, şifre vermeden çalışma profilinizi kaydedin. Hizmet sürenizi, yıllık izin günlerinizi, saatlik ücretinizi ve mesailerinizi tek bir ekrandan takip edin.
        </p>
      </section>

      {/* Hak Takip Modülü */}
      <RightsTracker />
    </div>
  );
}
