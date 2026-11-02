import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";
import JsonLd from "@/components/JsonLd";
import {
  buildOrganizationAndWebsiteSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama",
  description:
    "HakkımNedir? — 1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "HakkımNedir? — 1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  },
};

export default function Home() {
  const orgAndWebSchema = buildOrganizationAndWebsiteSchema();
  const appSchema = buildWebApplicationSchema({
    name: "Kıdem ve İhbar Tazminatı Hesaplama",
    path: "/",
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  });

  return (
    <div className="flex flex-col gap-10 w-full">
      <JsonLd data={orgAndWebSchema} />
      <JsonLd data={appSchema} />

      {/* 1. Hero Bölümü (Kurumsal & Finansal Kimlik) */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4 pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-[#123C68]">
          <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
          Açık Kaynaklı & Doğrulanmış Mevzuat Motoru
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F33] tracking-tight leading-tight">
          İş hayatında hakkını bil.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Maaşını, tazminatını, izinlerini ve çalışma koşullarını kontrol et. Haklarını öğren, sonraki adımını belirle.
        </p>

        <div className="pt-2">
          <a
            href="#hesaplayici"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] focus-visible:ring-offset-2"
          >
            <span>Haklarımı kontrol et</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* 2. Güven Rozeti */}
      <section className="w-full">
        <TrustBadge />
      </section>

      {/* 3. Hesaplayıcı */}
      <section id="hesaplayici" className="w-full scroll-mt-24">
        <Calculator />
      </section>

      {/* 4. Detaylı Hesaplama Yöntemi Bağlantısı */}
      <div className="text-center -mt-4">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#1769E0] hover:text-[#123C68] hover:underline min-h-[44px] py-2 px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
        >
          Detaylı hesaplama yöntemini incele →
        </Link>
      </div>
    </div>
  );
}
