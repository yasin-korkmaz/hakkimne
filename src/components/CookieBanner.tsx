"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, Check, X } from "lucide-react";
import { initGA, CONSENT_STORAGE_KEY } from "@/lib/analytics";

/**
 * CookieBanner.tsx — KVKK Uyumlu İstemci Taraflı Çerez Onay Bildirimi
 * Dayanak: 6698 sayılı KVKK md. 5 & GDPR (Önceden Açık Rıza Alma Zorunluluğu).
 * Hydration mismatches (uyumsuzluk) önlenmesi için yalnızca istemcide render edilir.
 */

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored === null) {
        // Henüz tercih yapılmamışsa banner'ı göster
        setVisible(true);
      } else if (stored === "true") {
        // Daha önce onay verildiyse GA4'ü başlat
        initGA();
      }
    } catch {
      // localStorage erişim engeli varsa sessizce kapat
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, "true");
    } catch {}
    setVisible(false);
    initGA();
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, "false");
    } catch {}
    setVisible(false);
  };

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Çerez ve Gizlilik Tercihleri"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Metin ve İkon Alanı */}
        <div className="flex items-start gap-3.5 text-left">
          <div className="p-2.5 bg-blue-50 text-[#1769E0] rounded-xl shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Gizlilik & Çerez Politikası</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Site deneyiminizi iyileştirmek için yasal düzenlemelere (KVKK) uygun analitik
              çerezleri kullanıyoruz. Verileriniz (maaş, çalışma süresi) asla kaydedilmez.
              Ayrıntılı bilgi için{" "}
              <Link
                href="/cerez-politikasi"
                className="text-[#1769E0] hover:underline font-medium"
              >
                Çerez Politikamızı
              </Link>{" "}
              inceleyebilirsiniz.
            </p>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Çerezleri Reddet"
            className="flex-1 md:flex-initial min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span className="flex items-center justify-center gap-1.5">
              <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Reddet</span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleAccept}
            aria-label="Çerezleri Kabul Et"
            className="flex-1 md:flex-initial min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1769E0] hover:bg-[#123C68] rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Kabul Et</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
