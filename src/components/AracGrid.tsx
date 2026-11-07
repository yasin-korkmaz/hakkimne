import React from "react";
import Link from "next/link";
import {
  Scale,
  FileText,
  Calendar,
  Clock,
  Hourglass,
  Wallet,
  Percent,
  Award,
  ArrowUpRight,
} from "lucide-react";

/**
 * AracGrid.tsx — 2x4 Araç Kartları Grid Bileşeni
 * 5 aktif hesaplayıcı ve 3 yakında eklenecek hesaplayıcı kartını listeler.
 * Dayanak: Mobil uyum (grid-cols-2 md:grid-cols-4), WCAG 2.1 AA erişilebilirlik.
 */
export default function AracGrid() {
  const TOOLS = [
    {
      title: "Kıdem Tazminatı",
      desc: "1475 md. 14 tavan ve giydirilmiş ücret hesabı",
      href: "/kidem-tazminati-hesaplama",
      icon: Scale,
      isComingSoon: false,
    },
    {
      title: "İhbar Tazminatı",
      desc: "4857 md. 17 kademeli bildirim önelleri",
      href: "/ihbar-tazminati-hesaplama",
      icon: FileText,
      isComingSoon: false,
    },
    {
      title: "Yıllık İzin",
      desc: "md. 53/59 hak ediş gün ve brüt/net ücreti",
      href: "/yillik-izin-ucreti-hesaplama",
      icon: Calendar,
      isComingSoon: false,
    },
    {
      title: "Fazla Mesai",
      desc: "Haftalık 45 saat aşımı ve %50 zamlı saat ücreti",
      href: "/fazla-mesai-hesaplama",
      icon: Clock,
      isComingSoon: false,
    },
    {
      title: "İhbar Süresi",
      desc: "Kıdeme göre ihbar haftası ve kesin bitiş tarihi",
      href: "/ihbar-suresi-hesaplama",
      icon: Hourglass,
      isComingSoon: false,
    },
    {
      title: "Net / Brüt Maaş",
      desc: "Vergi dilimleri ve kümülatif matrah dönüşümü",
      href: "/net-brut-ucret-hesaplama",
      icon: Wallet,
      isComingSoon: false,
    },
    {
      title: "SGK Primi",
      desc: "İşçi & işveren payı ve teşvik indirimleri",
      href: "#",
      icon: Percent,
      isComingSoon: true,
    },
    {
      title: "Emeklilik",
      desc: "EYT, prim günü ve yaş haddi hesaplayıcı",
      href: "#",
      icon: Award,
      isComingSoon: true,
    },
  ];

  return (
    <section aria-labelledby="araclar-baslik" className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 id="araclar-baslik" className="text-xl sm:text-2xl font-bold text-[#0B1F33] tracking-tight">
            Hesaplama ve Karar Destek Araçları
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            İhtiyacınıza uygun hesaplayıcıyı seçin veya aşağıdaki ana motoru kullanın.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          6 Aktif / 2 Yakında
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TOOLS.map((tool, idx) => {
          const Icon = tool.icon;

          if (tool.isComingSoon) {
            return (
              <div
                key={idx}
                aria-disabled="true"
                className="relative bg-slate-50/70 border border-dashed border-slate-300 rounded-xl p-3.5 flex flex-col justify-between opacity-75 cursor-not-allowed select-none min-h-[110px]"
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-400">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Yakında
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-700">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              href={tool.href}
              className="group relative bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-[#1769E0] hover:shadow-sm transition-all flex flex-col justify-between min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1769E0] flex items-center justify-center group-hover:bg-[#1769E0] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1769E0] transition-colors" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
