import React from "react";
import Link from "next/link";

/**
 * not-found.tsx — 404 Sayfa Bulunamadı Bileşeni
 * Dayanak: Kurumsal tasarım tokenleri ve kullanıcı yönlendirme standartları.
 */

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4 max-w-lg mx-auto">
      <span className="text-6xl font-extrabold text-[#1769E0]">404</span>
      <h1 className="text-2xl font-bold text-[#0B1F33]">
        Sayfa Bulunamadı
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Aradığınız sayfa taşınmış, silinmiş veya mevcut değil. Ana sayfaya dönerek hesaplamalarınıza devam edebilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-2.5 bg-[#0B1F33] hover:bg-[#123C68] text-white font-medium rounded-lg text-sm transition-colors shadow-xs min-h-[44px] flex items-center"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
