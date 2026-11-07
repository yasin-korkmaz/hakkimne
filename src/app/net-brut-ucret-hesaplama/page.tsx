import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import NetBrutForm from "@/components/NetBrutForm";
import JsonLd from "@/components/JsonLd";
import FAQSchema from "@/components/FAQSchema";
import { buildBreadcrumbSchema, buildWebApplicationSchema } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "2026 Net Brüt Maaş Hesaplama — Asgari Ücret & Öğretmen Maaşı",
  description:
    "2026 Gelir vergisi dilimlerine göre brütten nete ve netten brüte maaş hesaplama aracı. 2026 Asgari Ücret Net Brüt Hesaplama ve Öğretmen maaşı brüt net hesaplama dökümü.",
  alternates: {
    canonical: "/net-brut-ucret-hesaplama",
  },
  keywords: [
    "2026 Asgari Ücret Net Brüt Hesaplama",
    "Öğretmen maaşı brüt net hesaplama",
    "Brütten nete maaş hesaplama 2026",
    "Netten brüte maaş hesaplama",
    "2026 gelir vergisi dilimleri",
    "Maaş kesintileri hesaplama",
  ],
  openGraph: {
    title: `2026 Net Brüt Maaş Hesaplama | ${siteConfig.siteName}`,
    description:
      "2026 Gelir vergisi dilimleriyle anlık brütten nete ve netten brüte ücret hesaplayıcı. Tüm yasal kesintiler şeffaf dökümde.",
    url: `${siteConfig.siteUrl}/net-brut-ucret-hesaplama`,
  },
  twitter: {
    card: "summary_large_image",
    title: `2026 Net Brüt Maaş Hesaplama | ${siteConfig.siteName}`,
    description:
      "2026 Gelir vergisi dilimleriyle anlık brütten nete ve netten brüte ücret hesaplayıcı.",
  },
};

const FAQS = [
  {
    q: "Brüt maaştan hangi yasal kesintiler yapılır?",
    a: "Brüt ücretten sırasıyla %14 SGK işçi primi, %1 işsizlik sigortası primi, kalan matrah üzerinden 2026 Gelir Vergisi dilimleri (%15 - %40) ve binde 7,59 (%0,759) damga vergisi kesilir.",
  },
  {
    q: "2026 Gelir Vergisi dilimleri nelerdir?",
    a: "193 sayılı GVK Md. 103 uyarınca: 158.000 TL'ye kadar %15, 330.000 TL'ye kadar %20, 1.200.000 TL'ye kadar %27, 4.300.000 TL'ye kadar %35 ve 4.300.000 TL üzeri için %40 vergi uygulanır.",
  },
  {
    q: "Netten brüte hesaplama nasıl yapılır?",
    a: "Netten brüte dönüşümde, hedeflenen net tutarı karşılayacak brüt ücret ve yasal kesintiler tersine ikili arama (Binary Search) algoritması ile kuruş hassasiyetinde türetilir.",
  },
];

export default function NetBrutUcretPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Net - Brüt Maaş Hesaplama", url: "/net-brut-ucret-hesaplama" },
  ]);

  const appSchema = buildWebApplicationSchema({
    name: "2026 Net - Brüt Maaş Hesaplama Aracı",
    path: "/net-brut-ucret-hesaplama",
    description:
      "2026 Gelir vergisi dilimleriyle brütten nete ve netten brüte maaş hesaplama motoru.",
  });

  return (
    <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={appSchema} />
      <FAQSchema items={FAQS} />

      {/* 1. Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          2026 Net - Brüt Maaş Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          193 sayılı GVK 2026 gelir vergisi dilimleri, SGK işçi primi ve damga vergisi oranlarıyla
          brütten nete ve netten brüte ücretinizi anında ve şeffafça hesaplayın.
        </p>
      </section>

      {/* 2. Hesaplayıcı Formu */}
      <section className="w-full">
        <NetBrutForm />
      </section>

      {/* 3. 2026 Gelir Vergisi Dilimleri Bilgi Tablosu */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-slate-800">
        <h2 className="text-lg font-bold text-[#0B1F33]">
          2026 Gelir Vergisi Dilimleri (193 Sayılı GVK Madde 103)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-2.5 px-3 font-semibold">Kümülatif Gelir Vergisi Matrahı</th>
                <th className="py-2.5 px-3 font-semibold">Vergi Oranı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3">158.000 TL&apos;ye kadar</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">%15</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">158.000 TL – 330.000 TL arası</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">%20</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">330.000 TL – 1.200.000 TL arası</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">%27</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">1.200.000 TL – 4.300.000 TL arası</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">%35</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">4.300.000 TL üzeri</td>
                <td className="py-2.5 px-3 font-bold text-blue-600">%40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Sıkça Sorulan Sorular */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0B1F33]">Maaş Hesaplama Hakkında Sıkça Sorulan Sorular</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4">
              <h3 className="font-bold text-sm text-slate-900 mb-1">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
