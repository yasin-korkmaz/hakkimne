import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
      <span className="text-5xl font-extrabold text-blue-600">404</span>
      <h1 className="text-2xl font-bold text-slate-900">
        Sayfa Bulunamadı
      </h1>
      <p className="text-sm text-slate-600 max-w-md">
        Aradığınız sayfa taşınmış, silinmiş veya mevcut değil. Ana sayfaya dönerek hesaplamanıza devam edebilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
