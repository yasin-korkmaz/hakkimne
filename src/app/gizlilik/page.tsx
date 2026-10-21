import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
};

export default function GizlilikPage() {
  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
        Gizlilik Politikası
      </h1>
      <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm leading-relaxed shadow-xs">
        <p className="font-medium text-slate-800">Hazırlanıyor</p>
        <p className="mt-2 text-slate-500">
          Bu sayfanın kapsamlı içerik metni hazırlık aşamasındadır. HakkımNe?, istemci taraflı çalışan ve kişisel veri toplamayan bir hesaplayıcıdır.
        </p>
      </div>
    </article>
  );
}
