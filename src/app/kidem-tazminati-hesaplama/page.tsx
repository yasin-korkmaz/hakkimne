import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";
import JsonLd from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

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
  twitter: {
    card: "summary_large_image",
    title: `Kıdem Tazminatı Hesaplama | ${siteConfig.siteName}`,
    description:
      "1475 sayılı Kanun md. 14 uyarınca hizmet süresi ve güncel tavan tutarına göre kıdem tazminatı hesaplama aracı.",
  },
};

/**
 * Kıdem Tazminatı Hesaplama Sayfası (Tool Page)
 * Kullanıcı doğrudan form ve hesaplama motoru ile karşılaşır.
 */
export default function KidemTazminatiPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Kıdem Tazminatı Hesaplama", url: "/kidem-tazminati-hesaplama" },
  ]);
  const appSchema = buildWebApplicationSchema({
    name: "Kıdem ve İhbar Tazminatı Hesaplama Motoru",
    path: "/kidem-tazminati-hesaplama",
    description:
      "1475 sayılı Kanun md. 14 uyarınca hizmet süresi ve güncel tavan tutarına göre kıdem tazminatı hesaplama aracı.",
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      {/* Küçük ve Net Sayfa H1 Başlığı */}
      <section className="text-center flex flex-col gap-1.5 pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight">
          Kıdem Tazminatı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          1475 Sayılı İş Kanunu Madde 14 ve 4857 Sayılı Kanun Madde 17 uyarınca kıdem ve ihbar tazminatı hesaplama motoru.
        </p>
      </section>

      {/* Güven Rozeti */}
      <section className="w-full">
        <TrustBadge />
      </section>

      {/* Doğrudan Hesaplama Formu */}
      <section className="w-full">
        <Calculator />
      </section>

      {/* Detaylı Hesaplama Yöntemi Bağlantısı */}
      <div className="text-center pt-1 pb-4">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] py-1 px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Detaylı hesaplama yöntemini ve kanun maddelerini incele →
        </Link>
      </div>
    </div>
  );
}
