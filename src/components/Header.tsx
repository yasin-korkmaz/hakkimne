"use client";

/**
 * Header.tsx — Responsive Üst Navigasyon Bileşeni
 * Kurumsal SVG logo, marka adı, slogan ve masaüstü/mobil navigasyon paneli.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı ve klavye erişilebilirliği).
 */

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const NAV_LINKS = [
  { href: "/kidem-tazminati-hesaplama", label: "Kıdem Tazminatı" },
  { href: "/ihbar-tazminati-hesaplama", label: "İhbar Tazminatı" },
  { href: "/yillik-izin-ucreti-hesaplama", label: "Yıllık İzin" },
  { href: "/fazla-mesai-hesaplama", label: "Fazla Mesai" },
  { href: "/ihbar-suresi-hesaplama", label: "İhbar Süresi" },
  { href: "/hak-takip-merkezi", label: "Hak Takip" },
  { href: "/belge-kontrolu", label: "Belge Kontrolü" },
  { href: "/kariyerim", label: "Kariyerim" },
  { href: "/kamu", label: "Kamu & KPSS" },
  { href: "/rehber", label: "Rehber" },
  { href: "/hakkinda", label: "Hakkımızda" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo ve Slogan */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
          className="flex items-center gap-2.5 py-1 px-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px] shrink-0"
        >
          {/* Logo İkonu */}
          <img
            src="/logo-icon.svg"
            alt=""
            width="32"
            height="32"
            className="w-8 h-8 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-[#0B1F33]">Hakkım</span>
              <span className="text-[#1769E0]">Nedir?</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 hidden sm:block mt-0.5">
              İş hayatında hakkını bil
            </span>
          </div>
        </Link>

        {/* Masaüstü Navigasyon (md ve üzeri) */}
        <nav aria-label="Ana Menü" className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-3 text-xs sm:text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center px-2 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobil Hamburger Butonu (md altı) */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="md:hidden flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-[#1769E0] hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
        >
          {isOpen ? (
            /* Kapat (X) İkonu */
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger (3 çizgi) İkonu */
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobil Açılır Menü Katmanı */}
      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobil Menü"
          className="md:hidden w-full bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-lg"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
