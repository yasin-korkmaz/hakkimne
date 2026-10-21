import React from "react";
import type { Metadata } from "next";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Kıdem Tazminatı Hesaplama",
  description:
    "1475 Sayılı İş Kanunu Madde 14 kapsamında kıdem tazminatı tavanı ve hizmet süresine göre kıdem tazminatı hesaplayıcı.",
};

export default function KidemTazminatiPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kıdem Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          1475 Sayılı İş Kanunu Madde 14 uyarınca en az 1 yıllık çalışma süresi ve yasal fesih koşullarına göre kıdem tazminatınızı hesaplayın.
        </p>
      </section>

      <section className="w-full">
        <TrustBadge />
      </section>

      <section className="w-full">
        <Calculator />
      </section>
    </div>
  );
}
