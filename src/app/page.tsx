import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama",
  description:
    "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "1475 ve 4857 sayılı kanunlar kapsamında güncel tavan ve oranlarla çalışan açık kaynaklı kıdem ve ihbar tazminatı hesaplayıcı.",
    url: siteConfig.siteUrl,
  },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Tanıtım */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kıdem ve İhbar Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          1475 ve 4857 sayılı kanunlar kapsamında kıdem ve ihbar tazminatınızı güncel tavan ve oranlarla adım adım hesaplayın.
          Tüm veriler tarayıcınızda işlenir; hiçbir kişisel veri sunuculara iletilmez veya kaydedilmez.
        </p>
      </section>

      {/* 2. Güven Rozeti */}
      <section className="w-full">
        <TrustBadge />
      </section>

      {/* 3. Hesaplayıcı */}
      <section className="w-full">
        <Calculator />
      </section>

      {/* 4. Detaylı Hesaplama Yöntemi Bağlantısı */}
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
