import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import NoticePeriodCalculator from "@/features/notice-period/NoticePeriodCalculator";

export const metadata: Metadata = {
  title: "İhbar Süresi Hesaplama",
  description:
    "4857 sayılı İş Kanunu md. 17 uyarınca hizmet sürenize göre yasal ihbar sürenizi ve sözleşmenizin olası son iş gününü hesaplayın.",
  alternates: {
    canonical: "/ihbar-suresi-hesaplama",
  },
  openGraph: {
    title: `İhbar Süresi Hesaplama | ${siteConfig.siteName}`,
    description:
      "4857 sayılı İş Kanunu md. 17 uyarınca hizmet sürenize göre yasal ihbar sürenizi ve sözleşmenizin olası son iş gününü hesaplayın.",
    url: `${siteConfig.siteUrl}/ihbar-suresi-hesaplama`,
  },
};

export default function IhbarSuresiPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Açıklama */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          İhbar Süresi ve Bitiş Tarihi Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 Sayılı İş Kanunu Madde 17 uyarınca hizmet sürenize göre hak ettiğiniz yasal ihbar
          öneli süresini ve iş sözleşmenizin olası son çalışma gününü takvim günleriyle hesaplayın.
        </p>
      </section>

      {/* 2. Hesaplayıcı */}
      <section className="w-full">
        <NoticePeriodCalculator />
      </section>

      {/* 3. Detaylı Hesaplama Yöntemi Bağlantısı */}
      <div className="text-center -mt-4">
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] py-2 px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Detaylı hesaplama yöntemini incele →
        </Link>
      </div>

      {/* 4. Yasal Dayanak ve İhbar Kademeleri Tablosu */}
      <section className="max-w-2xl mx-auto w-full flex flex-col gap-4 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Yasal İhbar Süreleri (4857 md. 17)</h2>
        <p className="text-slate-600">
          İş sözleşmeleri, fesih bildiriminin diğer tarafa yapılmasından itibaren aşağıdaki yasal sürelerin sonunda feshedilmiş sayılır:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Hizmet Süresi (Kıdem)</th>
                <th className="px-4 py-2.5 text-right">İhbar Süresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2.5">6 aydan az sürmüş olanlar</td>
                <td className="px-4 py-2.5 text-right font-semibold">2 hafta (14 gün)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">6 aydan 1,5 yıla kadar sürmüş olanlar</td>
                <td className="px-4 py-2.5 text-right font-semibold">4 hafta (28 gün)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">1,5 yıldan 3 yıla kadar sürmüş olanlar</td>
                <td className="px-4 py-2.5 text-right font-semibold">6 hafta (42 gün)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">3 yıldan fazla sürmüş olanlar</td>
                <td className="px-4 py-2.5 text-right font-semibold">8 hafta (56 gün)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
