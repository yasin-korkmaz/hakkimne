import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Fazla Mesai Hesaplama Mantığı ve Kuralları",
  description:
    "4857 sayılı İş Kanunu md. 41 kapsamında saatlik ücret (Brüt/225), %25 ve %50 zamlı fazla çalışma hesaplama rehberi.",
  alternates: {
    canonical: "/rehber/fazla-mesai",
  },
  openGraph: {
    title: `Fazla Mesai Hesaplama Mantığı ve Kuralları | ${siteConfig.siteName}`,
    description:
      "4857 sayılı İş Kanunu md. 41 kapsamında saatlik ücret (Brüt/225), %25 ve %50 zamlı fazla çalışma hesaplama rehberi.",
    url: `${siteConfig.siteUrl}/rehber/fazla-mesai`,
  },
};

export default function FazlaMesaiRehberPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Giriş */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Fazla Mesai Hesaplama Mantığı
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 sayılı İş Kanunu Madde 41 ve yerleşik Yargıtay içtihatlarına göre saatlik ücretin bulunması,
          fazla çalışma (%50 zamlı) ve fazla sürelerle çalışma (%25 zamlı) hesaplama esasları.
        </p>
      </section>

      {/* 2. Saatlik Ücret ve 225 Saat Kuralı */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          1. Saatlik Brüt Ücret Nasıl Hesaplanır? (225 Saat Kuralı)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          İş Kanunu uyarınca aylık ücret bir aylık çalışma karşılığıdır ve iş hukuku uygulamasında bir ay <strong>30 gün</strong> kabul edilir.
          Günlük kanuni çalışma süresi <strong>7,5 saat</strong> olduğundan, aylık çalışma süresi <strong>30 × 7,5 = 225 saat</strong> olarak uygulanır
          (Yargıtay 9. ve 22. Hukuk Daireleri yerleşik içtihadı).
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-800">
          <strong>Saatlik Brüt Ücret</strong> = Aylık Maktu Brüt Ücret / 225
        </div>
      </section>

      {/* 3. İki Temel Mesai Türü: Fazla Çalışma vs. Fazla Sürelerle Çalışma */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fazla Sürelerle Çalışma */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Md. 41/3 — %25 Zamlı
          </span>
          <h3 className="text-lg font-bold text-amber-950">
            Fazla Sürelerle Çalışma
          </h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Haftalık çalışma süresinin sözleşmelerle <strong>45 saatin altında</strong> (örneğin 40 saat) belirlendiği işyerlerinde,
            belirlenen süreyi aşan ve <strong>45 saate kadar</strong> yapılan çalışmalar fazla sürelerle çalışmadır.
          </p>
          <div className="bg-white/80 border border-amber-200 rounded-lg p-3 text-xs font-mono text-amber-950">
            Saat Ücreti = Saatlik Ücret × 1,25
          </div>
        </div>

        {/* Fazla Çalışma */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Md. 41/2 — %50 Zamlı
          </span>
          <h3 className="text-lg font-bold text-blue-950">
            Fazla Çalışma (Normal Mesai)
          </h3>
          <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            Kanunda belirlenen haftalık <strong>45 saati aşan</strong> çalışmalar fazla çalışmadır.
            Haftalık 45 saati aşan her bir saat çalışma için verilecek ücret normal saat ücretinin yüzde 50 zamlı halidir.
          </p>
          <div className="bg-white/80 border border-blue-200 rounded-lg p-3 text-xs font-mono text-blue-950">
            Saat Ücreti = Saatlik Ücret × 1,50
          </div>
        </div>
      </section>

      {/* 4. Örnek Senaryo */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          2. Örnek Hesaplama Senaryosu
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Aylık <strong>45.000 TL</strong> brüt maaş alan ve sözleşmesi <strong>40 saat</strong> olan bir işçi haftada <strong>48 saat</strong> çalışmışsa:
        </p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <li><strong>Saatlik Brüt Ücret:</strong> 45.000 / 225 = <strong>200,00 TL</strong></li>
          <li><strong>Fazla Sürelerle Çalışma (40 - 45 sa arası):</strong> 5 saat × (200 × 1,25) = <strong>1.250,00 TL</strong></li>
          <li><strong>Fazla Çalışma (45 - 48 sa arası):</strong> 3 saat × (200 × 1,50) = <strong>900,00 TL</strong></li>
          <li><strong>Toplam Haftalık Brüt Mesai:</strong> 1.250 + 900 = <strong>2.150,00 TL</strong></li>
        </ul>
      </section>

      {/* 5. Hesaplayıcıya Dönüş Butonu */}
      <section className="text-center bg-blue-50/60 border border-blue-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Kendi Fazla Mesainizi Hesaplayın
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Maaşınızı ve haftalık çalışma saatlerinizi girerek anında adım adım hesaplama fişinizi oluşturun.
        </p>
        <Link
          href="/fazla-mesai-hesaplama"
          className="mt-2 inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Fazla Mesai Hesaplayıcıya Git →
        </Link>
      </section>
    </div>
  );
}
