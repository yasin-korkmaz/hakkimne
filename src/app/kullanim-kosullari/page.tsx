import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "HakkımNedir? Kullanım Koşulları ve Sorumluluk Reddi Beyanı",
  robots: { index: false, follow: false },
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function KullanimKosullariPage() {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Kullanım Koşulları
        </h1>
        <p className="text-xs text-slate-500">
          Son güncelleme tarihi: {siteConfig.lastContentUpdate}
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">1. Kabul ve Kapsam</h2>
          <p>
            {siteConfig.siteName} (işletici: <strong>Yasin Korkmaz</strong>) web sitesini ziyaret ederek ve hesaplama araçlarını kullanarak bu sayfada belirtilen koşulları peşinen kabul etmiş sayılırsınız.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">2. Bilgilendirme Amacı ve Tavsiye Niteliği Taşımama</h2>
          <p>
            Bu platformda yer alan kıdem ve ihbar tazminatı hesaplama araçları yalnızca <strong>genel bilgilendirme</strong> amacıyla sunulmaktadır. Sitede üretilen hesaplamalar, fişler ve sonuç özetleri hiçbir şekilde resmî hukuki mütalaa, avukatlık danışmanlığı veya mali müşavirlik tavsiyesi teşkil etmez.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">3. Sonuçların Tahmini Niteliği ve Resmî Teyit</h2>
          <p>
            Hesaplama sonuçları kullanıcının forma girdiği verilere ve 1475 sayılı Kanun md. 14, 4857 sayılı Kanun md. 17 ve ilgili genelgelerde yer alan parametrelere dayanır.
          </p>
          <p>
            Özellikle ihbar tazminatındaki gelir vergisi kesintisi kümülatif vergi matrahınıza göre değişebileceğinden tahmini olarak sunulmaktadır. Hak kaybına uğramamak adına nihai hak edişinizi işyeri bordrolarınız ve Hazine ve Maliye Bakanlığı genelgeleriyle teyit etmeniz zorunludur.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">4. Sorumluluk Reddi (Disclaimer)</h2>
          <p>
            Hesaplama formüllerinin güncelliği ve doğruluğu azami özenle korunsa dahi, kullanıcıların yanlış veri girişi yapması, mevzuat değişiklikleri veya yargı kararlarındaki farklı yorumlardan kaynaklanabilecek doğrudan veya dolaylı maddi/manevi zararlardan site işleticisi <strong>Yasin Korkmaz</strong> sorumlu tutulamaz.
          </p>
          <p>
            Görüş ve bildirimleriniz için:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline font-medium">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
