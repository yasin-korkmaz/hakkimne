import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import Calculator from "./Calculator";

/**
 * MdxComponents.tsx — MDX Hibrit Bileşen ve Tipografi Haritası
 *
 * Algoritma: MDX içindeki standart HTML etiketlerini Tailwind sınıfları ile
 * kurumsal ve okunabilir bir tipografiye dönüştürür; özel araç bileşenlerini (<Calculator /> vb.)
 * içerik içine doğrudan entegre eder.
 * Yasal Dayanak: 4857 sayılı İş Kanunu ve 1475 sayılı Kanun md. 14 rehberlerinin
 * interaktif ve erişilebilir biçimde sunulmasını sağlar.
 */

export const MdxComponents = {
  // İnteraktif Hesaplama Araçları (Hibrit Model)
  Calculator,

  // Temel Tipografi ve HTML Etiketleri
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-8 mb-4 border-b border-slate-100 pb-2"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="text-slate-700 leading-relaxed text-base sm:text-lg mb-5"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside space-y-2 mb-6 text-slate-700 pl-2"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-6 text-slate-700 pl-2"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-[#1769E0] font-semibold underline underline-offset-4 hover:text-[#123C68] transition-colors"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1769E0] font-semibold underline underline-offset-4 hover:text-[#123C68] transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#1769E0] pl-4 py-2 italic text-slate-600 bg-blue-50/40 rounded-r-lg my-6"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-slate-200" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold text-slate-900" {...props} />
  ),
};

export default MdxComponents;
