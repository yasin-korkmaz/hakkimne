/* TASLAK — hukuk kontrolü gerekli */

import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Hakkında",
  description: "HakkımNe? Bağımsız Kıdem ve İhbar Tazminatı Hesaplama Platformu",
  robots: { index: false, follow: false },
  alternates: { canonical: "/hakkinda" },
};

export default function HakkindaPage() {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Hakkında
        </h1>
        <p className="text-sm text-slate-600">
          Şeffaf, bağımsız ve güvenilir kıdem ve ihbar tazminatı hesaplama aracı.
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">1. Misyonumuz</h2>
          <p>
            {siteConfig.siteName} (işletici: <strong>[SİTE SAHİBİ ADI]</strong>), iş sözleşmesi feshedilen veya ayrılma arifesinde olan çalışanların ve işverenlerin haklarını en anlaşılır ve hatasız biçimde öğrenebilmesi amacıyla geliştirilmiş <strong>bağımsız ve açık bir hesaplama platformudur</strong>.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">2. Veri Kaynakları ve Güncellik</h2>
          <p>
            Hesaplama algoritmamız ve referans oranlarımız yürürlükteki mevzuat hükümlerine dayanır:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-600">
            <li>Kıdem Tazminatı: 1475 Sayılı İş Kanunu Madde 14 ve Hazine ve Maliye Bakanlığı kıdem tavanı genelgeleri.</li>
            <li>İhbar Tazminatı: 4857 Sayılı İş Kanunu Madde 17.</li>
            <li>Damga Vergisi: 488 Sayılı Damga Vergisi Kanunu.</li>
          </ul>
          <p>
            Kıdem tazminatı tavanı ve vergi oranları, her dönem resmî genelgeler yayımlandıkça güncellenmekte ve sayfadaki Güven Rozeti üzerinden şeffafça ilan edilmektedir.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">3. Gizlilik ve Güvenlik Taahhüdü</h2>
          <p>
            Kullanıcılarımızın mali bilgilerini korumak adına hesaplamaların tümü tarayıcı içinde yürütülür. Maaş veya tarih bilgileri sunucuya gönderilmez, saklanmaz veya üçüncü taraflarla paylaşılmaz.
          </p>
          <p>
            Soru, görüş ve iş birliği talepleriniz için:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline font-medium">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
