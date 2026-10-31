import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "HakkımNedir? Gizlilik Politikası ve Sıfır Veri Saklama İlkeleri",
  robots: { index: false, follow: false },
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Gizlilik Politikası
        </h1>
        <p className="text-xs text-slate-500">
          Son güncelleme tarihi: {siteConfig.lastContentUpdate}
        </p>
      </header>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">1. Genel İlke ve Amaç</h2>
          <p>
            {siteConfig.siteName} (işletici: <strong>Yasin Korkmaz</strong>), çalışanların ve işverenlerin yasal kıdem ve ihbar tazminatı haklarını şeffaf ve güvenli bir şekilde hesaplayabilmesi için kurulmuştur. Gizliliğinizi korumak temel tasarım ilkemizdir.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">2. Sıfır Veri Depolama Garantisi</h2>
          <p>
            Hesaplama motorumuz tamamen <strong>istemci taraflı (tarayıcınızda)</strong> çalışır. Hesaplama formuna girdiğiniz maaş, tarih ve tazminat bilgileri hesaplama için doğrudan tarayıcınızda işlenir ve HakkımNedir? uygulama sunucusuna gönderilmez. Ancak barındırma sağlayıcımız (Cloudflare), hizmet güvenliği ve analitik amaçlarla IP adresi gibi teknik bağlantı verilerini kendi altyapısında otomatik olarak işleyebilir.
          </p>
          <p>
            Sitede üyelik veya hesap oluşturma özelliği bulunmamaktadır; bu nedenle ad, soyad, e-posta veya kimlik numarası gibi kullanıcı profili verileri talep edilmez.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">3. İzleyiciler, Analitik ve Reklamlar</h2>
          <p>
            Sitemizde kullanıcı davranışlarını takip eden üçüncü taraf reklam pikselleri veya pazarlama izleyicileri yer almaz.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-600">
            <li>Reklam: Şu an reklam kodu bulunmamaktadır.</li>
            <li>Analitik: Şu an aktif analitik kodu bulunmamaktadır.</li>
            <li>
              Barındırma: Barındırma sağlayıcımız (Cloudflare), siber saldırıları önlemek ve ağ güvenliğini temin etmek amacıyla geçici IP erişim kayıtları tutabilir.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">4. İletişim</h2>
          <p>
            Gizlilik politikamıza ilişkin tüm soru ve değerlendirmeleriniz için bize ulaşabilirsiniz:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline font-medium">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
