import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "HakkımNe? Çerez (Cookie) Kullanımı ve Güvenlik İlkeleri",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CerezPolitikasiPage() {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Çerez Politikası
        </h1>
        <p className="text-xs text-slate-500">
          Son güncelleme tarihi: {siteConfig.lastContentUpdate}
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">1. Çerez Nedir?</h2>
          <p>
            Çerezler (cookies), ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza depolanan küçük metin dosyalarıdır.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">2. Sitemizde Çerez Kullanımı</h2>
          <p>
            {siteConfig.siteName} (işletici: <strong>Yasin Korkmaz</strong>), kullanıcıları izleyen, profil çıkaran veya hedefli reklam gösteren pazarlama çerezleri <strong>kullanmamaktadır</strong>.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-600">
            <li>Kullanıcı / Pazarlama Çerezleri: Kullanılmamaktadır.</li>
            <li>Analitik Çerezleri: Şu an aktif analitik kodu bulunmamaktadır.</li>
            <li>Reklam Çerezleri: Şu an reklam kodu bulunmamaktadır.</li>
            <li>
              Teknik ve Güvenlik Çerezleri: Barındırma altyapımız (Cloudflare), bot saldırılarını ve kötü niyetli istekleri engellemek için geçici güvenlik çerezleri işletebilir.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">3. Çerezleri Nasıl Yönetebilirsiniz?</h2>
          <p>
            Dilediğiniz zaman internet tarayıcınızın ayarlarından çerezleri silebilir veya çerez kullanımını tamamen engelleyebilirsiniz. Çerezlerin engellenmesi web sitemizin temel hesaplama işlevini etkilemez; hesaplayıcı istemci tarafında çalışmaya devam eder.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">4. İletişim</h2>
          <p>
            Çerez politikamıza ilişkin sorularınız için bize e-posta yoluyla ulaşabilirsiniz:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline font-medium">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
