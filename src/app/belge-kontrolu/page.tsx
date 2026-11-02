import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DocumentChecker } from "@/features/document-checker";
import JsonLd from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "İş Belgesi Kontrolü (Bordro, Sözleşme, Fesih)",
  description:
    "Maaş bordrosu, iş sözleşmesi, fesih bildirimi ve izin belgelerinizi İş Kanunu ve yerleşik içtihatlara göre güvenle inceleyin.",
  alternates: {
    canonical: "/belge-kontrolu",
  },
  openGraph: {
    title: `İş Belgesi Kontrolü | ${siteConfig.siteName}`,
    description:
      "Maaş bordrosu, iş sözleşmesi, fesih bildirimi ve izin belgelerinizi İş Kanunu ve yerleşik içtihatlara göre güvenle inceleyin.",
    url: `${siteConfig.siteUrl}/belge-kontrolu`,
  },
  twitter: {
    card: "summary_large_image",
    title: `İş Belgesi Kontrolü | ${siteConfig.siteName}`,
    description:
      "Maaş bordrosu, iş sözleşmesi, fesih bildirimi ve izin belgelerinizi İş Kanunu ve yerleşik içtihatlara göre güvenle inceleyin.",
  },
};

export default function BelgeKontroluPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Belge Kontrolü", url: "/belge-kontrolu" },
  ]);
  const appSchema = buildWebApplicationSchema({
    name: "İş Belgesi Hukuki Kontrol Aracı",
    path: "/belge-kontrolu",
    description:
      "Maaş bordrosu, iş sözleşmesi, fesih bildirimi ve izin belgelerinizi İş Kanunu ve yerleşik içtihatlara göre güvenle inceleyin.",
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />

      {/* Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#123C68] self-center">
          <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
          Görev Odaklı & Gizlilik Esaslı İnceleme
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          İş Belgesi Hukuki Kontrolü
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Maaş bordrosu, iş sözleşmesi, fesih bildirimi ve izin belgelerinizdeki kritik hakları, yasal eksiklikleri ve olası riskleri saniyeler içinde denetleyin.
        </p>
      </section>

      {/* Belge Kontrol Modülü */}
      <DocumentChecker />
    </div>
  );
}
