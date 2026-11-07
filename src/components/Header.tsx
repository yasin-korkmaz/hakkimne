import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Header.tsx — Minimalist Logo Başlığı
 * Yalnızca kurumsal logo ve sloganı barındırır.
 * Dayanak: WCAG 2.1 AA (min 44px dokunma alanı).
 */
export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 sm:pt-7 sm:pb-5 flex items-center">
        <Link
          href="/"
          aria-label={`${siteConfig.siteName} - İş hayatında hakkını bil`}
          className="inline-flex items-center gap-3 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] min-h-[44px]"
        >
          <img
            src="/logo-icon.svg"
            alt=""
            width="32"
            height="32"
            className="w-8 h-8 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#0B1F33]">Hakkım</span>
              <span className="text-[#1769E0]">Nedir?</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-1">
              İş hayatında hakkını bil
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
