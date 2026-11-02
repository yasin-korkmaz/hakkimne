"use client";

/**
 * error.tsx — İstemci Taraflı Hata Yakalama (Error Boundary) Bileşeni
 * Kurumsal tasarım tokenleri, dostane açıklama ve yeniden deneme / ana sayfa aksiyonları.
 * Dayanak: WCAG 2.1 AA erişilebilirlik ve hata yönetim standartları.
 */

import React, { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    // Hatayı sessizce konsola logla (asla sunucuya veya dış servise gönderme)
    console.error("Uygulama İstemci Hatası:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#B42318] mb-1">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-extrabold text-[#0B1F33]">Beklenmeyen Bir Durum Oluştu</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        İşlem gerçekleştirilirken geçici bir arayüz hatası meydana geldi. Cihazınızda kayıtlı verileriniz güvendedir.
      </p>

      <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 bg-[#0B1F33] hover:bg-[#123C68] text-white font-medium rounded-lg text-sm transition-colors shadow-xs min-h-[44px] flex items-center"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-sm transition-colors min-h-[44px] flex items-center"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
