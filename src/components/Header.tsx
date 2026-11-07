"use client";

/**
 * Header.tsx — Yalın ve Modern Navigasyon Bileşeni
 * Logo, ana navigasyon (Hesaplayıcılar, Rehber, Hakkımızda), CTA butonu ve responsive mobil menü.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma hedefleri).
 */

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Menu, X } from "lucide-react";
import { TOOL_CHIPS, MORE_TOOLS } from "./headerData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Ana Menü: Logo, Ana Linkler ve CTA */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo ve Slogan */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
          className="flex items-center gap-2.5 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px] shrink-0"
        >
          <img
            src="/logo-icon.svg"
            alt=""
            width="28"
            height="28"
            className="w-7 h-7 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight">
              <span className="text-[#0B1F33]">Hakkım</span>
              <span className="text-[#1769E0]">Nedir?</span>
            </span>
            <span className="text-[9px] font-medium text-slate-500 hidden sm:block mt-0.5">
              İş hayatında hakkını bil
            </span>
          </div>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav aria-label="Ana Menü" className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/kidem-tazminati-hesaplama"
            className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center"
          >
            Hesaplayıcılar
          </Link>
          <Link
            href="/rehber"
            className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center"
          >
            Rehber
          </Link>
          <Link
            href="/hakkinda"
            className="text-slate-700 hover:text-[#1769E0] transition-colors min-h-[44px] flex items-center"
          >
            Hakkımızda
          </Link>
        </nav>

        {/* CTA Butonu & Mobil Menü Tetikleyici */}
        <div className="flex items-center gap-2">
          <Link
            href="/kidem-tazminati-hesaplama"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#1769E0] hover:bg-[#123C68] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs min-h-[44px]"
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

      {/* Mobil Açılır Menü (Hamburger Menü) */}
      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobil Menü"
          className="md:hidden w-full bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
            Hesaplama Araçları
          </div>
          {TOOL_CHIPS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">
            Karar Destek & Kariyer
          </div>
          {MORE_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={closeMenu}
              className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium"
            >
              {tool.label}
            </Link>
          ))}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">
            Kurumsal & Bilgi
          </div>
          <Link
            href="/rehber"
            onClick={closeMenu}
            className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium"
          >
            Rehber
          </Link>
          <Link
            href="/hakkinda"
            onClick={closeMenu}
            className="text-slate-800 hover:text-[#1769E0] hover:bg-slate-50 transition-colors min-h-[44px] flex items-center px-3 py-2 rounded-lg text-sm font-medium"
          >
            Hakkımızda
          </Link>
        </nav>
      )}
    </header>
  );
}
