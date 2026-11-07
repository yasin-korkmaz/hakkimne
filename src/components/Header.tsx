"use client";

/**
 * Header.tsx — 3 Katmanlı Profesyonel Navigasyon Bileşeni
 * Katman 1 (Üst): Logo, ana navigasyon (Hesaplayıcılar, Rehber, Hakkımızda) ve CTA butonu.
 * Katman 2 (Orta): İkonlu araç chip'leri (Kıdem, İhbar, İzin, Mesai, Süre), aktif sayfa vurgusu ve Diğer Araçlar.
 * Katman 3 (Alt): İkonlu güven çubuğu (hesaplama hacmi, mevzuat tarihi, sıfır sunucu gizliliği, açık kaynak).
 * Dayanak: WCAG 2.1 AA (min 44px dokunma hedefleri) ve modern kurumsal UI mimarisi.
 */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import { TOOL_CHIPS, MORE_TOOLS, TRUST_METRICS } from "./headerData";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      {/* 1. KATMAN: Üst Bar (Logo, Ana Linkler, CTA Butonu) */}
      <div className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={closeAll}
            aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
            className="flex items-center gap-2.5 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px] shrink-0"
          >
            <img src="/logo-icon.svg" alt="" width="28" height="28" className="w-7 h-7 shrink-0" aria-hidden="true" />
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight">
                <span className="text-[#0B1F33]">Hakkım</span>
                <span className="text-[#1769E0]">Nedir?</span>
              </span>
              <span className="text-[9px] font-medium text-slate-500 hidden sm:block mt-0.5">İş hayatında hakkını bil</span>
            </div>
          </Link>

          <nav aria-label="Ana Menü" className="hidden md:flex items-center gap-4 text-xs lg:text-sm font-medium">
            <Link href="/kidem-tazminati-hesaplama" className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center">
              Hesaplayıcılar
            </Link>
            <Link href="/rehber" className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center">
              Rehber
            </Link>
            <Link href="/hakkinda" className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center">
              Hakkımızda
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/kidem-tazminati-hesaplama"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1769E0] hover:bg-[#123C68] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs min-h-[44px]"
            >
              <span>Hakkımı Hesapla</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-[#1769E0] hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. KATMAN: Orta Bar (İkonlu Araç Chip'leri & Dropdown) */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {TOOL_CHIPS.map((tool) => {
            const Icon = tool.icon;
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors shrink-0 min-h-[44px] ${
                  isActive
                    ? "bg-[#0B1F33] text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-medium"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#4CC9B0]" : "text-slate-500"}`} aria-hidden="true" />
                <span>{tool.label}</span>
              </Link>
            );
          })}

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Diğer Araçlar Menüsü"
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors shrink-0 min-h-[44px] font-medium ${
                isDropdownOpen ? "bg-[#1769E0] text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>Diğer Araçlar</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                aria-label="Diğer Araçlar"
                className="absolute top-full right-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 flex flex-col gap-0.5"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Karar Destek & Kariyer
                </div>
                {MORE_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-3 py-1.5 hover:bg-slate-50 transition-colors flex flex-col min-h-[44px] justify-center group"
                  >
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#1769E0]">{tool.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{tool.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. KATMAN: Alt Bar (Güven Çubuğu) */}
      <div className="bg-slate-50 text-[11px] text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 py-1 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
          {TRUST_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="inline-flex items-center gap-1.5 shrink-0">
                <Icon className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
                <span>{metric.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {isOpen && (
        <nav id="mobile-menu" aria-label="Mobil Menü" className="md:hidden w-full bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">Hesaplama Araçları</div>
          {TOOL_CHIPS.map((link) => (
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
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">Kurumsal & Bilgi</div>
          <Link href="/rehber" onClick={closeAll} className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium">Rehber</Link>
          <Link href="/hakkinda" onClick={closeAll} className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium">Hakkımızda</Link>
        </nav>
      )}
    </header>
  );
}
