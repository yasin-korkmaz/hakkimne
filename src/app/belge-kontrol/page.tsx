import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import BelgeKontrolUploader from "@/components/BelgeKontrolUploader";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema, buildWebApplicationSchema } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "İş Sözleşmesi İnceleme ve Risk Analizi",
  description:
    "İş sözleşmenizdeki rekabet yasağı, 6 aylık deneme süresi ve tek taraflı değişiklik gibi riskli maddeleri tarayıcınızda %100 gizlilikle inceleyin.",
  alternates: {
    canonical: "/belge-kontrol",
  },
  openGraph: {
    title: `İş Sözleşmesi İnceleme ve Risk Analizi | ${siteConfig.siteName}`,
    description:
      "İş sözleşmenizdeki rekabet yasağı, 6 aylık deneme süresi ve tek taraflı değişiklik gibi riskli maddeleri tarayıcınızda %100 gizlilikle inceleyin.",
    url: `${siteConfig.siteUrl}/belge-kontrol`,
  },
  twitter: {
    card: "summary_large_image",
    title: `İş Sözleşmesi İnceleme ve Risk Analizi | ${siteConfig.siteName}`,
    description:
      "İş sözleşmenizdeki rekabet yasağı ve geçersiz hükümleri sıfır sunucu ile tarayın.",
  },
};

export default function BelgeKontrolPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "İş Sözleşmesi Risk Analizi", url: "/belge-kontrol" },
  ]);

  const webApp = buildWebApplicationSchema({
    name: "İş Sözleşmesi Risk Analiz Aracı",
    path: "/belge-kontrol",
    description:
      "İş sözleşmelerindeki hukuka aykırı maddeleri tarayıcı içinde tespit eden gizlilik odaklı araç.",
  });

  return (
    <div className="flex flex-col gap-10 w-full max-w-3xl mx-auto py-2">
      <JsonLd data={breadcrumb} />
      <JsonLd data={webApp} />

      {/* 1. Başlık ve Açıklama */}
      <section className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#123C68]">
          <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
          Sıfır Sunucu • %100 Gizlilik Odaklı Analiz
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          İş Sözleşmesi İnceleme ve Risk Analizi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          İş sözleşmenizi yükleyin; 4857 sayılı İş Kanunu ve Türk Borçlar Kanunu emredici hükümlerine aykırı
          maddeleri (rekabet yasağı, 6 aylık deneme süresi vb.) saniyeler içinde tespit edin.
        </p>
      </section>

      {/* 2. Yükleyici ve Analiz Alanı */}
      <section className="w-full">
        <BelgeKontrolUploader />
      </section>

      {/* 3. Yasal Bilgilendirme Kartı */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-slate-800">
        <h2 className="text-lg font-bold text-[#0B1F33]">
          Sözleşmelerde En Sık Rastlanan 4 Hukuka Aykırı Madde
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">1. Deneme Süresi Aşımı (4857 md. 15)</h3>
            <p className="text-slate-600">
              Bireysel sözleşmelerde deneme süresi en çok 2 aydır. 6 ay gibi süreler kanunen geçersizdir.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">2. Tek Taraflı Değişiklik (4857 md. 22)</h3>
            <p className="text-slate-600">
              İşverenin ücret veya görev yerini tek taraflı değiştirme hakkı saklı tutulamaz; yazılı onay şarttır.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">3. Ağır Rekabet Yasağı (6098 md. 444)</h3>
            <p className="text-slate-600">
              Coğrafi ve zamansal sınırı çizilmemiş, orantısız cezai şartlı rekabet yasakları mahkemelerce iptal edilir.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">4. Fikri Mülkiyet Gasbı (5846 FSEK)</h3>
            <p className="text-slate-600">
              Mesai dışı bağımsız kişisel projelerin peşinen şirkete devredilmesi hükmü geçersiz kabul edilebilir.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Detaylı bordro ve fesih kontrolü için:</span>
          <Link href="/belge-kontrolu" className="font-semibold text-blue-600 hover:underline">
            Adım Adım Belge Kontrol Sihirbazı →
          </Link>
        </div>
      </section>
    </div>
  );
}
