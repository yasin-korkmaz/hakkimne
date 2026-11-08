"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Header.tsx — Minimalist Logo & Araçlar Açılır Menüsü
 * Dayanak: WCAG 2.1 AA (min 44px dokunma hedefi) ve Apple sadeliğinde gri tonlu navigasyon.
 * 4857 ve 1475 sayılı kanun hesaplayıcılarına hızlı erişim sağlar.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const TOOLS = [
    { name: "Kıdem Tazminatı", href: "/kidem-tazminati-hesaplama" },
    { name: "İhbar Tazminatı", href: "/ihbar-tazminati-hesaplama" },
    { name: "Fazla Mesai", href: "/fazla-mesai-hesaplama" },
  ];

  // Dışarı tıklama veya Escape tuşu ile menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Sol: Logo ve Slogan */}
        <Link
          href="/"
          aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
          className="inline-flex items-center gap-2.5 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px]"
        >
          <img
            src="/logo-icon.svg"
            alt=""
            width="28"
            height="28"
            className="w-7 h-7 shrink-0"
            aria-hidden="true"
          />
          <span className="text-lg font-extrabold tracking-tight leading-none">
            <span className="text-[#0B1F33]">Hakkım</span>
            <span className="text-[#1769E0]">Nedir?</span>
          </span>
          <span
            className="hidden sm:inline-block text-slate-300 font-light text-xs"
            aria-hidden="true"
          >
            |
          </span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline-block leading-none">
            İş hayatında hakkını bil
          </span>
        </Link>

        {/* Sağ: Minimalist Araçlar Açılır Menüsü */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="Araçlar"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-200/60 rounded-lg transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Araçlar</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <div
              role="menu"
              aria-label="Hesaplama Araçları"
              className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200/90 rounded-xl shadow-lg shadow-slate-900/5 p-1.5 z-50 animate-in fade-in"
            >
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors min-h-[40px]"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
