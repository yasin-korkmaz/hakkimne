import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonLd";

export interface KpssIlan {
  id: string;
  slug: string;
  title: string;
  kurum: string;
  bitis_tarihi: string;
  ogrenim_duzeyi: string;
  nitelik_kodu: string;
  kpss_puan_turu: string;
  kpss_taban_puan: string;
  kadro_sayisi: string;
  sehir: string;
  url: string;
}

const FALLBACK_ILANLAR: KpssIlan[] = [
  {
    id: "sgk-programci-2026",
    slug: "sgk-45-sozlesmeli-programci-alimi-2026",
    title: "Sosyal Güvenlik Kurumu 45 Sözleşmeli Programcı Alımı",
    kurum: "Sosyal Güvenlik Kurumu (SGK)",
    bitis_tarihi: "2026-11-28",
    ogrenim_duzeyi: "Önlisans",
    nitelik_kodu: "3249",
    kpss_puan_turu: "KPSS P93",
    kpss_taban_puan: "65",
    kadro_sayisi: "45",
    sehir: "Ankara",
    url: "https://kariyerkapisi.cbiko.gov.tr/isealim",
  },
  {
    id: "icisleri-bilgisayar-isletmeni-2026",
    slug: "icisleri-bakanligi-120-bilgisayar-isletmeni-vhki-alimi-2026",
    title: "İçişleri Bakanlığı 120 Bilgisayar İşletmeni ve VHKİ Alımı",
    kurum: "İçişleri Bakanlığı",
    bitis_tarihi: "2026-12-05",
    ogrenim_duzeyi: "Önlisans",
    nitelik_kodu: "3249",
    kpss_puan_turu: "KPSS P93",
    kpss_taban_puan: "70",
    kadro_sayisi: "120",
    sehir: "Tüm Türkiye",
    url: "https://kariyerkapisi.cbiko.gov.tr/isealim",
  },
  {
    id: "saglik-buro-personeli-2026",
    slug: "saglik-bakanligi-250-buro-personeli-alimi-2026",
    title: "Sağlık Bakanlığı 250 Büro Personeli Alımı (Herhangi Önlisans)",
    kurum: "Sağlık Bakanlığı",
    bitis_tarihi: "2026-11-20",
    ogrenim_duzeyi: "Önlisans",
    nitelik_kodu: "3001",
    kpss_puan_turu: "KPSS P93",
    kpss_taban_puan: "60",
    kadro_sayisi: "250",
    sehir: "İstanbul, Ankara, İzmir",
    url: "https://kariyerkapisi.cbiko.gov.tr/isealim",
  },
];

async function getIlanlar(): Promise<KpssIlan[]> {
  const r2Url = process.env.NEXT_PUBLIC_R2_DATA_URL;
  if (r2Url) {
    try {
      const res = await fetch(`${r2Url}/kpss_ilanlari.json`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data.slice(0, 200);
      }
    } catch {
      // Ağ hatasında fallback'e dön
    }
  }
  return FALLBACK_ILANLAR;
}

export async function generateStaticParams() {
  const ilanlar = await getIlanlar();
  return ilanlar.slice(0, 200).map((ilan) => ({ slug: ilan.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ilanlar = await getIlanlar();
  const ilan = ilanlar.find((i) => i.slug === slug);
  if (!ilan) return { title: "Kamu İlanı Bulunamadı" };

  const title = `${ilan.title} Başvurusu (${ilan.kurum})`;
  const description = `${ilan.kurum} personeli alımı: ${ilan.ogrenim_duzeyi} mezuniyeti, ${ilan.nitelik_kodu} nitelik kodu, ${ilan.kpss_puan_turu} taban puanı ve son başvuru tarihi (${ilan.bitis_tarihi}).`;

  return {
    title,
    description,
    alternates: { canonical: `/kpss/${slug}` },
    openGraph: { title: `${title} | ${siteConfig.siteName}`, description, url: `${siteConfig.siteUrl}/kpss/${slug}` },
  };
}

export default async function KpssIlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ilanlar = await getIlanlar();
  const ilan = ilanlar.find((i) => i.slug === slug);
  if (!ilan) notFound();

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Kamu & KPSS", url: "/kamu" },
    { name: ilan.kurum, url: `/kpss/${slug}` },
  ]);

  const STAT_CARDS = [
    { label: "Öğrenim", val: ilan.ogrenim_duzeyi, cls: "text-slate-900" },
    { label: "Nitelik Kodu", val: ilan.nitelik_kodu, cls: "text-blue-700" },
    { label: "KPSS Taban", val: `${ilan.kpss_puan_turu} (${ilan.kpss_taban_puan})`, cls: "text-slate-900" },
    { label: "Kontenjan", val: `${ilan.kadro_sayisi} Kişi`, cls: "text-slate-900" },
    { label: "Görev Yeri", val: ilan.sehir, cls: "text-slate-900 col-span-2 sm:col-span-2" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-4">
      <JsonLd data={breadcrumb} />

      <nav aria-label="İçerik Yolu" className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/kamu" className="hover:text-blue-600">Kamu & KPSS</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">{ilan.kurum}</span>
      </nav>

      <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            {ilan.kurum}
          </span>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            Son Başvuru: {ilan.bitis_tarihi}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight leading-tight">
            {ilan.title}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Kariyer Kapısı üzerinden yayımlanan resmî kamu işe alım ilanı detayları ve KPSS şartları.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STAT_CARDS.map((card, i) => (
            <div key={i} className={`bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 ${card.cls.includes('col-span') ? 'col-span-2 sm:col-span-2' : ''}`}>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">{card.label}</span>
              <span className={`text-sm font-extrabold mt-0.5 block ${card.cls}`}>{card.val}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={ilan.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 px-5 bg-[#0B1F33] hover:bg-[#123C68] text-white font-bold text-sm rounded-xl text-center shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
          >
            Resmî İlana Git ve Başvur ↗
          </a>
          <Link
            href="/kamu"
            className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl text-center transition-colors min-h-[44px] flex items-center justify-center"
          >
            KPSS Kadro Rehberine Dön
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
          Yasal Uyarı: Bu ilan verisi Cumhurbaşkanlığı İnsan Kaynakları Ofisi Kariyer Kapısı platformundan derlenmiştir.
        </p>
      </article>
    </div>
  );
}
