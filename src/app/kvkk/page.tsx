/* TASLAK — hukuk kontrolü gerekli */

import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni",
};

export default function KvkkPage() {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-xs text-slate-500">
          Son güncelleme tarihi: {siteConfig.lastContentUpdate}
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">1. Veri Sorumlusu</h2>
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, veri sorumlusu sıfatıyla{" "}
            <strong>[SİTE SAHİBİ ADI]</strong> (varsa ticari unvan: <em>[ŞİRKET UNVANI]</em>, Vergi No: <em>[VERGİ DAİRESİ / NO]</em>, Adres: <em>[ADRES]</em>) tarafından hazırlanmıştır.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">2. İstemci Taraflı Çalışma ve İşlenmeyen Veriler</h2>
          <p>
            {siteConfig.siteName} üzerinde sunulan kıdem ve ihbar tazminatı hesaplama aracı <strong>tamamen tarayıcınızda (istemci tarafında)</strong> çalışır. Form alanlarına girdiğiniz maaş, işe giriş tarihi, işten çıkış tarihi, ek ödemeler veya fesih gerekçeleri sunucularımıza iletilmez, herhangi bir veri tabanında kaydedilmez ve saklanmaz.
          </p>
          <p>
            Sitemizde üyelik, kayıt, profil oluşturma veya hesap açma gibi kişisel veri toplayan işlevler bulunmamaktadır.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">3. Teknik Erişim Kayıtları ve Güvenlik</h2>
          <p>
            Web sitemiz statik dosyalar olarak barındırılmaktadır. Barındırma sağlayıcısı (Cloudflare) teknik erişim kayıtlarında IP adresi gibi verileri ağ güvenliğini sağlama ve kötüye kullanımı engelleme amacıyla geçici olarak tutabilir [DOĞRULANACAK].
          </p>
          <p>
            Reklam: [DOĞRULANACAK: şu an reklam yoktur]. Analitik: [DOĞRULANACAK: şu an aktif analitik kodu bulunmamaktadır].
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">4. İlgili Kişi Olarak Haklarınız ve Başvuru</h2>
          <p>
            KVKK'nın 11. maddesi uyarınca veri sorumlusuna başvurarak kişisel verilerinizin işlenip işlenmediğini öğrenme ve yasal haklarınızı kullanma yetkiniz bulunmaktadır. Sitemiz hesaplama girdilerini toplamadığından sistemlerimizde kişisel veri havuzu oluşmamaktadır.
          </p>
          <p>
            Veri sorumlusu temsilcisi: <em>[DPO / VERİ SORUMLUSU TEMSİLCİSİ]</em>. Her türlü soru, görüş ve başvurularınız için resmi iletişim kanalı e-posta adresimizdir:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline font-medium">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
