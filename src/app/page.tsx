import React from "react";
import TrustBadge from "@/components/TrustBadge";
import Calculator from "@/components/Calculator";
import ExplainSection from "@/components/ExplainSection";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. Başlık ve Tanıtım */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kıdem ve İhbar Tazminatı Hesaplama
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          1475 ve 4857 sayılı kanunlar kapsamında kıdem ve ihbar tazminatınızı güncel tavan ve oranlarla adım adım hesaplayın.
          Tüm veriler tarayıcınızda işlenir; hiçbir kişisel veri sunuculara iletilmez veya kaydedilmez.
        </p>
      </section>

      {/* 2. Güven Rozeti */}
      <section className="w-full">
        <TrustBadge />
      </section>

      {/* 3. Hesaplayıcı */}
      <section className="w-full">
        <Calculator />
      </section>

      {/* 4. Nasıl Hesaplanır ve Örnek Hesaplama */}
      <ExplainSection />

      {/* 5. Sıkça Sorulan Sorular */}
      <FaqSection />
    </div>
  );
}
