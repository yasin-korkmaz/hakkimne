import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  BookOpen,
} from "lucide-react";
import KullaniciSayaci from "./KullaniciSayaci";

/**
 * Hero.tsx — Ana Sayfa Karşılama ve Güven Metrikleri Bölümü
 * H1 ana başlık, alt başlık, 2 CTA butonu ve 4 adet güven istatistiği kartı içerir.
 * Dayanak: WCAG 2.1 AA ve LCP < 2.5s performans ilkeleri.
 */
export default function Hero() {
  const STATS: Array<{
    stat: React.ReactNode;
    label: string;
    desc: string;
    icon: typeof TrendingUp;
  }> = [
    {
      stat: <KullaniciSayaci />,
      label: "Hesaplama Sayısı",
      desc: "Bu ay kullanıcılar tarafından yapılan",
      icon: TrendingUp,
    },
    {
      stat: "8+",
      label: "Araç Sayısı",
      desc: "İş hukuku ve karar destek modülü",
      icon: Wrench,
    },
    {
      stat: "%100",
      label: "Tamamen Ücretsiz",
      desc: "Açık kaynak, sıfır veri kaydı & reklamsız",
      icon: CheckCircle2,
    },
    {
      stat: "2026",
      label: "Mevzuat Güncel",
      desc: "Resmî kıdem tavanı ve vergi oranları",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 pt-4 pb-2">
      {/* Üst Rozet */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold text-[#123C68]">
        <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
        Türkiye&apos;nin Bağımsız İşçi Hakları Platformu
      </div>

      {/* Ana Başlık (H1) */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F33] tracking-tight leading-tight max-w-3xl">
        İş hayatında hakkını bil.
      </h1>

      {/* Alt Başlık */}
      <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
        Kıdem tazminatından fazla mesaiye tüm haklarını saniyeler içinde öğren.
      </p>

      {/* CTA Butonları */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <a
          href="#hesaplayici"
          aria-label="Hakkımı hesapla — Haklarımı kontrol et"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1769E0] hover:bg-[#123C68] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] focus-visible:ring-offset-2"
        >
          <Calculator className="w-4 h-4" aria-hidden="true" />
          <span>Hakkımı hesapla</span>
        </a>

        <Link
          href="/rehber"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0] focus-visible:ring-offset-2"
        >
          <BookOpen className="w-4 h-4 text-slate-600" aria-hidden="true" />
          <span>Rehberi incele</span>
        </Link>
      </div>

      {/* 4 Güven İstatistiği Kartı */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-6 text-left">
        {STATS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col gap-1 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl sm:text-2xl font-black text-[#0B1F33] tracking-tight">
                  {item.stat}
                </span>
                <Icon className="w-4 h-4 text-[#1769E0]" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                {item.label}
              </span>
              <span className="text-[11px] text-slate-500 leading-tight">
                {item.desc}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
