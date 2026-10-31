import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Yıllık İzin Hesaplama Mantığı ve Süreleri",
  description:
    "4857 sayılı İş Kanunu md. 53 ve 59 kapsamında yıllık ücretli izin gün sayıları, yaş koruması ve izin ücreti hesaplama rehberi.",
  alternates: {
    canonical: "/rehber/yillik-izin",
  },
  openGraph: {
    title: `Yıllık İzin Hesaplama Mantığı ve Süreleri | ${siteConfig.siteName}`,
    description:
      "4857 sayılı İş Kanunu md. 53 ve 59 kapsamında yıllık ücretli izin gün sayıları, yaş koruması ve izin ücreti hesaplama rehberi.",
    url: `${siteConfig.siteUrl}/rehber/yillik-izin`,
  },
};

export default function YillikIzinRehberPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Giriş */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Yıllık İzin Hesaplama Mantığı
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 sayılı İş Kanunu Madde 53 ve Madde 59 hükümlerine göre yıllık ücretli izin hakkı,
          hizmet süresi kademeleri, yaş istisnası ve kullanılmayan izin ücreti hesabı.
        </p>
      </section>

      {/* 2. Kıdem Kademeleri Tablosu ve Açıklaması */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            1. Hizmet Süresine Göre Yıllık İzin Süreleri (Md. 53)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            İş yerinde işe başladığı günden itibaren, deneme süresi de içinde olmak üzere en az bir tam yıl
            çalışmış olan işçilere yıllık ücretli izin verilir. Kanunen asgari izin süreleri şöyledir:
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Hizmet Süresi (Kıdem)</th>
                <th className="px-4 py-3 text-right">Asgari Yıllık İzin Süresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-800">1 yıldan az</td>
                <td className="px-4 py-3 text-right text-slate-600">Hak kazanılamaz (0 gün)</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-800">1 yıldan 5 yıla kadar (5 yıl dahil)</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">14 gün</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-800">5 yıldan fazla 15 yıldan az (6 - 14 yıl)</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">20 gün</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-800">15 yıl (dahil) ve daha fazla</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">26 gün</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Yaş İstisnası (Md. 53/5) */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-amber-900">
          2. Genç ve Kıdemli İşçiler İçin Yaş Koruması (Md. 53/5)
        </h2>
        <p className="text-sm text-amber-950 leading-relaxed">
          Kanunun 53. maddesinin 5. fıkrasına göre; <strong>18 ve daha küçük yaştaki işçiler</strong> ile{" "}
          <strong>50 ve daha yukarı yaştaki işçilere</strong> verilecek yıllık ücretli izin süresi{" "}
          <strong>20 günden az olamaz</strong>.
        </p>
        <p className="text-xs sm:text-sm text-amber-900">
          Örneğin 52 yaşında veya 17 yaşında olan bir çalışan 1. hizmet yılını doldurduğunda, 14 gün yerine
          doğrudan en az 20 gün izin hakkı elde eder.
        </p>
      </section>

      {/* 4. İzin Ücreti Formülü (Md. 59) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          3. Kullanılmayan İzin Ücretinin Hesaplanması (Md. 59)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          İş sözleşmesinin herhangi bir nedenle sona ermesi halinde, işçinin hak kazanıp da kullanmadığı yıllık
          izin sürelerine ait ücreti, sözleşmenin sona erdiği tarihteki ücreti üzerinden kendisine veya hak sahiplerine ödenir.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-800 flex flex-col gap-2">
          <div><strong>Günlük Brüt Ücret</strong> = Son Aylık Brüt Maaş / 30</div>
          <div><strong>Kalan İzin Günü</strong> = Toplam Hak Edilen Gün - Kullanılan Gün</div>
          <div><strong>Brüt İzin Ücreti</strong> = Günlük Brüt Ücret × Kalan İzin Günü</div>
        </div>
      </section>

      {/* 5. Hesaplayıcıya Dönüş */}
      <section className="text-center bg-teal-50/60 border border-teal-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Kullanılmayan İzin Ücretinizi Hesaplayın
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Hizmet sürenizi ve kullandığınız günleri girerek net hak edişinizi hemen öğrenin.
        </p>
        <Link
          href="/yillik-izin-ucreti-hesaplama"
          className="mt-2 inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Yıllık İzin Hesaplayıcıya Git →
        </Link>
      </section>
    </div>
  );
}
