/* TASLAK — hukuk kontrolü gerekli */

import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "HakkımNedir? İletişim ve Hata Bildirim Kanalı",
  robots: { index: false, follow: false },
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  const bugReportSubject = encodeURIComponent("Bu hesaplamada hata gördüm");
  const bugReportBody = encodeURIComponent(
    "Merhaba,\n\nHakkımNedir? hesaplama aracında aşağıdaki girdilerle bir hesaplama yaptım ve şu hatayı fark ettim:\n\n- İşe Giriş Tarihi:\n- İşten Çıkış Tarihi:\n- Fesih Nedeni:\n- Aylık Brüt Maaş:\n- Karşılaştığım Durum / Beklenen Sonuç:\n\nTeşekkürler."
  );
  const bugReportMailto = `mailto:${siteConfig.contactEmail}?subject=${bugReportSubject}&body=${bugReportBody}`;

  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          İletişim
        </h1>
        <p className="text-sm text-slate-600">
          Görüş, öneri ve teknik hata bildirimleriniz için bize ulaşabilirsiniz.
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">E-Posta ile İletişim</h2>
          <p>
            {siteConfig.siteName} işleticisi <strong>Yasin Korkmaz</strong> ile resmi olarak e-posta üzerinden iletişime geçebilirsiniz:
          </p>
          <div className="pt-1">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>{siteConfig.contactEmail}</span>
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-3 pt-2 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Hesaplama Hatası Bildirimi</h2>
          <p>
            Hesaplama formülünde, tavan parametrelerinde veya kanuni uyarı metinlerinde bir hata veya eksiklik fark ettiyseniz, aşağıdaki hazır bağlantıyı kullanarak doğrudan teknik ekibimize bildirebilirsiniz:
          </p>
          <div>
            <a
              href={bugReportMailto}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
            >
              <span>Bu hesaplamada hata gördüm</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <p>Fiziksel Adres: <em>[ADRES]</em> · Ticari Bilgiler: <em>[ŞİRKET UNVANI]</em> · Vergi Dairesi: <em>[VERGİ DAİRESİ / NO]</em></p>
        </section>
      </div>
    </article>
  );
}
