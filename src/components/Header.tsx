"use client";

/**
 * Header.tsx — Responsive Üst Navigasyon Bileşeni
 * Kurumsal SVG logo, temel hesaplayıcılar, "Diğer Araçlar" açılır menüsü ve mobil çekmece.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı ve klavye erişilebilirliği).
 */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const PRIMARY_LINKS = [
  { href: "/kidem-tazminati-hesaplama", label: "Kıdem Tazminatı" },
  { href: "/ihbar-tazminati-hesaplama", label: "İhbar Tazminatı" },
  { href: "/yillik-izin-ucreti-hesaplama", label: "Yıllık İzin" },
  { href: "/fazla-mesai-hesaplama", label: "Fazla Mesai" },
  { href: "/ihbar-suresi-hesaplama", label: "İhbar Süresi" },
];

const MORE_TOOLS = [
  { href: "/hak-takip-merkezi", label: "Hak Takip Merkezi", desc: "Çalışma süresi, izin ve mesai takibi" },
  { href: "/belge-kontrolu", label: "Belge Kontrolü", desc: "Bordro ve sözleşme risk analizi" },
  { href: "/kariyerim", label: "Kariyerim", desc: "Teklif kıyaslama ve mülakat simülatörü" },
  { href: "/kamu", label: "Kamu & KPSS", desc: "Önlisans kadro ve 3249 nitelik rehberi" },
];

const SECONDARY_LINKS = [
  { href: "/rehber", label: "Rehber" },
  { href: "/hakkinda", label: "Hakkımızda" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklama veya Escape tuşu ile dropdown kapatma
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDropdownOpen(false);
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const closeAll = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo ve Slogan */}
        <Link
          href="/"
          onClick={closeAll}
          aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
          className="flex items-center gap-2.5 py-1 px-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px] shrink-0"
        >
          <img src="/logo-icon.svg" alt="" width="32" height="32" className="w-8 h-8 shrink-0" aria-hidden="true" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-[#0B1F33]">Hakkım</span>
              <span className="text-[#1769E0]">Nedir?</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 hidden sm:block mt-0.5">İş hayatında hakkını bil</span>
          </div>
        </Link>

        {/* Masaüstü Navigasyon (md ve üzeri) */}
        <nav aria-label="Ana Menü" className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center px-2 lg:px-2.5 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          {/* Diğer Araçlar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Diğer Araçlar Menüsü"
              className={`transition-colors min-h-[44px] flex items-center gap-1 px-2 lg:px-2.5 py-2 rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] ${
                isDropdownOpen ? "text-[#1769E0] bg-blue-50/60" : "text-slate-700 hover:text-[#1769E0]"
              }`}
            >
              <span>Diğer Araçlar</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                aria-label="Diğer Araçlar"
                className="absolute top-full right-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 flex flex-col gap-0.5"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Karar Destek & Kariyer
                </div>
                {MORE_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-3 py-2 hover:bg-slate-50 transition-colors flex flex-col group min-h-[44px] justify-center"
                  >
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#1769E0]">{tool.label}</span>
                    <span className="text-[11px] text-slate-500 leading-tight">{tool.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {SECONDARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center px-2 lg:px-2.5 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobil Hamburger Butonu (md altı) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="md:hidden flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:text-[#1769E0] hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobil Açılır Menü Katmanı */}
      {isOpen && (
        <nav id="mobile-menu" aria-label="Mobil Menü" className="md:hidden w-full bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-2 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">Hesaplama Araçları</div>
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeAll} className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium">
              {link.label}
            </Link>
          ))}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">Karar Destek & Kariyer</div>
          {MORE_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} onClick={closeAll} className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium">
              {tool.label}
            </Link>
          ))}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">Bilgi & Kurumsal</div>
          {SECONDARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeAll} className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
