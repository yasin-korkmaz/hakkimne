import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import Hero from "@/components/Hero";
import AracGrid from "@/components/AracGrid";
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
    <div className="flex flex-col gap-12 w-full">
      <JsonLd data={orgAndWebSchema} />
      <JsonLd data={appSchema} />

      {/* 1. Hero Bölümü */}
      <Hero />

      {/* 2. 2x4 Araç Kartları Grid'i */}
      <AracGrid />

      {/* 3. Güven Rozeti */}
      <section className="w-full">
        <TrustBadge />
      </section>

      {/* 4. Ana Hesaplama Motoru */}
      <section id="hesaplayici" className="w-full scroll-mt-24 flex flex-col gap-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33] tracking-tight">
            Kıdem ve İhbar Tazminatı Hesaplama Motoru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aşağıdaki alanları doldurarak yasal hak edişinizi kuruşu kuruşuna hesaplayın.
          </p>
        </div>
        <Calculator />
      </section>

      {/* 5. Detaylı Rehber Bağlantısı */}
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
