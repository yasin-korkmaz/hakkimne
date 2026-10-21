import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function IletisimPage() {
  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
        İletişim
      </h1>
      <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm leading-relaxed shadow-xs">
        <p className="font-medium text-slate-800">Hazırlanıyor</p>
        <p className="mt-2 text-slate-500">
          Geri bildirim ve önerileriniz için e-posta adresimiz:{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </div>
    </article>
  );
}
