import React from "react";
import type { Metadata } from "next";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "İhbar Tazminatı Hesaplama",
  description:
    "4857 Sayılı İş Kanunu Madde 17 kapsamında hizmet süresi kademelerine göre ihbar süresi ve ihbar tazminatı hesaplayıcı.",
};

export default function IhbarTazminatiPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          İhbar Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          4857 Sayılı İş Kanunu Madde 17 uyarınca ihbar öneli kullandırılmayan hallerde çalışma süresine göre hak kazanılan ihbar tazminatınızı hesaplayın.
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
