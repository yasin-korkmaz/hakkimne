import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Header.tsx — İnce ve Zarif Logo Şeridi
 * Logo ve sloganı tek satırda (yan yana) hizalar; dikey alanı daraltarak şık bir şerit sunar.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı).
 */
export default function Header() {
  return (
    <header className="w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex items-center">
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
          <span className="hidden sm:inline-block text-slate-300 font-light text-xs" aria-hidden="true">
            |
          </span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline-block leading-none">
            İş hayatında hakkını bil
          </span>
        </Link>
      </div>
    </header>
  );
}
