import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Footer.tsx — Alt Bilgi Bileşeni
 * Yasal bağlantılar, sorumluluk reddi beyanı, telif hakkı ve kurucu/geliştirici imzasını içerir.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma hedefleri) ve açık kaynak şeffaflığı.
 */

const LEGAL_LINKS = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 text-xs text-slate-600 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6">
        {/* 1. Yasal Bağlantılar */}
        <nav aria-label="Yasal Bağlantılar" className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 justify-center sm:justify-start">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-slate-900 transition-colors min-h-[44px] flex items-center px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 2. Sorumluluk Reddi (Disclaimer) ve Güncelleme Bilgisi */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-slate-700 leading-relaxed">
          <p>
            <strong>Yasal Uyarı:</strong> Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık değildir. Sonuç, fesih nedeni ve ek koşullara göre değişebilir.
          </p>
          <p className="text-slate-600">
            Son Mevzuat ve İçerik Güncellemesi: {siteConfig.lastContentUpdate}
          </p>
        </div>

        {/* 3. Telif Hakkı ve Kurucu/Geliştirici İmzası */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 text-slate-600 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.siteName}. Tüm hakları saklıdır.
          </p>
          <p className="flex items-center gap-1.5 flex-wrap justify-center">
            <span>Kurucu ve Geliştirici:</span>
            <a
              href="https://github.com/yasin-korkmaz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-800 hover:text-blue-600 transition-colors inline-flex items-center gap-1 min-h-[44px] px-1.5 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Yasin Korkmaz</span>
              <svg
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
